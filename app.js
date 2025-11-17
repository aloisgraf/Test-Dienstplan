import { schedule, shiftLabels } from './schedule-data.js';

const nightShifts = new Set(['NCN', 'NdN']);
const weekendDays = new Set(['Saturday', 'Sunday']);
const shiftOrder = Object.keys(shiftLabels);

const employeeFilter = document.getElementById('employeeFilter');
const shiftFilter = document.getElementById('shiftFilter');
const weekendFilter = document.getElementById('weekendFilter');
const resetButton = document.getElementById('resetFilters');
const scheduleTable = document.querySelector('#scheduleTable tbody');
const summaryTable = document.querySelector('#summaryTable tbody');
const resultCount = document.getElementById('resultCount');

const employees = Array.from(
  new Set(schedule.flatMap((entry) => shiftOrder.map((role) => entry.shifts[role])))
).sort((a, b) => a.localeCompare(b, 'de'));

function populateFilters() {
  employeeFilter.innerHTML = '<option value="">Alle anzeigen</option>' +
    employees.map((emp) => `<option value="${emp}">${emp}</option>`).join('');
  shiftOrder.forEach((shiftKey) => {
    const option = document.createElement('option');
    option.value = shiftKey;
    option.textContent = `${shiftKey} · ${shiftLabels[shiftKey]}`;
    shiftFilter.appendChild(option);
  });
}

function isWeekend(weekday) {
  return weekendDays.has(weekday);
}

function filterSchedule() {
  const selectedEmployee = employeeFilter.value;
  const selectedShift = shiftFilter.value;
  const weekendsOnly = weekendFilter.checked;

  return schedule.filter((entry) => {
    if (weekendsOnly && !isWeekend(entry.weekday)) return false;
    if (!selectedEmployee && !selectedShift) return true;

    const matchesShift = selectedShift ? entry.shifts[selectedShift] === selectedEmployee || !selectedEmployee : true;
    const matchesEmployee = selectedEmployee ? Object.values(entry.shifts).includes(selectedEmployee) : true;

    if (selectedEmployee && selectedShift) {
      return entry.shifts[selectedShift] === selectedEmployee;
    }
    if (selectedEmployee) return matchesEmployee;
    if (selectedShift) return !!entry.shifts[selectedShift];
    return true;
  });
}

function renderSchedule(rows) {
  scheduleTable.innerHTML = '';

  rows.forEach((entry) => {
    const tr = document.createElement('tr');
    if (isWeekend(entry.weekday)) {
      tr.classList.add('weekend');
    }

    const selectedEmployee = employeeFilter.value;

    tr.innerHTML = `
      <td>${entry.day}</td>
      <td>${entry.date}</td>
      <td>${entry.weekday}</td>
      ${shiftOrder.map((shift) => {
        const assignee = entry.shifts[shift];
        const nightClass = nightShifts.has(shift) ? 'night' : '';
        const highlight = selectedEmployee && assignee === selectedEmployee ? 'highlight' : '';
        const label = nightShifts.has(shift) ? `<strong>${assignee}</strong>` : assignee;
        return `<td class="${[nightClass, highlight].join(' ').trim()}">${label}</td>`;
      }).join('')}
    `;

    scheduleTable.appendChild(tr);
  });

  resultCount.textContent = `${rows.length} von ${schedule.length} Tagen angezeigt`;
}

function computeSummary(rows) {
  const stats = new Map();
  const ensure = (name) => {
    if (!stats.has(name)) {
      stats.set(name, { shifts: 0, hours: 0, nights: 0, weekendDays: 0 });
    }
    return stats.get(name);
  };

  rows.forEach((entry) => {
    const weekend = isWeekend(entry.weekday);
    shiftOrder.forEach((shift) => {
      const emp = entry.shifts[shift];
      const row = ensure(emp);
      row.shifts += 1;
      row.hours += 12;
      if (nightShifts.has(shift)) row.nights += 1;
      if (weekend) row.weekendDays += 1;
    });
  });

  return Array.from(stats.entries()).sort((a, b) => a[0].localeCompare(b[0], 'de'));
}

function renderSummary(rows) {
  const stats = computeSummary(rows);
  summaryTable.innerHTML = stats.map(([name, data]) => `
    <tr>
      <td>${name}</td>
      <td>${data.shifts}</td>
      <td>${data.hours}</td>
      <td>${data.nights}</td>
      <td>${data.weekendDays}</td>
    </tr>
  `).join('');
}

function refresh() {
  const filtered = filterSchedule();
  renderSchedule(filtered);
  renderSummary(filtered);
}

populateFilters();
refresh();

employeeFilter.addEventListener('change', refresh);
shiftFilter.addEventListener('change', refresh);
weekendFilter.addEventListener('change', refresh);
resetButton.addEventListener('click', () => {
  employeeFilter.value = '';
  shiftFilter.value = '';
  weekendFilter.checked = false;
  refresh();
});
