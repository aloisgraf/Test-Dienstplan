const STORAGE_KEYS = {
  employees: 'dienstplan_employees',
  services: 'dienstplan_services',
  functions: 'dienstplan_functions',
  employmentTypes: 'dienstplan_employment_types',
  rules: 'dienstplan_rules',
  assignments: 'dienstplan_assignments',
  locks: 'dienstplan_locks',
};

const clone = (value) =>
  typeof structuredClone === 'function' ? structuredClone(value) : JSON.parse(JSON.stringify(value));

const uuid = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2));

const DEFAULT_EMPLOYMENT = [
  { id: uuid(), percent: 100, hours: 173 },
  { id: uuid(), percent: 80, hours: 138 },
  { id: uuid(), percent: 50, hours: 86 },
];

const DEFAULT_SERVICES = [
  { id: uuid(), name: 'NCN', start: '19:00', end: '07:00' },
  { id: uuid(), name: 'NdN', start: '19:00', end: '07:00' },
  { id: uuid(), name: 'ND1', start: '07:00', end: '19:00' },
  { id: uuid(), name: 'C1', start: '07:00', end: '19:00' },
];

const DEFAULT_FUNCTIONS = (services) => [
  { id: uuid(), name: 'Disponent*in', serviceIds: services.filter((s) => s.name.toLowerCase().includes('d')).map((s) => s.id) },
  { id: uuid(), name: 'Calltaker', serviceIds: services.filter((s) => s.name.toLowerCase().includes('c')).map((s) => s.id) },
];

const DEFAULT_EMPLOYEES = (employment, functions) => [
  {
    id: uuid(),
    firstName: 'Alex',
    lastName: 'Huber',
    personnelNumber: '1001',
    birthday: '1988-05-12',
    employmentPercent: employment[0].id,
    employmentHours: employment[0].id,
    functionId: functions[0].id,
    nightAllowed: true,
    rkt: false,
  },
  {
    id: uuid(),
    firstName: 'Bianca',
    lastName: 'Mayr',
    personnelNumber: '1002',
    birthday: '1990-09-02',
    employmentPercent: employment[1].id,
    employmentHours: employment[1].id,
    functionId: functions[1].id,
    nightAllowed: true,
    rkt: true,
  },
  {
    id: uuid(),
    firstName: 'Chris',
    lastName: 'Lenz',
    personnelNumber: '1003',
    birthday: '1992-03-21',
    employmentPercent: employment[2].id,
    employmentHours: employment[2].id,
    functionId: functions[0].id,
    nightAllowed: false,
    rkt: false,
  },
];

const DEFAULT_RULES = { restDays: 1, maxHoursWeek: 40, maxHoursMonth: 173, maxWeekendDays: 6, maxNights: 8 };

const SALZBURG_HOLIDAYS = {
  // month-day: label
  '01-01': 'Neujahr',
  '01-06': 'Heilige Drei Könige',
  '04-10': 'Ostermontag',
  '05-01': 'Staatsfeiertag',
  '05-18': 'Christi Himmelfahrt',
  '05-29': 'Pfingstmontag',
  '06-08': 'Fronleichnam',
  '08-15': 'Mariä Himmelfahrt',
  '10-26': 'Nationalfeiertag',
  '11-01': 'Allerheiligen',
  '12-08': 'Maria Empfängnis',
  '12-25': 'Christtag',
  '12-26': 'Stefanitag',
};

const menuButtons = document.querySelectorAll('.main-menu button');
const screens = document.querySelectorAll('[data-screen]');
const employeeForm = document.getElementById('employeeForm');
const serviceForm = document.getElementById('serviceForm');
const functionForm = document.getElementById('functionForm');
const employmentForm = document.getElementById('employmentForm');
const rulesForm = document.getElementById('rulesForm');
const employeeList = document.getElementById('employeeList');
const serviceList = document.getElementById('serviceList');
const functionList = document.getElementById('functionList');
const employmentList = document.getElementById('employmentList');
const rulesSummary = document.getElementById('rulesSummary');
const functionSelect = document.getElementById('functionSelect');
const functionServices = document.getElementById('functionServices');
const employmentPercentSelect = document.getElementById('employmentPercentSelect');
const employmentHoursSelect = document.getElementById('employmentHoursSelect');
const employeePicker = document.getElementById('employeePicker');
const servicePicker = document.getElementById('servicePicker');
const functionPicker = document.getElementById('functionPicker');
const employmentPicker = document.getElementById('employmentPicker');
const rosterTable = document.getElementById('rosterTable');
const monthLabel = document.getElementById('monthLabel');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const generateBtn = document.getElementById('generatePlan');

let state = loadState();
let currentMonth = new Date();
currentMonth.setDate(1);
const editing = { employee: null, service: null, function: null, employment: null };

function loadState() {
  const employment = loadArray(STORAGE_KEYS.employmentTypes, DEFAULT_EMPLOYMENT);
  const services = loadArray(STORAGE_KEYS.services, DEFAULT_SERVICES);
  const functions = loadArray(STORAGE_KEYS.functions, DEFAULT_FUNCTIONS(services));
  const employees = loadArray(STORAGE_KEYS.employees, DEFAULT_EMPLOYEES(employment, functions));
  const rules = loadValue(STORAGE_KEYS.rules, DEFAULT_RULES);
  const assignments = loadValue(STORAGE_KEYS.assignments, {});
  const locks = loadValue(STORAGE_KEYS.locks, {});
  return { employment, services, functions, employees, rules, assignments, locks };
}

function loadArray(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return clone(fallback);
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Konnte Daten nicht laden, verwende Fallback', key, e);
    localStorage.setItem(key, JSON.stringify(fallback));
    return clone(fallback);
  }
}

function loadValue(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return clone(fallback);
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return clone(fallback);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEYS.employees, JSON.stringify(state.employees));
  localStorage.setItem(STORAGE_KEYS.services, JSON.stringify(state.services));
  localStorage.setItem(STORAGE_KEYS.functions, JSON.stringify(state.functions));
  localStorage.setItem(STORAGE_KEYS.employmentTypes, JSON.stringify(state.employment));
  localStorage.setItem(STORAGE_KEYS.rules, JSON.stringify(state.rules));
  localStorage.setItem(STORAGE_KEYS.assignments, JSON.stringify(state.assignments));
  localStorage.setItem(STORAGE_KEYS.locks, JSON.stringify(state.locks));
}

function formatName(emp) {
  return `${emp.firstName} ${emp.lastName}`;
}

function getMonthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function daysInMonth(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  return new Date(year, month + 1, 0).getDate();
}

function weekdayLabel(date) {
  return date.toLocaleDateString('de-AT', { weekday: 'long' });
}

function isWeekend(date) {
  const w = date.getDay();
  return w === 0 || w === 6;
}

function isHoliday(date) {
  const key = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  return SALZBURG_HOLIDAYS[key];
}

function parseTime(timeString) {
  const [h, m] = timeString.split(':').map(Number);
  return h + m / 60;
}

function serviceDuration(service) {
  const start = parseTime(service.start);
  const end = parseTime(service.end);
  const duration = end >= start ? end - start : 24 - start + end;
  return Math.max(duration, 0);
}

function formatHoursLabel(value) {
  if (!Number.isFinite(value)) return '–';
  const formatted = Number.isInteger(value) ? value.toString() : value.toFixed(1);
  return `${formatted} Std`;
}

function updateDropdowns() {
  const prevEmployee = employeePicker.value;
  const prevService = servicePicker.value;
  const prevFunction = functionPicker.value;
  const prevEmployment = employmentPicker.value;
  employmentPercentSelect.innerHTML = state.employment.map((e) => `<option value="${e.id}">${e.percent}%</option>`).join('');
  employmentHoursSelect.innerHTML = state.employment.map((e) => `<option value="${e.id}">${e.hours} Std.</option>`).join('');
  functionSelect.innerHTML = '<option value="">Keine Funktion</option>' + state.functions.map((f) => `<option value="${f.id}">${f.name}</option>`).join('');
  functionServices.innerHTML = state.services.map((s) => `<option value="${s.id}">${s.name} (${s.start}–${s.end})</option>`).join('');
  employeePicker.innerHTML = ['<option value="">Neu anlegen</option>']
    .concat(state.employees.map((e) => `<option value="${e.id}">${e.lastName}, ${e.firstName}</option>`))
    .join('');
  servicePicker.innerHTML = ['<option value="">Neu anlegen</option>']
    .concat(state.services.map((s) => `<option value="${s.id}">${s.name}</option>`))
    .join('');
  functionPicker.innerHTML = ['<option value="">Neu anlegen</option>']
    .concat(state.functions.map((f) => `<option value="${f.id}">${f.name}</option>`))
    .join('');
  employmentPicker.innerHTML = ['<option value="">Neu anlegen</option>']
    .concat(state.employment.map((e) => `<option value="${e.id}">${e.percent}% · ${e.hours} Std</option>`))
    .join('');
  if (prevEmployee && state.employees.some((e) => e.id === prevEmployee)) employeePicker.value = prevEmployee;
  if (prevService && state.services.some((s) => s.id === prevService)) servicePicker.value = prevService;
  if (prevFunction && state.functions.some((f) => f.id === prevFunction)) functionPicker.value = prevFunction;
  if (prevEmployment && state.employment.some((e) => e.id === prevEmployment)) employmentPicker.value = prevEmployment;
}

function renderEmployees() {
  updateDropdowns();
  employeeList.innerHTML = state.employees
    .map((emp) => {
      const percent = state.employment.find((e) => e.id === emp.employmentPercent);
      const hours = state.employment.find((e) => e.id === emp.employmentHours);
      const func = state.functions.find((f) => f.id === emp.functionId);
      return `<div class="item"><div><strong>${formatName(emp)}</strong><br><small>PNR ${emp.personnelNumber} · ${emp.birthday}</small></div><div><small>${percent?.percent ?? '?'}% / ${hours?.hours ?? '?'} Std · ${func?.name ?? 'keine'} · Nacht: ${emp.nightAllowed ? 'ja' : 'nein'} · RKT: ${emp.rkt ? 'ja' : 'nein'}</small></div></div>`;
    })
    .join('');
}

function renderServices() {
  serviceList.innerHTML = state.services.map((s) => `<div class="item"><strong>${s.name}</strong><small>${s.start} – ${s.end} (${serviceDuration(s)}h)</small></div>`).join('');
}

function renderFunctions() {
  functionList.innerHTML = state.functions.map((f) => {
    const names = f.serviceIds.map((id) => state.services.find((s) => s.id === id)?.name || '');
    return `<div class="item"><div><strong>${f.name}</strong></div><small>Dienste: ${names.filter(Boolean).join(', ') || 'Keine'}</small></div>`;
  }).join('');
}

function renderEmployment() {
  employmentList.innerHTML = state.employment.map((e) => `<div class="item"><strong>${e.percent}%</strong><small>${e.hours} Stunden/Monat</small></div>`).join('');
}

function renderRules() {
  const r = state.rules;
  rulesSummary.innerHTML = `<div class="item"><div><strong>Aktive Regeln</strong></div><small>Ruhe: ${r.restDays ?? '–'} Tage · Woche max: ${r.maxHoursWeek ?? '–'} Std · Monat max: ${r.maxHoursMonth ?? '–'} Std · Wochenenden: ${r.maxWeekendDays ?? '–'} · Nachtdienste: ${r.maxNights ?? '–'}</small></div>`;
}

function fillEmployeeForm(emp) {
  const form = employeeForm.elements;
  form.firstName.value = emp.firstName || '';
  form.lastName.value = emp.lastName || '';
  form.personnelNumber.value = emp.personnelNumber || '';
  form.birthday.value = emp.birthday || '';
  form.employmentPercent.value = emp.employmentPercent || '';
  form.employmentHours.value = emp.employmentHours || '';
  form.functionId.value = emp.functionId || '';
  form.nightAllowed.checked = !!emp.nightAllowed;
  form.rkt.checked = !!emp.rkt;
}

function fillServiceForm(service) {
  const form = serviceForm.elements;
  form.name.value = service.name || '';
  form.start.value = service.start || '';
  form.end.value = service.end || '';
}

function fillFunctionForm(func) {
  const form = functionForm.elements;
  form.name.value = func.name || '';
  Array.from(functionServices.options).forEach((opt) => {
    opt.selected = func.serviceIds?.includes(opt.value);
  });
}

function fillEmploymentForm(entry) {
  const form = employmentForm.elements;
  form.percent.value = entry.percent ?? '';
  form.hours.value = entry.hours ?? '';
}

function handleEmployeeForm(e) {
  e.preventDefault();
  const data = new FormData(employeeForm);
  const entry = {
    id: editing.employee ?? uuid(),
    firstName: data.get('firstName').trim(),
    lastName: data.get('lastName').trim(),
    personnelNumber: data.get('personnelNumber').trim(),
    birthday: data.get('birthday'),
    employmentPercent: data.get('employmentPercent'),
    employmentHours: data.get('employmentHours'),
    functionId: data.get('functionId'),
    nightAllowed: data.get('nightAllowed') === 'on',
    rkt: data.get('rkt') === 'on',
  };

  if (editing.employee) {
    if (!confirm('Wollen Sie die Änderungen wirklich speichern?')) return;
    const idx = state.employees.findIndex((emp) => emp.id === editing.employee);
    if (idx !== -1) {
      state.employees[idx] = entry;
    }
  } else {
    state.employees.push(entry);
    editing.employee = entry.id;
    employeePicker.value = entry.id;
  }
  saveState();
  updateDropdowns();
  renderEmployees();
  renderRoster();
  fillEmployeeForm(entry);
}

function handleServiceForm(e) {
  e.preventDefault();
  const data = new FormData(serviceForm);
  const entry = { id: editing.service ?? uuid(), name: data.get('name').trim(), start: data.get('start'), end: data.get('end') };

  if (editing.service) {
    if (!confirm('Wollen Sie die Änderungen wirklich speichern?')) return;
    const idx = state.services.findIndex((s) => s.id === editing.service);
    if (idx !== -1) state.services[idx] = entry;
  } else {
    state.services.push(entry);
    editing.service = entry.id;
    servicePicker.value = entry.id;
  }
  saveState();
  updateDropdowns();
  renderServices();
  renderFunctions();
  renderRoster();
  fillServiceForm(entry);
}

function handleFunctionForm(e) {
  e.preventDefault();
  const data = new FormData(functionForm);
  const serviceIds = data.getAll('serviceIds');
  const entry = { id: editing.function ?? uuid(), name: data.get('name').trim(), serviceIds };

  if (editing.function) {
    if (!confirm('Wollen Sie die Änderungen wirklich speichern?')) return;
    const idx = state.functions.findIndex((f) => f.id === editing.function);
    if (idx !== -1) state.functions[idx] = entry;
  } else {
    state.functions.push(entry);
    editing.function = entry.id;
    functionPicker.value = entry.id;
  }
  saveState();
  updateDropdowns();
  renderFunctions();
  renderRoster();
  fillFunctionForm(entry);
}

function handleEmploymentForm(e) {
  e.preventDefault();
  const data = new FormData(employmentForm);
  const entry = { id: editing.employment ?? uuid(), percent: Number(data.get('percent')), hours: Number(data.get('hours')) };

  if (editing.employment) {
    if (!confirm('Wollen Sie die Änderungen wirklich speichern?')) return;
    const idx = state.employment.findIndex((eItem) => eItem.id === editing.employment);
    if (idx !== -1) state.employment[idx] = entry;
  } else {
    state.employment.push(entry);
    editing.employment = entry.id;
    employmentPicker.value = entry.id;
  }
  saveState();
  updateDropdowns();
  renderEmployment();
  renderEmployees();
  renderRoster();
  fillEmploymentForm(entry);
}

function handleRulesForm(e) {
  e.preventDefault();
  const data = new FormData(rulesForm);
  state.rules = {
    restDays: toNumber(data.get('restDays')),
    maxHoursWeek: toNumber(data.get('maxHoursWeek')),
    maxHoursMonth: toNumber(data.get('maxHoursMonth')),
    maxWeekendDays: toNumber(data.get('maxWeekendDays')),
    maxNights: toNumber(data.get('maxNights')),
  };
  saveState();
  renderRules();
}

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function showScreen(target) {
  menuButtons.forEach((btn) => btn.classList.toggle('active', btn.dataset.target === target));
  screens.forEach((panel) => {
    if (panel.dataset.screen === target) {
      panel.removeAttribute('hidden');
    } else {
      panel.setAttribute('hidden', '');
    }
  });
  if (target === 'roster') {
    renderRoster();
  }
}

function buildRosterHeader(date) {
  const days = daysInMonth(date);
  const headerRows = [document.createElement('tr'), document.createElement('tr')];
  const stickyCells = [
    '<th class="sticky col-name" rowspan="2">Name</th>',
    '<th class="sticky col-id" rowspan="2">Personalnummer</th>',
    '<th class="sticky col-target" rowspan="2">Stundensoll</th>',
    '<th class="sticky col-remaining" rowspan="2">Noch zu verplanen</th>',
  ];
  stickyCells.forEach((html) => headerRows[0].insertAdjacentHTML('beforeend', html));
  for (let day = 1; day <= days; day++) {
    const d = new Date(date.getFullYear(), date.getMonth(), day);
    const label = `<div class="day-label"><span>${day}.${String(date.getMonth() + 1).padStart(2, '0')}.</span><span>${weekdayLabel(d)}</span></div>`;
    const cls = [isWeekend(d) ? 'weekend' : '', d.getDay() === 6 ? 'saturday' : '', isHoliday(d) ? 'holiday' : ''].filter(Boolean).join(' ');
    headerRows[0].insertAdjacentHTML('beforeend', `<th class="${cls}" colspan="1">${label}</th>`);
  }
  rosterTable.innerHTML = '';
  headerRows.forEach((row) => rosterTable.appendChild(row));
}

function renderRoster() {
  buildRosterHeader(currentMonth);
  const monthKey = getMonthKey(currentMonth);
  const days = daysInMonth(currentMonth);
  state.employees.forEach((emp) => {
    const tr = document.createElement('tr');
    const employment = state.employment.find((e) => e.id === emp.employmentHours);
    const targetHours = employment?.hours;
    const worked = hoursForEmployee(monthKey, emp.id);
    const remaining = typeof targetHours === 'number' ? targetHours - worked : undefined;
    const targetLabel = typeof targetHours === 'number' ? formatHoursLabel(targetHours) : '–';
    const remainingLabel = typeof remaining === 'number'
      ? `<span class="remaining-value ${remaining < 0 ? 'negative' : ''}">${formatHoursLabel(remaining)}</span>`
      : '–';
    tr.insertAdjacentHTML('beforeend', `<td class="sticky col-name">${formatName(emp)}</td>`);
    tr.insertAdjacentHTML('beforeend', `<td class="sticky col-id">${emp.personnelNumber}</td>`);
    tr.insertAdjacentHTML('beforeend', `<td class="sticky col-target">${targetLabel}</td>`);
    tr.insertAdjacentHTML('beforeend', `<td class="sticky col-remaining">${remainingLabel}</td>`);

    for (let day = 1; day <= days; day++) {
      const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const cls = [];
      if (isHoliday(d)) cls.push('holiday');
      else if (d.getDay() === 0) cls.push('weekend');
      else if (d.getDay() === 6) cls.push('saturday');
      const td = document.createElement('td');
      td.className = cls.join(' ');
      const assign = state.assignments?.[monthKey]?.[emp.id]?.[day] ?? '';
      const locked = !!state.locks?.[monthKey]?.[emp.id]?.[day];
      const selectId = `${emp.id}-${day}`;
      const options = ['<option value="">–</option>']
        .concat(state.services.map((s) => `<option value="${s.id}" ${assign === s.id ? 'selected' : ''}>${s.name}</option>`))
        .join('');
      td.innerHTML = `
        <div class="cell">
          <select data-emp="${emp.id}" data-day="${day}" id="sel-${selectId}" ${locked ? 'disabled' : ''}>${options}</select>
          <label class="lock"><input type="checkbox" data-lock="${emp.id}" data-day="${day}" ${locked ? 'checked' : ''}> Sperren</label>
        </div>
      `;
      tr.appendChild(td);
    }
    rosterTable.appendChild(tr);
  });

  monthLabel.textContent = currentMonth.toLocaleDateString('de-AT', { month: 'long', year: 'numeric' });
}

function ensureMonthMaps(monthKey) {
  if (!state.assignments[monthKey]) state.assignments[monthKey] = {};
  if (!state.locks[monthKey]) state.locks[monthKey] = {};
}

function handleRosterChange(e) {
  if (e.target.matches('select[data-emp]')) {
    const emp = e.target.dataset.emp;
    const day = Number(e.target.dataset.day);
    const monthKey = getMonthKey(currentMonth);
    ensureMonthMaps(monthKey);
    if (!state.assignments[monthKey][emp]) state.assignments[monthKey][emp] = {};
    if (e.target.value) {
      state.assignments[monthKey][emp][day] = e.target.value;
    } else {
      delete state.assignments[monthKey][emp][day];
    }
    saveState();
    renderRoster();
  }

  if (e.target.matches('input[type="checkbox"][data-lock]')) {
    const emp = e.target.dataset.lock;
    const day = Number(e.target.dataset.day);
    const monthKey = getMonthKey(currentMonth);
    ensureMonthMaps(monthKey);
    if (!state.locks[monthKey][emp]) state.locks[monthKey][emp] = {};
    state.locks[monthKey][emp][day] = e.target.checked;
    const select = document.querySelector(`select[data-emp="${emp}"][data-day="${day}"]`);
    if (select) select.disabled = e.target.checked;
    saveState();
  }
}

function countWeekends(monthKey, empId) {
  const assignments = state.assignments[monthKey]?.[empId] || {};
  return Object.entries(assignments).reduce((count, [day, serviceId]) => {
    if (!serviceId) return count;
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), Number(day));
    return count + (isWeekend(d) ? 1 : 0);
  }, 0);
}

function countNights(monthKey, empId) {
  const assignments = state.assignments[monthKey]?.[empId] || {};
  return Object.values(assignments).filter((serviceId) => {
    const service = state.services.find((s) => s.id === serviceId);
    return service && /nacht/i.test(service.name);
  }).length;
}

function hoursForEmployee(monthKey, empId) {
  const assignments = state.assignments[monthKey]?.[empId] || {};
  return Object.values(assignments).reduce((sum, serviceId) => {
    const service = state.services.find((s) => s.id === serviceId);
    return service ? sum + serviceDuration(service) : sum;
  }, 0);
}

function workedRecently(empId, day, restDays) {
  if (!restDays) return false;
  const monthKey = getMonthKey(currentMonth);
  const assignments = state.assignments[monthKey]?.[empId] || {};
  for (let i = 1; i <= restDays; i++) {
    const prevDay = day - i;
    if (assignments[prevDay]) return true;
  }
  return false;
}

function generateRoster() {
  const monthKey = getMonthKey(currentMonth);
  ensureMonthMaps(monthKey);
  const days = daysInMonth(currentMonth);
  const rules = state.rules;
  const eligibleEmployees = [...state.employees];

  // Bestehende, nicht gesperrte Einträge für den Monat zurücksetzen
  eligibleEmployees.forEach((emp) => {
    if (!state.assignments[monthKey][emp.id]) state.assignments[monthKey][emp.id] = {};
    for (let day = 1; day <= days; day++) {
      const locked = state.locks[monthKey]?.[emp.id]?.[day];
      if (!locked) {
        delete state.assignments[monthKey][emp.id][day];
      }
    }
  });

  for (let day = 1; day <= days; day++) {
    for (const service of state.services) {
      eligibleEmployees
        .filter((emp) => {
          const func = state.functions.find((f) => f.id === emp.functionId);
          const allowed = func?.serviceIds.includes(service.id);
          const isNight = /nacht/i.test(service.name);
          if (isNight && !emp.nightAllowed) return false;
          return allowed;
        })
        .sort((a, b) => a.lastName.localeCompare(b.lastName, 'de'))
        .some((emp) => {
          ensureMonthMaps(monthKey);
          const locked = state.locks[monthKey]?.[emp.id]?.[day];
          if (locked) return false;
          if (!state.assignments[monthKey][emp.id]) state.assignments[monthKey][emp.id] = {};
          const already = state.assignments[monthKey][emp.id][day];
          if (already) return false;
          if (rules.restDays && workedRecently(emp.id, day, rules.restDays)) return false;
          const nextHours = hoursForEmployee(monthKey, emp.id) + serviceDuration(service);
          if (rules.maxHoursMonth && nextHours > rules.maxHoursMonth) return false;
          const nextWeekends = countWeekends(monthKey, emp.id) + (isWeekend(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)) ? 1 : 0);
          if (rules.maxWeekendDays && nextWeekends > rules.maxWeekendDays) return false;
          const nextNights = countNights(monthKey, emp.id) + (/nacht/i.test(service.name) ? 1 : 0);
          if (rules.maxNights && nextNights > rules.maxNights) return false;
          state.assignments[monthKey][emp.id][day] = service.id;
          return true;
        });
    }
  }
  saveState();
  renderRoster();
}

function syncEmploymentHours() {
  employmentPercentSelect.addEventListener('change', () => {
    const selected = state.employment.find((e) => e.id === employmentPercentSelect.value);
    if (selected) {
      employmentHoursSelect.value = selected.id;
    }
  });
}

function handleEmployeePickerChange() {
  const id = employeePicker.value;
  if (!id) {
    editing.employee = null;
    employeeForm.reset();
    return;
  }
  const emp = state.employees.find((e) => e.id === id);
  if (emp) {
    editing.employee = id;
    fillEmployeeForm(emp);
  }
}

function handleServicePickerChange() {
  const id = servicePicker.value;
  if (!id) {
    editing.service = null;
    serviceForm.reset();
    return;
  }
  const service = state.services.find((s) => s.id === id);
  if (service) {
    editing.service = id;
    fillServiceForm(service);
  }
}

function handleFunctionPickerChange() {
  const id = functionPicker.value;
  if (!id) {
    editing.function = null;
    functionForm.reset();
    Array.from(functionServices.options).forEach((opt) => {
      opt.selected = false;
    });
    return;
  }
  const func = state.functions.find((f) => f.id === id);
  if (func) {
    editing.function = id;
    fillFunctionForm(func);
  }
}

function handleEmploymentPickerChange() {
  const id = employmentPicker.value;
  if (!id) {
    editing.employment = null;
    employmentForm.reset();
    return;
  }
  const entry = state.employment.find((e) => e.id === id);
  if (entry) {
    editing.employment = id;
    fillEmploymentForm(entry);
  }
}

function wireEvents() {
  menuButtons.forEach((btn) => btn.addEventListener('click', () => showScreen(btn.dataset.target)));
  employeeForm.addEventListener('submit', handleEmployeeForm);
  serviceForm.addEventListener('submit', handleServiceForm);
  functionForm.addEventListener('submit', handleFunctionForm);
  employmentForm.addEventListener('submit', handleEmploymentForm);
  rulesForm.addEventListener('submit', handleRulesForm);
  rosterTable.addEventListener('change', handleRosterChange);
  employeePicker.addEventListener('change', handleEmployeePickerChange);
  servicePicker.addEventListener('change', handleServicePickerChange);
  functionPicker.addEventListener('change', handleFunctionPickerChange);
  employmentPicker.addEventListener('change', handleEmploymentPickerChange);
  prevMonthBtn.addEventListener('click', () => { currentMonth.setMonth(currentMonth.getMonth() - 1); renderRoster(); });
  nextMonthBtn.addEventListener('click', () => { currentMonth.setMonth(currentMonth.getMonth() + 1); renderRoster(); });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { currentMonth.setMonth(currentMonth.getMonth() - 1); renderRoster(); }
    if (e.key === 'ArrowRight') { currentMonth.setMonth(currentMonth.getMonth() + 1); renderRoster(); }
  });
  generateBtn.addEventListener('click', generateRoster);
  syncEmploymentHours();
}

function init() {
  updateDropdowns();
  showScreen('roster');
  renderEmployees();
  renderServices();
  renderFunctions();
  renderEmployment();
  renderRules();
  renderRoster();
  wireEvents();
}

init();
