const STORAGE_KEYS = {
  employees: 'dienstplan_employees',
  services: 'dienstplan_services',
  functions: 'dienstplan_functions',
  employmentTypes: 'dienstplan_employment_types',
  rules: 'dienstplan_rules',
  assignments: 'dienstplan_assignments',
  locks: 'dienstplan_locks',
  groups: 'dienstplan_groups',
  layout: 'dienstplan_layout',
  logs: 'dienstplan_logs',
};

const STORAGE_FILE_NAME = 'dienstplan_daten.json';

const uuid = () => {
  const hasCrypto = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function';
  return hasCrypto ? crypto.randomUUID() : `id-${Math.random().toString(16).slice(2)}-${Date.now()}`;
};

const clone = (value) =>
  typeof structuredClone === 'function' ? structuredClone(value) : JSON.parse(JSON.stringify(value));

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
    vacationDays: 25,
    vacations: [],
    sickLeaves: [],
    groupId: null,
    nightAllowed: true,
    rkt: false,
    holidayFactor: 0,
    dailyWorkHours: 8,
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
    vacationDays: 25,
    vacations: [],
    sickLeaves: [],
    groupId: null,
    nightAllowed: true,
    rkt: true,
    holidayFactor: 0,
    dailyWorkHours: 8,
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
    vacationDays: 25,
    vacations: [],
    sickLeaves: [],
    groupId: null,
    nightAllowed: false,
    rkt: false,
    holidayFactor: 0,
    dailyWorkHours: 8,
  },
];

const DEFAULT_LOGS = {
  roster: [],
  employees: [],
  services: [],
  functions: [],
  employment: [],
  rules: [],
};

const DEFAULT_RULES = {
  restDays: 1,
  maxHoursWeek: 40,
  maxHoursMonth: 173,
  maxWeekendDays: 6,
  maxNights: 8,
  weekdayServices: {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    holiday: [],
  },
};

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

const WEEKDAY_KEYS = ['1', '2', '3', '4', '5', '6', '0', 'holiday'];

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
const saveFileBtn = document.getElementById('saveFile');
const loadFileBtn = document.getElementById('loadFile');
const loadFileInput = document.getElementById('loadFileInput');
const weekdaySelects = document.querySelectorAll('[data-weekday-select]');
const weekdayFields = document.querySelectorAll('[data-weekday-field]');
const createGroupBtn = document.getElementById('createGroupBtn');
const assignGroupBtn = document.getElementById('assignGroupBtn');
const removeGroupBtn = document.getElementById('removeGroupBtn');
const groupSelect = document.getElementById('groupSelect');
const rowToolsMenu = document.getElementById('rowToolsMenu');
const vacationPanel = document.getElementById('vacationPanel');
const vacationBalance = document.getElementById('vacationBalance');
const vacationStartInput = document.getElementById('vacationStart');
const vacationEndInput = document.getElementById('vacationEnd');
const addVacationBtn = document.getElementById('addVacation');
const vacationList = document.getElementById('vacationList');
const sickPanel = document.getElementById('sickPanel');
const sickStartInput = document.getElementById('sickStart');
const sickEndInput = document.getElementById('sickEnd');
const sickConfirmedInput = document.getElementById('sickConfirmed');
const addSickBtn = document.getElementById('addSick');
const sickList = document.getElementById('sickList');
const logElements = {
  roster: document.getElementById('rosterLog'),
  employees: document.getElementById('employeesLog'),
  services: document.getElementById('servicesLog'),
  functions: document.getElementById('functionsLog'),
  employment: document.getElementById('employmentLog'),
  rules: document.getElementById('rulesLog'),
};

let state = loadState();
let currentMonth = new Date();
currentMonth.setDate(1);
const editing = { employee: null, service: null, function: null, employment: null };
let weekdaySelections = ensureWeekdaySelections(state.rules.weekdayServices);
let selectedRows = new Set();
let draggingRowId = null;

function loadState() {
  const employment = loadArray(STORAGE_KEYS.employmentTypes, DEFAULT_EMPLOYMENT);
  const services = loadArray(STORAGE_KEYS.services, DEFAULT_SERVICES);
  const functions = loadArray(STORAGE_KEYS.functions, DEFAULT_FUNCTIONS(services));
  const employeesRaw = loadArray(STORAGE_KEYS.employees, DEFAULT_EMPLOYEES(employment, functions));
  const storedRules = loadValue(STORAGE_KEYS.rules, DEFAULT_RULES);
  const rules = {
    ...DEFAULT_RULES,
    ...storedRules,
    weekdayServices: { ...DEFAULT_RULES.weekdayServices, ...(storedRules?.weekdayServices || {}) },
  };
  const assignments = loadValue(STORAGE_KEYS.assignments, {});
  const locks = loadValue(STORAGE_KEYS.locks, {});
  const groups = loadArray(STORAGE_KEYS.groups, []);
  const sanitizedGroups = sanitizeGroups(groups);
  const employees = normalizeEmployees(employeesRaw, sanitizedGroups);
  const layout = ensureLayout(loadValue(STORAGE_KEYS.layout, null), employees);
  const logs = ensureLogs(loadValue(STORAGE_KEYS.logs, DEFAULT_LOGS));
  cleanEmployeeGroups(employees, sanitizedGroups);
  return { employment, services, functions, employees, rules, assignments, locks, groups: sanitizedGroups, layout, logs };
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

function sanitizeGroups(groups = []) {
  if (!Array.isArray(groups)) return [];
  return groups
    .map((group) => {
      if (!group || !group.id) return null;
      return { id: group.id, name: group.name || 'Gruppe' };
    })
    .filter(Boolean);
}

function normalizeEmployees(employees = [], groups = []) {
  return employees.map((emp) => {
    const vacationDays = Number(emp.vacationDays);
    const holidayFactor = Number(emp.holidayFactor);
    const dailyWorkHours = Number(emp.dailyWorkHours);
    const normalized = {
      ...emp,
      vacationDays: Number.isFinite(vacationDays) ? vacationDays : 0,
      vacations: normalizeVacationEntries(emp.vacations),
      sickLeaves: normalizeSickEntries(emp.sickLeaves),
      holidayFactor: Number.isFinite(holidayFactor) ? holidayFactor : 0,
      dailyWorkHours: Number.isFinite(dailyWorkHours) ? dailyWorkHours : 0,
      groupId: emp.groupId && groups.some((g) => g.id === emp.groupId) ? emp.groupId : null,
    };
    return normalized;
  });
}

function normalizeVacationEntries(entries = []) {
  if (!Array.isArray(entries)) return [];
  return entries
    .map((entry) => {
      const start = parseISODate(entry?.start);
      const end = parseISODate(entry?.end);
      if (!start || !end) return null;
      const ordered = start <= end ? { start, end } : { start: end, end: start };
      return {
        id: entry.id || uuid(),
        start: formatISODate(ordered.start),
        end: formatISODate(ordered.end),
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.start.localeCompare(b.start));
}

function normalizeSickEntries(entries = []) {
  if (!Array.isArray(entries)) return [];
  return entries
    .map((entry) => {
      const start = parseISODate(entry?.start);
      const end = parseISODate(entry?.end);
      if (!start || !end) return null;
      const ordered = start <= end ? { start, end } : { start: end, end: start };
      return {
        id: entry.id || uuid(),
        start: formatISODate(ordered.start),
        end: formatISODate(ordered.end),
        confirmed: !!entry.confirmed,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.start.localeCompare(b.start));
}

function ensureLayout(layout, employees) {
  const ids = employees.map((emp) => emp.id);
  if (!layout || !Array.isArray(layout.order)) {
    return { order: ids.slice() };
  }
  const order = layout.order.filter((id) => ids.includes(id));
  ids.forEach((id) => {
    if (!order.includes(id)) order.push(id);
  });
  return { order };
}

function ensureLogs(logs = DEFAULT_LOGS) {
  const target = {};
  Object.keys(DEFAULT_LOGS).forEach((key) => {
    const list = Array.isArray(logs?.[key]) ? logs[key] : [];
    target[key] = list
      .filter((entry) => entry && typeof entry.message === 'string')
      .map((entry) => ({
        id: entry.id || uuid(),
        message: entry.message,
        timestamp: Number(entry.timestamp) || Date.now(),
      }))
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 200);
  });
  return target;
}

function cleanEmployeeGroups(employees, groups) {
  const valid = new Set(groups.map((g) => g.id));
  employees.forEach((emp) => {
    if (emp.groupId && !valid.has(emp.groupId)) {
      emp.groupId = null;
    }
  });
}

function ensureEmployeeInLayout(empId) {
  if (!state.layout.order.includes(empId)) {
    state.layout.order.push(empId);
  }
}

function getOrderedEmployees() {
  const order = state.layout?.order || [];
  const map = new Map(state.employees.map((emp) => [emp.id, emp]));
  const result = [];
  order.forEach((id) => {
    if (map.has(id)) result.push(map.get(id));
  });
  state.employees.forEach((emp) => {
    if (!order.includes(emp.id)) {
      ensureEmployeeInLayout(emp.id);
      result.push(emp);
    }
  });
  return result;
}

function cleanSelectedRows() {
  const ids = new Set(state.employees.map((emp) => emp.id));
  selectedRows.forEach((id) => {
    if (!ids.has(id)) selectedRows.delete(id);
  });
}

function updateGroupPicker() {
  if (!groupSelect) return;
  const previous = groupSelect.value;
  const options = state.groups
    .map((group) => `<option value="${group.id}">${group.name}</option>`)
    .join('');
  groupSelect.innerHTML = '<option value="">Gruppe wählen…</option>' + options;
  if (previous && state.groups.some((g) => g.id === previous)) {
    groupSelect.value = previous;
  }
}

function selectedRowsHaveGroup() {
  return Array.from(selectedRows).some((id) => {
    const emp = state.employees.find((e) => e.id === id);
    return !!emp?.groupId;
  });
}

function updateRowToolStates() {
  if (!createGroupBtn) return;
  const hasSelection = selectedRows.size > 0;
  createGroupBtn.disabled = !hasSelection;
  assignGroupBtn.disabled = !hasSelection || !groupSelect.value;
  removeGroupBtn.disabled = !hasSelection || !selectedRowsHaveGroup();
  if (rowToolsMenu) {
    if (hasSelection) {
      rowToolsMenu.removeAttribute('hidden');
    } else {
      rowToolsMenu.setAttribute('hidden', '');
    }
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
  localStorage.setItem(STORAGE_KEYS.groups, JSON.stringify(state.groups));
  localStorage.setItem(STORAGE_KEYS.layout, JSON.stringify(state.layout));
  localStorage.setItem(STORAGE_KEYS.logs, JSON.stringify(state.logs));
}

function downloadStateFile() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = STORAGE_FILE_NAME;
  a.click();
  URL.revokeObjectURL(url);
}

function importState(json) {
  try {
    const parsed = JSON.parse(json);
    const parsedGroups = sanitizeGroups(parsed.groups ?? []);
    const employees = normalizeEmployees(parsed.employees ?? [], parsedGroups);
    state = {
      employees,
      services: parsed.services ?? [],
      functions: parsed.functions ?? [],
      employment: parsed.employment ?? [],
      rules: {
        ...DEFAULT_RULES,
        ...(parsed.rules || {}),
        weekdayServices: {
          ...DEFAULT_RULES.weekdayServices,
          ...(parsed.rules?.weekdayServices || {}),
        },
      },
      assignments: parsed.assignments ?? {},
      locks: parsed.locks ?? {},
      groups: parsedGroups,
      layout: ensureLayout(parsed.layout, employees),
      logs: ensureLogs(parsed.logs ?? DEFAULT_LOGS),
    };
    cleanEmployeeGroups(state.employees, state.groups);
    editing.employee = null;
    editing.service = null;
    editing.function = null;
    editing.employment = null;
    selectedRows = new Set();
    employeeForm.reset();
    serviceForm.reset();
    functionForm.reset();
    employmentForm.reset();
    renderVacationPanel(null);
    renderSickPanel(null);
    saveState();
    updateDropdowns();
    renderEmployees();
    renderServices();
    renderFunctions();
    renderEmployment();
    renderRules();
    renderRoster();
    renderLogs();
  } catch (e) {
    alert('Konnte Datei nicht laden. Bitte prüfen, ob es eine gültige JSON-Datei ist.');
    console.error(e);
  }
}

function formatName(emp) {
  return `${emp.firstName} ${emp.lastName}`;
}

function formatLogTimestamp(ts) {
  const date = new Date(ts);
  return date.toLocaleString('de-AT', { dateStyle: 'short', timeStyle: 'short' });
}

function appendLog(section, message) {
  if (!state.logs[section]) state.logs[section] = [];
  state.logs[section].unshift({ id: uuid(), message, timestamp: Date.now() });
  state.logs[section] = state.logs[section].slice(0, 200);
  renderLogs(section);
}

function renderLogs(section) {
  const sections = section ? [section] : Object.keys(logElements);
  sections.forEach((key) => {
    const target = logElements[key];
    if (!target) return;
    const entries = state.logs?.[key] || [];
    if (!entries.length) {
      target.innerHTML = '<li class="muted">Noch keine Einträge</li>';
      return;
    }
    target.innerHTML = entries
      .map((entry) => `<li><strong>${formatLogTimestamp(entry.timestamp)}</strong><span>${entry.message}</span></li>`)
      .join('');
  });
}

function getMonthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function monthKeyToDate(key) {
  if (typeof key !== 'string') return null;
  const [yearStr, monthStr] = key.split('-');
  const year = Number(yearStr);
  const monthIndex = Number(monthStr) - 1;
  if (!Number.isFinite(year) || !Number.isFinite(monthIndex)) return null;
  return new Date(year, monthIndex, 1);
}

function parseISODate(value) {
  if (!value || typeof value !== 'string') return null;
  const [year, month, day] = value.split('-').map(Number);
  if (![year, month, day].every((num) => Number.isFinite(num))) return null;
  return new Date(year, month - 1, day);
}

function formatISODate(date) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
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

function formatHours(value) {
  if (value === undefined || value === null || Number.isNaN(value)) return '–';
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? rounded.toString() : rounded.toFixed(1);
}

function vacationBreakdown(startStr, endStr) {
  const start = parseISODate(startStr);
  const end = parseISODate(endStr);
  if (!start || !end) return {};
  const begin = start <= end ? start : end;
  const finish = start <= end ? end : start;
  const cursor = new Date(begin.getTime());
  const perYear = {};
  while (cursor <= finish) {
    const year = cursor.getFullYear();
    perYear[year] = (perYear[year] || 0) + 1;
    cursor.setDate(cursor.getDate() + 1);
  }
  return perYear;
}

function vacationUsageByYear(emp) {
  const usage = {};
  (emp.vacations || []).forEach((entry) => {
    const breakdown = vacationBreakdown(entry.start, entry.end);
    Object.entries(breakdown).forEach(([year, days]) => {
      usage[year] = (usage[year] || 0) + days;
    });
  });
  return usage;
}

function remainingVacationDays(emp, year) {
  const total = Number(emp.vacationDays) || 0;
  const usage = vacationUsageByYear(emp);
  return total - (usage[year] || 0);
}

function vacationStats(emp) {
  const allowance = Number(emp.vacationDays) || 0;
  const usage = vacationUsageByYear(emp);
  const currentYear = currentMonth.getFullYear();
  const nextYear = currentYear + 1;
  const summaryYears = new Set([currentYear, nextYear]);
  Object.keys(usage).forEach((year) => summaryYears.add(Number(year)));
  const stats = Array.from(summaryYears)
    .filter((year) => Number.isFinite(year))
    .sort((a, b) => a - b)
    .map((year) => ({
      year,
      used: usage[year] || 0,
      remaining: Math.max(allowance - (usage[year] || 0), 0),
    }));
  return { allowance, stats };
}

function vacationBalanceText(emp) {
  const { allowance, stats } = vacationStats(emp);
  const base = `Anspruch: ${allowance} Tage`;
  const rest = stats.map((entry) => `${entry.year}: ${entry.remaining} Tage frei (${entry.used} verplant)`);
  return [base].concat(rest).join(' · ');
}

function employeeVacationLine(emp) {
  const { allowance, stats } = vacationStats(emp);
  const currentYear = currentMonth.getFullYear();
  const nextYear = currentYear + 1;
  const current = stats.find((entry) => entry.year === currentYear) || { remaining: allowance };
  const next = stats.find((entry) => entry.year === nextYear) || { remaining: allowance };
  return `Urlaub: ${allowance} Tage · ${currentYear}: ${current.remaining} offen · ${nextYear}: ${next.remaining} offen`;
}

function calculateVacationDays(startStr, endStr) {
  const breakdown = vacationBreakdown(startStr, endStr);
  return Object.values(breakdown).reduce((sum, days) => sum + days, 0);
}

function formatVacationRange(entry) {
  const start = parseISODate(entry.start);
  const end = parseISODate(entry.end);
  if (!start || !end) return '';
  const formatter = new Intl.DateTimeFormat('de-AT', { day: '2-digit', month: '2-digit', year: 'numeric' });
  if (entry.start === entry.end) return formatter.format(start);
  return `${formatter.format(start)} – ${formatter.format(end)}`;
}

function findVacationOnDate(emp, date) {
  if (!emp.vacations?.length) return null;
  return emp.vacations.find((entry) => {
    const start = parseISODate(entry.start);
    const end = parseISODate(entry.end);
    if (!start || !end) return false;
    const begin = start <= end ? start : end;
    const finish = start <= end ? end : start;
    return date >= begin && date <= finish;
  });
}

function findSickOnDate(emp, date) {
  if (!emp.sickLeaves?.length) return null;
  return emp.sickLeaves.find((entry) => {
    const start = parseISODate(entry.start);
    const end = parseISODate(entry.end);
    if (!start || !end) return false;
    const begin = start <= end ? start : end;
    const finish = start <= end ? end : start;
    return date >= begin && date <= finish;
  });
}

function hasBirthdayOnDate(emp, date) {
  if (!emp.birthday) return false;
  const birthday = parseISODate(emp.birthday);
  if (!birthday) return false;
  return birthday.getDate() === date.getDate() && birthday.getMonth() === date.getMonth();
}

function clearAssignmentsForRange(empId, startStr, endStr) {
  const start = parseISODate(startStr);
  const end = parseISODate(endStr);
  if (!start || !end) return;
  const begin = start <= end ? start : end;
  const finish = start <= end ? end : start;
  const cursor = new Date(begin.getTime());
  while (cursor <= finish) {
    const monthKey = getMonthKey(cursor);
    const day = cursor.getDate();
    const monthAssignments = state.assignments[monthKey];
    const monthLocks = state.locks[monthKey];
    if (monthAssignments && monthAssignments[empId]) {
      delete monthAssignments[empId][day];
      if (!Object.keys(monthAssignments[empId]).length) {
        delete monthAssignments[empId];
      }
    }
    if (monthLocks && monthLocks[empId]) {
      delete monthLocks[empId][day];
      if (!Object.keys(monthLocks[empId]).length) {
        delete monthLocks[empId];
      }
    }
    cursor.setDate(cursor.getDate() + 1);
  }
}

function ensureWeekdaySelections(source = {}) {
  const cleaned = {};
  WEEKDAY_KEYS.forEach((key) => {
    const raw = Array.isArray(source?.[key]) ? source[key] : [];
    cleaned[key] = raw.filter((id) => state.services.some((s) => s.id === id));
  });
  return cleaned;
}

function getRequiredServiceIdsForDate(date) {
  const rules = state.rules?.weekdayServices || {};
  const holidayLabel = isHoliday(date);
  const weekday = date.getDay();
  let ids = [];
  if (holidayLabel && rules.holiday?.length) {
    ids = rules.holiday;
  } else if (rules[weekday]?.length) {
    ids = rules[weekday];
  }
  const filtered = ids.filter((id) => state.services.some((s) => s.id === id));
  if (filtered.length) return filtered;
  return state.services.map((s) => s.id);
}

function getRequiredServicesForDate(date) {
  return getRequiredServiceIdsForDate(date)
    .map((id) => state.services.find((s) => s.id === id))
    .filter(Boolean);
}

function remainingServicesForDay(day, monthKey, date) {
  const requiredIds = getRequiredServiceIdsForDate(date);
  const remaining = requiredIds.slice();
  state.employees.forEach((emp) => {
    const assigned = state.assignments?.[monthKey]?.[emp.id]?.[day];
    if (!assigned) return;
    const idx = remaining.indexOf(assigned);
    if (idx !== -1) remaining.splice(idx, 1);
  });
  return remaining
    .map((id) => state.services.find((s) => s.id === id))
    .filter(Boolean);
}

function allowedServicesForEmployee(emp, assigned) {
  const func = state.functions.find((f) => f.id === emp.functionId);
  const allowedIds = Array.isArray(func?.serviceIds) && func.serviceIds.length ? func.serviceIds : [];
  const services = allowedIds.length ? state.services.filter((s) => allowedIds.includes(s.id)) : [];
  return services
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name, 'de', { sensitivity: 'base', numeric: true }));
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
  updateGroupPicker();
}

function renderEmployees() {
  updateDropdowns();
  employeeList.innerHTML = state.employees.map((emp) => {
    const percent = state.employment.find((e) => e.id === emp.employmentPercent);
    const hours = state.employment.find((e) => e.id === emp.employmentHours);
    const func = state.functions.find((f) => f.id === emp.functionId);
    return `<div class="item"><div><strong>${formatName(emp)}</strong><br><small>PNR ${emp.personnelNumber} · ${emp.birthday}</small></div><div><small>${percent?.percent ?? '?'}% / ${hours?.hours ?? '?'} Std · ${func?.name ?? 'keine'} · Nacht: ${emp.nightAllowed ? 'ja' : 'nein'} · RKT: ${emp.rkt ? 'ja' : 'nein'} · ${employeeVacationLine(emp)}</small></div></div>`;
  }).join('');
}

function renderVacationPanel(emp) {
  if (!vacationPanel) return;
  if (!emp) {
    vacationPanel.hidden = true;
    vacationList.innerHTML = '';
    vacationBalance.textContent = '';
    return;
  }
  vacationPanel.hidden = false;
  vacationBalance.textContent = vacationBalanceText(emp);
  if (!emp.vacations?.length) {
    vacationList.innerHTML = '<li class="muted">Noch kein Urlaub eingetragen</li>';
    return;
  }
  const entries = emp.vacations.slice().sort((a, b) => a.start.localeCompare(b.start));
  vacationList.innerHTML = entries
    .map((entry) => {
      const days = calculateVacationDays(entry.start, entry.end);
      return `<li><div><strong>${formatVacationRange(entry)}</strong><span class="muted">${days} Tag${days === 1 ? '' : 'e'}</span></div><button type="button" class="ghost" data-remove-vacation="${entry.id}">Entfernen</button></li>`;
    })
    .join('');
}

function renderSickPanel(emp) {
  if (!sickPanel) return;
  if (!emp) {
    sickPanel.hidden = true;
    sickList.innerHTML = '';
    return;
  }
  sickPanel.hidden = false;
  if (!emp.sickLeaves?.length) {
    sickList.innerHTML = '<li class="muted">Noch kein Krankenstand eingetragen</li>';
    return;
  }
  const entries = emp.sickLeaves.slice().sort((a, b) => a.start.localeCompare(b.start));
  sickList.innerHTML = entries
    .map((entry) => {
      const days = calculateVacationDays(entry.start, entry.end);
      const status = entry.confirmed ? 'Meldung erhalten' : 'keine Meldung';
      return `<li><div><strong>${formatVacationRange(entry)}</strong><span class="muted">${days} Tag${days === 1 ? '' : 'e'} · ${status}</span></div><button type="button" class="ghost" data-remove-sick="${entry.id}">Entfernen</button></li>`;
    })
    .join('');
}

function handleAddVacation() {
  if (!editing.employee) {
    alert('Bitte zuerst einen Mitarbeiter auswählen.');
    return;
  }
  const emp = state.employees.find((e) => e.id === editing.employee);
  if (!emp) return;
  if (!vacationStartInput.value) {
    alert('Bitte ein Startdatum wählen.');
    return;
  }
  const start = vacationStartInput.value;
  const end = vacationEndInput.value || vacationStartInput.value;
  const ordered = start <= end ? { start, end } : { start: end, end: start };
  const breakdown = vacationBreakdown(ordered.start, ordered.end);
  const conflicts = Object.entries(breakdown).filter(([year, days]) => {
    const remaining = remainingVacationDays(emp, Number(year));
    return days > remaining;
  });
  if (conflicts.length) {
    const summary = conflicts.map(([year, days]) => `${year}: ${days} Tage`).join(', ');
    if (!confirm(`Der Urlaub überschreitet den verfügbaren Resturlaub (${summary}). Trotzdem speichern?`)) {
      return;
    }
  }
  const entry = { id: uuid(), start: ordered.start, end: ordered.end };
  emp.vacations.push(entry);
  clearAssignmentsForRange(emp.id, entry.start, entry.end);
  appendLog('employees', `Urlaub ${formatVacationRange(entry)} für ${formatName(emp)} gespeichert.`);
  saveState();
  renderVacationPanel(emp);
  renderRoster();
  vacationStartInput.value = '';
  vacationEndInput.value = '';
}

function handleVacationListClick(event) {
  const button = event.target instanceof Element ? event.target.closest('[data-remove-vacation]') : null;
  if (!button) return;
  if (!editing.employee) return;
  const emp = state.employees.find((e) => e.id === editing.employee);
  if (!emp) return;
  const entry = emp.vacations.find((v) => v.id === button.dataset.removeVacation);
  if (!entry) return;
  if (!confirm('Diesen Urlaub wirklich entfernen?')) return;
  emp.vacations = emp.vacations.filter((entry) => entry.id !== button.dataset.removeVacation);
  appendLog('employees', `Urlaub ${formatVacationRange(entry)} für ${formatName(emp)} entfernt.`);
  saveState();
  renderVacationPanel(emp);
  renderRoster();
}

function handleAddSick() {
  if (!editing.employee) {
    alert('Bitte zuerst einen Mitarbeiter auswählen.');
    return;
  }
  const emp = state.employees.find((e) => e.id === editing.employee);
  if (!emp) return;
  if (!sickStartInput.value) {
    alert('Bitte ein Startdatum wählen.');
    return;
  }
  const start = sickStartInput.value;
  const end = sickEndInput.value || sickStartInput.value;
  const ordered = start <= end ? { start, end } : { start: end, end: start };
  const entry = { id: uuid(), start: ordered.start, end: ordered.end, confirmed: sickConfirmedInput.checked };
  emp.sickLeaves.push(entry);
  clearAssignmentsForRange(emp.id, entry.start, entry.end);
  appendLog(
    'employees',
    `Krankenstand ${formatVacationRange(entry)} für ${formatName(emp)} gespeichert${entry.confirmed ? ' (Meldung erhalten)' : ''}.`
  );
  saveState();
  renderSickPanel(emp);
  renderRoster();
  sickStartInput.value = '';
  sickEndInput.value = '';
  sickConfirmedInput.checked = false;
}

function handleSickListClick(event) {
  const button = event.target instanceof Element ? event.target.closest('[data-remove-sick]') : null;
  if (!button) return;
  if (!editing.employee) return;
  const emp = state.employees.find((e) => e.id === editing.employee);
  if (!emp) return;
  const entry = emp.sickLeaves.find((s) => s.id === button.dataset.removeSick);
  if (!entry) return;
  if (!confirm('Diesen Krankenstand wirklich entfernen?')) return;
  emp.sickLeaves = emp.sickLeaves.filter((s) => s.id !== entry.id);
  appendLog('employees', `Krankenstand ${formatVacationRange(entry)} für ${formatName(emp)} entfernt.`);
  saveState();
  renderSickPanel(emp);
  renderRoster();
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

function renderWeekdaySelects() {
  weekdaySelects.forEach((select) => {
    const previous = select.value;
    const options = state.services
      .map((s) => `<option value="${s.id}">${s.name} (${s.start}–${s.end})</option>`)
      .join('');
    select.innerHTML = '<option value="">Dienst auswählen…</option>' + options;
    if (previous && state.services.some((s) => s.id === previous)) {
      select.value = previous;
    } else {
      select.value = '';
    }
  });
}

function renderWeekdayLists() {
  weekdayFields.forEach((field) => {
    const weekday = field.dataset.weekdayField;
    const container = field.querySelector('[data-weekday-list]');
    const list = weekdaySelections[weekday] || [];
    if (!list.length) {
      container.innerHTML = '<span class="weekday-placeholder muted">Keine Dienste hinterlegt</span>';
      return;
    }
    container.innerHTML = list
      .map((id) => {
        const service = state.services.find((s) => s.id === id);
        if (!service) return '';
        return `<span class="weekday-chip">${service.name}<button type="button" data-remove-service="${id}" aria-label="${service.name} entfernen">×</button></span>`;
      })
      .join('');
  });
}

function renderWeekdayControls() {
  renderWeekdaySelects();
  renderWeekdayLists();
}

function setupWeekdayInteractions() {
  weekdayFields.forEach((field) => {
    const weekday = field.dataset.weekdayField;
    const addBtn = field.querySelector('[data-weekday-add]');
    const select = field.querySelector('[data-weekday-select]');
    const list = field.querySelector('[data-weekday-list]');
    if (addBtn && select) {
      addBtn.addEventListener('click', () => {
        const value = select.value;
        if (!value) return;
        if (!weekdaySelections[weekday]) weekdaySelections[weekday] = [];
        if (!weekdaySelections[weekday].includes(value)) {
          weekdaySelections[weekday].push(value);
          renderWeekdayLists();
        }
        select.value = '';
      });
    }
    if (list) {
      list.addEventListener('click', (event) => {
        const base = event.target instanceof Element ? event.target.closest('[data-remove-service]') : null;
        if (!base) return;
        const toRemove = base.dataset.removeService;
        weekdaySelections[weekday] = (weekdaySelections[weekday] || []).filter((id) => id !== toRemove);
        renderWeekdayLists();
      });
    }
  });
}

function renderRules() {
  const r = state.rules;
  const form = rulesForm.elements;
  form.restDays.value = r.restDays ?? '';
  form.maxHoursWeek.value = r.maxHoursWeek ?? '';
  form.maxHoursMonth.value = r.maxHoursMonth ?? '';
  form.maxWeekendDays.value = r.maxWeekendDays ?? '';
  form.maxNights.value = r.maxNights ?? '';
  weekdaySelections = ensureWeekdaySelections(r.weekdayServices);
  renderWeekdayControls();
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
  form.vacationDays.value = emp.vacationDays ?? 0;
  form.holidayFactor.value = emp.holidayFactor ?? 0;
  form.dailyWorkHours.value = emp.dailyWorkHours ?? 0;
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
  const isUpdate = !!editing.employee;
  const existing = isUpdate ? state.employees.find((emp) => emp.id === editing.employee) : null;
  const entry = {
    id: editing.employee ?? uuid(),
    vacations: existing?.vacations ? clone(existing.vacations) : [],
    sickLeaves: existing?.sickLeaves ? clone(existing.sickLeaves) : [],
    groupId: existing?.groupId || null,
    firstName: data.get('firstName').trim(),
    lastName: data.get('lastName').trim(),
    personnelNumber: data.get('personnelNumber').trim(),
    birthday: data.get('birthday'),
    employmentPercent: data.get('employmentPercent'),
    employmentHours: data.get('employmentHours'),
    functionId: data.get('functionId'),
    vacationDays: Number(data.get('vacationDays')) || 0,
    holidayFactor: Number(data.get('holidayFactor')) || 0,
    dailyWorkHours: Number(data.get('dailyWorkHours')) || 0,
    nightAllowed: data.get('nightAllowed') === 'on',
    rkt: data.get('rkt') === 'on',
  };

  if (isUpdate) {
    if (!confirm('Wollen Sie die Änderungen wirklich speichern?')) return;
    const idx = state.employees.findIndex((emp) => emp.id === editing.employee);
    if (idx !== -1) {
      state.employees[idx] = entry;
    }
  } else {
    state.employees.push(entry);
    ensureEmployeeInLayout(entry.id);
    editing.employee = entry.id;
    employeePicker.value = entry.id;
  }
  appendLog('employees', `Mitarbeiter ${formatName(entry)} ${isUpdate ? 'aktualisiert' : 'angelegt'}.`);
  saveState();
  updateDropdowns();
  renderEmployees();
  renderRoster();
  fillEmployeeForm(entry);
  renderVacationPanel(entry);
  renderSickPanel(entry);
}

function handleEmployeeFormReset() {
  editing.employee = null;
  employeePicker.value = '';
  renderVacationPanel(null);
  renderSickPanel(null);
}

function handleServiceForm(e) {
  e.preventDefault();
  const data = new FormData(serviceForm);
  const isUpdate = !!editing.service;
  const entry = { id: editing.service ?? uuid(), name: data.get('name').trim(), start: data.get('start'), end: data.get('end') };

  if (isUpdate) {
    if (!confirm('Wollen Sie die Änderungen wirklich speichern?')) return;
    const idx = state.services.findIndex((s) => s.id === editing.service);
    if (idx !== -1) state.services[idx] = entry;
  } else {
    state.services.push(entry);
    editing.service = entry.id;
    servicePicker.value = entry.id;
  }
  appendLog('services', `Dienst ${entry.name} ${isUpdate ? 'aktualisiert' : 'angelegt'}.`);
  saveState();
  updateDropdowns();
  renderServices();
  renderFunctions();
  renderRules();
  renderRoster();
  fillServiceForm(entry);
}

function handleFunctionForm(e) {
  e.preventDefault();
  const data = new FormData(functionForm);
  const isUpdate = !!editing.function;
  const serviceIds = data.getAll('serviceIds');
  const entry = { id: editing.function ?? uuid(), name: data.get('name').trim(), serviceIds };

  if (isUpdate) {
    if (!confirm('Wollen Sie die Änderungen wirklich speichern?')) return;
    const idx = state.functions.findIndex((f) => f.id === editing.function);
    if (idx !== -1) state.functions[idx] = entry;
  } else {
    state.functions.push(entry);
    editing.function = entry.id;
    functionPicker.value = entry.id;
  }
  appendLog('functions', `Funktion ${entry.name} ${isUpdate ? 'aktualisiert' : 'angelegt'}.`);
  saveState();
  updateDropdowns();
  renderFunctions();
  renderRoster();
  fillFunctionForm(entry);
}

function handleEmploymentForm(e) {
  e.preventDefault();
  const data = new FormData(employmentForm);
  const isUpdate = !!editing.employment;
  const entry = { id: editing.employment ?? uuid(), percent: Number(data.get('percent')), hours: Number(data.get('hours')) };

  if (isUpdate) {
    if (!confirm('Wollen Sie die Änderungen wirklich speichern?')) return;
    const idx = state.employment.findIndex((eItem) => eItem.id === editing.employment);
    if (idx !== -1) state.employment[idx] = entry;
  } else {
    state.employment.push(entry);
    editing.employment = entry.id;
    employmentPicker.value = entry.id;
  }
  appendLog('employment', `Anstellungsverhältnis ${entry.percent}% · ${entry.hours} Std ${isUpdate ? 'aktualisiert' : 'angelegt'}.`);
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
    weekdayServices: ensureWeekdaySelections(weekdaySelections),
  };
  appendLog('rules', 'Regelwerk aktualisiert.');
  saveState();
  renderRules();
  renderRoster();
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
    '<th class="names col-info" rowspan="2"><div class="info-header"><span>Name</span><span>Personalnummer</span></div></th>',
    '<th class="names col-hours" rowspan="2"><div class="hours-header"><span>Stundensoll</span><span>Noch zu verplanen</span></div></th>',
  ];
  stickyCells.forEach((html) => headerRows[0].insertAdjacentHTML('beforeend', html));
  for (let day = 1; day <= days; day++) {
    const d = new Date(date.getFullYear(), date.getMonth(), day);
    const label = `<div class="day-label"><span>${day}.${String(date.getMonth() + 1).padStart(2, '0')}.</span><span>${weekdayLabel(d)}</span></div>`;
    const cls = ['day-col'];
    if (isHoliday(d)) cls.push('holiday');
    else if (d.getDay() === 0) cls.push('weekend');
    else if (d.getDay() === 6) cls.push('saturday');
    headerRows[0].insertAdjacentHTML('beforeend', `<th class="${cls.join(' ')}" colspan="1">${label}</th>`);
    headerRows[1].insertAdjacentHTML('beforeend', `<th class="${cls.join(' ')}">${day}</th>`);
  }
  rosterTable.innerHTML = '';
  headerRows.forEach((row) => rosterTable.appendChild(row));
}

function renderRoster() {
  buildRosterHeader(currentMonth);
  const monthKey = getMonthKey(currentMonth);
  const days = daysInMonth(currentMonth);
  cleanSelectedRows();
  const employees = getOrderedEmployees();
  const renderedGroups = new Set();

  employees.forEach((emp) => {
    if (emp.groupId) {
      const group = state.groups.find((g) => g.id === emp.groupId);
      if (group && !renderedGroups.has(group.id)) {
        rosterTable.appendChild(buildGroupRow(group, days));
        renderedGroups.add(group.id);
      }
    }
    rosterTable.appendChild(buildEmployeeRow(emp, monthKey, days));
  });

  const unassignedRow = document.createElement('tr');
  unassignedRow.className = 'unassigned-row';
  unassignedRow.innerHTML = `
    <td class="names col-info" colspan="2">
      <div class="info-cell">
        <span class="emp-name">Nicht verplante Dienste</span>
      </div>
    </td>
  `;
  for (let day = 1; day <= days; day++) {
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const remaining = remainingServicesForDay(day, monthKey, d);
    const cls = ['unassigned-cell', 'day-col'];
    if (isHoliday(d)) cls.push('holiday');
    else if (d.getDay() === 0) cls.push('weekend');
    else if (d.getDay() === 6) cls.push('saturday');
    if (!remaining.length) cls.push('complete');
    const td = document.createElement('td');
    td.className = cls.join(' ');
    if (remaining.length) {
      td.innerHTML = `<div class="unassigned-list">${remaining.map((s) => `<span>${s.name}</span>`).join('')}</div>`;
    } else {
      td.innerHTML = '<span class="all-assigned">Alle geplant</span>';
    }
    unassignedRow.appendChild(td);
  }
  rosterTable.appendChild(unassignedRow);

  monthLabel.textContent = currentMonth.toLocaleDateString('de-AT', { month: 'long', year: 'numeric' });
  if (editing.employee) {
    const currentEmp = state.employees.find((e) => e.id === editing.employee);
    if (currentEmp) {
      renderVacationPanel(currentEmp);
      renderSickPanel(currentEmp);
    }
  }
  updateRowToolStates();
}

function buildGroupRow(group, days) {
  const tr = document.createElement('tr');
  tr.className = 'group-row';
  tr.dataset.groupId = group.id;
  const infoCell = document.createElement('td');
  infoCell.className = 'group-name names col-info';
  infoCell.colSpan = 2;
  infoCell.innerHTML = `
    <div class="group-header">
      <strong>${group.name}</strong>
      <span class="group-header__actions">
        <button type="button" class="ghost" data-rename-group="${group.id}">Umbenennen</button>
        <button type="button" class="ghost" data-delete-group="${group.id}">Gruppe löschen</button>
      </span>
    </div>
  `;
  tr.appendChild(infoCell);
  for (let i = 0; i < days; i++) {
    const spacer = document.createElement('td');
    spacer.className = 'group-spacer day-col';
    tr.appendChild(spacer);
  }
  return tr;
}

function buildEmployeeRow(emp, monthKey, days) {
  const tr = document.createElement('tr');
  tr.dataset.empRow = emp.id;
  const employment = state.employment.find((e) => e.id === emp.employmentHours);
  const assignedHours = hoursForEmployee(monthKey, emp.id);
  const remainingHours = (employment?.hours ?? 0) - assignedHours;
  const remainingClass = remainingHours < 0 ? 'hours-remaining negative' : 'hours-remaining';
  const selected = selectedRows.has(emp.id) ? 'checked' : '';
  const nameCell = document.createElement('td');
  nameCell.className = 'names col-info';
  nameCell.innerHTML = `
    <div class="row-header">
      <label class="sr-only" for="row-select-${emp.id}">Mitarbeiter auswählen</label>
      <input type="checkbox" id="row-select-${emp.id}" data-row-select="${emp.id}" ${selected}>
      <button type="button" class="drag-handle" data-drag-handle draggable="true" aria-label="Zeile verschieben">⋮⋮</button>
      <div class="info-cell">
        <span class="emp-name">${formatName(emp)}</span>
        <span class="emp-pnr">${emp.personnelNumber}</span>
      </div>
    </div>
  `;
  tr.appendChild(nameCell);

  const hoursCell = document.createElement('td');
  hoursCell.className = 'names col-hours';
  hoursCell.innerHTML = `
    <div class="hours-cell">
      <span class="hours-target">${employment?.hours ?? '–'} Std</span>
      <span class="${remainingClass}">${formatHours(remainingHours)} Std</span>
    </div>
  `;
  tr.appendChild(hoursCell);

  for (let day = 1; day <= days; day++) {
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const cls = ['day-col'];
    if (isHoliday(d)) cls.push('holiday');
    else if (d.getDay() === 0) cls.push('weekend');
    else if (d.getDay() === 6) cls.push('saturday');
    const monthAssignments = state.assignments[monthKey] || {};
    const monthLocks = state.locks[monthKey] || {};
    const assign = monthAssignments[emp.id]?.[day] ?? '';
    const locked = !!monthLocks[emp.id]?.[day];
    const serviceOptions = allowedServicesForEmployee(emp, assign);
    const options = ['<option value="">–</option>']
      .concat(serviceOptions.map((s) => `<option value="${s.id}" ${assign === s.id ? 'selected' : ''}>${s.name}</option>`))
      .join('');
    const td = document.createElement('td');
    const vacationEntry = findVacationOnDate(emp, d);
    const sickEntry = findSickOnDate(emp, d);
    const isBirthday = hasBirthdayOnDate(emp, d);
    if (vacationEntry) cls.push('vacation');
    if (sickEntry) cls.push('sick');
    td.className = cls.join(' ');
    const selectDisabled = locked || !serviceOptions.length || vacationEntry || sickEntry;
    const parts = ['<div class="cell">'];
    if (isBirthday) {
      parts.push('<span class="birthday-flag" title="Geburtstag">🎂</span>');
    }
    if (vacationEntry || sickEntry) {
      if (vacationEntry) {
        parts.push('<span class="absence-pill vacation" title="Urlaub">U</span>');
      } else if (sickEntry) {
        const status = sickEntry.confirmed ? 'Krankenstand – Meldung erhalten' : 'Krankenstand';
        parts.push(`<span class="absence-pill sick" title="${status}">K</span>`);
      }
    } else {
      parts.push(`<select data-emp="${emp.id}" data-day="${day}" ${selectDisabled ? 'disabled' : ''}>${options}</select>`);
      parts.push(`<label class="lock"><input type="checkbox" data-lock="${emp.id}" data-day="${day}" ${locked ? 'checked' : ''}> <span>Sperren</span></label>`);
    }
    parts.push('</div>');
    td.innerHTML = parts.join('');
    tr.appendChild(td);
  }
  return tr;
}

function handleCreateGroup() {
  if (!selectedRows.size) return;
  const name = prompt('Name der neuen Gruppe', 'Neue Gruppe');
  if (!name) return;
  const group = { id: uuid(), name: name.trim() || 'Neue Gruppe' };
  state.groups.push(group);
  selectedRows.forEach((id) => {
    const emp = state.employees.find((e) => e.id === id);
    if (emp) emp.groupId = group.id;
  });
  appendLog('roster', `Gruppe "${group.name}" mit ${selectedRows.size} Mitarbeiter${selectedRows.size === 1 ? '' : 'n'} erstellt.`);
  saveState();
  updateGroupPicker();
  renderEmployees();
  renderRoster();
}

function handleAssignGroup() {
  if (!selectedRows.size || !groupSelect.value) return;
  const group = state.groups.find((g) => g.id === groupSelect.value);
  selectedRows.forEach((id) => {
    const emp = state.employees.find((e) => e.id === id);
    if (emp) emp.groupId = groupSelect.value;
  });
  appendLog(
    'roster',
    `${selectedRows.size} Mitarbeiter${selectedRows.size === 1 ? '' : 'n'} der Gruppe "${group?.name || 'Unbekannt'}" zugewiesen.`
  );
  saveState();
  renderRoster();
}

function handleRemoveGroup() {
  if (!selectedRows.size) return;
  selectedRows.forEach((id) => {
    const emp = state.employees.find((e) => e.id === id);
    if (emp) emp.groupId = null;
  });
  appendLog('roster', `${selectedRows.size} Mitarbeiter${selectedRows.size === 1 ? '' : 'n'} aus Gruppen gelöst.`);
  saveState();
  renderRoster();
}

function renameGroup(groupId) {
  const group = state.groups.find((g) => g.id === groupId);
  if (!group) return;
  const previous = group.name;
  const name = prompt('Neuer Gruppenname', group.name);
  if (!name) return;
  group.name = name.trim() || group.name;
  appendLog('roster', `Gruppe "${previous}" in "${group.name}" umbenannt.`);
  saveState();
  updateGroupPicker();
  renderRoster();
}

function deleteGroup(groupId) {
  const group = state.groups.find((g) => g.id === groupId);
  if (!group) return;
  if (!confirm(`Gruppe "${group.name}" wirklich löschen?`)) return;
  state.groups = state.groups.filter((g) => g.id !== groupId);
  state.employees.forEach((emp) => {
    if (emp.groupId === groupId) emp.groupId = null;
  });
  if (groupSelect.value === groupId) groupSelect.value = '';
  appendLog('roster', `Gruppe "${group.name}" gelöscht.`);
  saveState();
  updateGroupPicker();
  renderEmployees();
  renderRoster();
}

function handleRosterClick(event) {
  const renameBtn = event.target instanceof Element ? event.target.closest('[data-rename-group]') : null;
  if (renameBtn) {
    renameGroup(renameBtn.dataset.renameGroup);
    return;
  }
  const deleteBtn = event.target instanceof Element ? event.target.closest('[data-delete-group]') : null;
  if (deleteBtn) {
    deleteGroup(deleteBtn.dataset.deleteGroup);
  }
}

function handleRowDragStart(event) {
  const handle = event.target instanceof Element ? event.target.closest('[data-drag-handle]') : null;
  if (!handle) return;
  const row = handle.closest('tr[data-emp-row]');
  if (!row) return;
  draggingRowId = row.dataset.empRow;
  row.classList.add('dragging');
  event.dataTransfer.setData('text/plain', draggingRowId);
  event.dataTransfer.effectAllowed = 'move';
}

function handleRowDragOver(event) {
  if (!draggingRowId) return;
  const row = event.target instanceof Element ? event.target.closest('tr[data-emp-row]') : null;
  if (!row || row.dataset.empRow === draggingRowId) return;
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
}

function handleRowDrop(event) {
  if (!draggingRowId) return;
  const row = event.target instanceof Element ? event.target.closest('tr[data-emp-row]') : null;
  if (!row || row.dataset.empRow === draggingRowId) return;
  event.preventDefault();
  const targetId = row.dataset.empRow;
  const rect = row.getBoundingClientRect();
  const position = event.clientY < rect.top + rect.height / 2 ? 'before' : 'after';
  reorderRows(draggingRowId, targetId, position);
  finishRowDrag();
}

function handleRowDragEnd() {
  finishRowDrag();
}

function finishRowDrag() {
  const active = rosterTable.querySelector('tr.dragging');
  if (active) active.classList.remove('dragging');
  draggingRowId = null;
}

function reorderRows(sourceId, targetId, position) {
  if (sourceId === targetId) return;
  const order = state.layout.order.filter((id) => id !== sourceId);
  const targetIndex = order.indexOf(targetId);
  const insertIndex = targetIndex === -1 ? order.length : targetIndex + (position === 'after' ? 1 : 0);
  order.splice(insertIndex, 0, sourceId);
  state.layout.order = order;
  const emp = state.employees.find((e) => e.id === sourceId);
  appendLog('roster', `Zeile ${emp ? formatName(emp) : sourceId} verschoben.`);
  saveState();
  renderRoster();
}

function ensureMonthMaps(monthKey) {
  if (!state.assignments[monthKey]) state.assignments[monthKey] = {};
  if (!state.locks[monthKey]) state.locks[monthKey] = {};
}

function handleRosterChange(e) {
  if (e.target.matches('input[type="checkbox"][data-row-select]')) {
    const id = e.target.dataset.rowSelect;
    if (!id) return;
    if (e.target.checked) selectedRows.add(id);
    else selectedRows.delete(id);
    updateRowToolStates();
    return;
  }
  if (e.target.matches('select[data-emp]')) {
    const emp = e.target.dataset.emp;
    const day = Number(e.target.dataset.day);
    const monthKey = getMonthKey(currentMonth);
    ensureMonthMaps(monthKey);
    if (!state.assignments[monthKey][emp]) state.assignments[monthKey][emp] = {};
    state.assignments[monthKey][emp][day] = e.target.value;
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
    renderRoster();
  }
}

function countWeekends(monthKey, empId) {
  const assignments = state.assignments[monthKey]?.[empId] || {};
  return Object.entries(assignments).filter(([day, serviceId]) => {
    if (!serviceId) return false;
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), Number(day));
    return isWeekend(d);
  }).length;
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
  let total = Object.values(assignments).reduce((sum, serviceId) => {
    const service = state.services.find((s) => s.id === serviceId);
    return service ? sum + serviceDuration(service) : sum;
  }, 0);
  const emp = state.employees.find((e) => e.id === empId);
  const baseDate = monthKeyToDate(monthKey);
  if (!emp || !baseDate) return total;
  const days = daysInMonth(baseDate);
  const holidayFactor = Number(emp.holidayFactor) || 0;
  const dailyHours = Number(emp.dailyWorkHours) || 0;
  for (let day = 1; day <= days; day++) {
    const date = new Date(baseDate.getFullYear(), baseDate.getMonth(), day);
    if (holidayFactor && isHoliday(date)) {
      total += holidayFactor;
    }
    if (dailyHours) {
      if (findVacationOnDate(emp, date) || findSickOnDate(emp, date)) {
        total += dailyHours;
      }
    }
  }
  return total;
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

  // Bestehende, nicht gesperrte Einträge für den Monat zurücksetzen
  state.employees.forEach((emp) => {
    if (!state.assignments[monthKey][emp.id]) state.assignments[monthKey][emp.id] = {};
    for (let day = 1; day <= days; day++) {
      const locked = state.locks[monthKey]?.[emp.id]?.[day];
      if (!locked) {
        delete state.assignments[monthKey][emp.id][day];
      }
    }
  });

  for (let day = 1; day <= days; day++) {
    const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const servicesForDay = getRequiredServicesForDate(currentDate);
    for (const service of servicesForDay) {
          state.employees
            .filter((emp) => {
              const func = state.functions.find((f) => f.id === emp.functionId);
              const allowed = Array.isArray(func?.serviceIds) && func.serviceIds.includes(service.id);
              if (!allowed) return false;
              if (findVacationOnDate(emp, currentDate)) return false;
              if (findSickOnDate(emp, currentDate)) return false;
              const isNight = /nacht/i.test(service.name);
              if (isNight && !emp.nightAllowed) return false;
              return true;
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
          const nextWeekends = countWeekends(monthKey, emp.id) + (isWeekend(currentDate) ? 1 : 0);
          if (rules.maxWeekendDays && nextWeekends > rules.maxWeekendDays) return false;
          const nextNights = countNights(monthKey, emp.id) + (/nacht/i.test(service.name) ? 1 : 0);
          if (rules.maxNights && nextNights > rules.maxNights) return false;
          state.assignments[monthKey][emp.id][day] = service.id;
          return true;
        });
    }
  }
  const label = currentMonth.toLocaleDateString('de-AT', { month: 'long', year: 'numeric' });
  appendLog('roster', `Dienstplan für ${label} generiert.`);
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
    renderVacationPanel(null);
    renderSickPanel(null);
    return;
  }
  const emp = state.employees.find((e) => e.id === id);
  if (emp) {
    editing.employee = id;
    fillEmployeeForm(emp);
    renderVacationPanel(emp);
    renderSickPanel(emp);
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
  employeeForm.addEventListener('reset', handleEmployeeFormReset);
  serviceForm.addEventListener('submit', handleServiceForm);
  functionForm.addEventListener('submit', handleFunctionForm);
  employmentForm.addEventListener('submit', handleEmploymentForm);
  rulesForm.addEventListener('submit', handleRulesForm);
  rosterTable.addEventListener('change', handleRosterChange);
  rosterTable.addEventListener('click', handleRosterClick);
  rosterTable.addEventListener('dragstart', handleRowDragStart);
  rosterTable.addEventListener('dragover', handleRowDragOver);
  rosterTable.addEventListener('drop', handleRowDrop);
  rosterTable.addEventListener('dragend', handleRowDragEnd);
  employeePicker.addEventListener('change', handleEmployeePickerChange);
  servicePicker.addEventListener('change', handleServicePickerChange);
  functionPicker.addEventListener('change', handleFunctionPickerChange);
  employmentPicker.addEventListener('change', handleEmploymentPickerChange);
  prevMonthBtn.addEventListener('click', () => {
    currentMonth.setMonth(currentMonth.getMonth() - 1);
    renderRoster();
    renderEmployees();
  });
  nextMonthBtn.addEventListener('click', () => {
    currentMonth.setMonth(currentMonth.getMonth() + 1);
    renderRoster();
    renderEmployees();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      currentMonth.setMonth(currentMonth.getMonth() - 1);
      renderRoster();
      renderEmployees();
    }
    if (e.key === 'ArrowRight') {
      currentMonth.setMonth(currentMonth.getMonth() + 1);
      renderRoster();
      renderEmployees();
    }
  });
  generateBtn.addEventListener('click', generateRoster);
  saveFileBtn.addEventListener('click', downloadStateFile);
  loadFileBtn.addEventListener('click', () => loadFileInput.click());
  loadFileInput.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    file.text().then(importState).finally(() => {
      loadFileInput.value = '';
    });
  });
  if (addVacationBtn) addVacationBtn.addEventListener('click', handleAddVacation);
  if (vacationList) vacationList.addEventListener('click', handleVacationListClick);
  if (addSickBtn) addSickBtn.addEventListener('click', handleAddSick);
  if (sickList) sickList.addEventListener('click', handleSickListClick);
  if (createGroupBtn) createGroupBtn.addEventListener('click', handleCreateGroup);
  if (assignGroupBtn) assignGroupBtn.addEventListener('click', handleAssignGroup);
  if (removeGroupBtn) removeGroupBtn.addEventListener('click', handleRemoveGroup);
  if (groupSelect) groupSelect.addEventListener('change', updateRowToolStates);
  syncEmploymentHours();
}

function init() {
  updateDropdowns();
  showScreen('roster');
  renderEmployees();
  renderServices();
  renderFunctions();
  renderEmployment();
  setupWeekdayInteractions();
  renderRules();
  renderRoster();
  renderLogs();
  wireEvents();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
