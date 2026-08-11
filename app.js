const STORAGE_KEY = "ataka-crm-v2";
const TODAY = todayIso();
const SESSION_KEY = "ataka-crm-session-user";
const SESSION_LOGIN_KEY = "ataka-crm-session-login";
const CURRENT_MONTH = "2026-08";
const AVAILABLE_MONTHS = ["2026-08", "2026-09", "2026-10", "2026-11"];
const PASSWORD_VERSION = "sha256-v1";
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_LOCK_MS = 5 * 60 * 1000;
const SUPABASE_LOGIN_DOMAIN = "ataka.local";
const LOCAL_UI_KEYS = [
  "currentUserId",
  "activeView",
  "settingsTab",
  "selectedBranchId",
  "query",
  "filters",
  "trainingFilters",
  "coachFilters",
  "financeFilters",
  "paymentFilters",
  "messageFilters",
  "excelMonth",
  "excelBranchId",
  "selectedTrainingId",
  "coachSelectedTrainingId",
  "showTrainingPicker",
  "showCalendar"
];
const SHARED_STATE_KEYS = [
  "settings",
  "users",
  "branches",
  "groups",
  "schedules",
  "students",
  "parents",
  "enrollments",
  "trainings",
  "attendance",
  "charges",
  "payments",
  "allocations",
  "credits",
  "debts",
  "monthClosings",
  "openedBranchMonths",
  "deleted",
  "archive",
  "auditLog",
  "scheduleVersion",
  "realRosterVersion",
  "assistantRuleVersion",
  "historyResetVersion"
];

function todayIso() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

const defaultData = {
  currentUserId: "u1",
  activeView: "today",
  settingsTab: "general",
  selectedBranchId: "b1",
  query: "",
  security: { loginFailures: {} },
  filters: { branchId: "all", groupId: "all", month: CURRENT_MONTH },
  trainingFilters: { branchId: "all", month: CURRENT_MONTH },
  coachFilters: { branchId: "all", month: CURRENT_MONTH },
  financeFilters: { branchId: "all", month: CURRENT_MONTH },
  paymentFilters: { branchId: "all", month: CURRENT_MONTH },
  messageFilters: { branchId: "all", month: CURRENT_MONTH },
  excelMonth: CURRENT_MONTH,
  excelBranchId: "b1",
  settings: {
    pricePerTraining: 300,
    trainerRate: 1000,
    assistantRate: 800,
    dueDay: 7
  },
  users: [
    { id: "u1", name: "Иван", role: "owner", branchIds: ["b1", "b2", "b3", "b4", "b5", "b6"], groupIds: ["g1", "g2", "g3", "g4", "g5", "g6"] },
    { id: "u2", name: "Марина", role: "owner", branchIds: ["b1", "b2", "b3", "b4", "b5", "b6"], groupIds: ["g1", "g2", "g3", "g4", "g5", "g6"] },
    { id: "u3", name: "Илья Морозов", role: "coach", branchIds: ["b1", "b2"], groupIds: ["g1", "g2", "g3"] },
    { id: "u4", name: "Роман Соловьев", role: "coach", branchIds: ["b2"], groupIds: ["g3"] },
    { id: "u5", name: "Денис Орлов", role: "coach", branchIds: ["b3"], groupIds: ["g4"] }
  ],
  branches: [
    { id: "b1", name: "45 лицей", address: "Адрес уточняется", isActive: true, archivedAt: null, deletedAt: null },
    { id: "b2", name: "74 СОШ", address: "Адрес уточняется", isActive: true, archivedAt: null, deletedAt: null },
    { id: "b3", name: "87 СОШ", address: "Адрес уточняется", isActive: true, archivedAt: null, deletedAt: null },
    { id: "b4", name: "Первомайская СОШ", address: "Адрес уточняется", isActive: true, archivedAt: null, deletedAt: null },
    { id: "b5", name: "Первомайский детский сад", address: "Адрес уточняется", isActive: true, archivedAt: null, deletedAt: null },
    { id: "b6", name: "63 СОШ", address: "Адрес уточняется", isActive: true, archivedAt: null, deletedAt: null }
  ],
  groups: [
    { id: "g1", branchId: "b1", name: "Младшая 6-8", ageRange: "6-8", trainerId: "u3", assistantId: "u2", isActive: true, archivedAt: null, deletedAt: null },
    { id: "g2", branchId: "b1", name: "Старшая 9-11", ageRange: "9-11", trainerId: "u3", assistantId: null, isActive: true, archivedAt: null, deletedAt: null },
    { id: "g3", branchId: "b2", name: "2016-2017", ageRange: "8-10", trainerId: "u4", assistantId: "u3", isActive: true, archivedAt: null, deletedAt: null },
    { id: "g4", branchId: "b3", name: "Подготовка", ageRange: "5-7", trainerId: "u5", assistantId: null, isActive: true, archivedAt: null, deletedAt: null },
    { id: "g5", branchId: "b4", name: "Базовая", ageRange: "7-9", trainerId: "u2", assistantId: null, isActive: true, archivedAt: null, deletedAt: null },
    { id: "g6", branchId: "b5", name: "Сборная", ageRange: "10-12", trainerId: "u3", assistantId: "u4", isActive: true, archivedAt: null, deletedAt: null }
  ],
  schedules: [
    { id: "sch1", groupId: "g1", weekday: 2, startTime: "17:00", endTime: "18:00", startsAt: "2026-07-01", endsAt: null },
    { id: "sch2", groupId: "g1", weekday: 4, startTime: "17:00", endTime: "18:00", startsAt: "2026-07-01", endsAt: null },
    { id: "sch3", groupId: "g2", weekday: 2, startTime: "18:10", endTime: "19:10", startsAt: "2026-07-01", endsAt: null },
    { id: "sch4", groupId: "g2", weekday: 4, startTime: "18:10", endTime: "19:10", startsAt: "2026-07-01", endsAt: null },
    { id: "sch5", groupId: "g3", weekday: 1, startTime: "16:30", endTime: "17:30", startsAt: "2026-07-01", endsAt: null },
    { id: "sch6", groupId: "g3", weekday: 3, startTime: "16:30", endTime: "17:30", startsAt: "2026-07-01", endsAt: null },
    { id: "sch7", groupId: "g4", weekday: 3, startTime: "18:00", endTime: "19:00", startsAt: "2026-07-01", endsAt: null },
    { id: "sch8", groupId: "g4", weekday: 5, startTime: "18:00", endTime: "19:00", startsAt: "2026-07-01", endsAt: null }
  ],
  students: [
    { id: "s1", firstName: "Миша", lastName: "Ковалев", birthYear: 2018, status: "ACTIVE", primaryGroupId: "g1", joinedAt: "2026-06-01", trialAt: "2026-06-03", activatedAt: "2026-06-10", inactiveReason: "", archivedAt: null, deletedAt: null, note: "Любит вратарские упражнения" },
    { id: "s2", firstName: "Данил", lastName: "Беляев", birthYear: 2019, status: "TRIAL", primaryGroupId: "g1", joinedAt: "2026-07-10", trialAt: "2026-07-10", activatedAt: null, inactiveReason: "", archivedAt: null, deletedAt: null, note: "После пробной нужно связаться" },
    { id: "s3", firstName: "Саша", lastName: "Миронов", birthYear: 2016, status: "ACTIVE", primaryGroupId: "g2", joinedAt: "2026-05-15", trialAt: "2026-05-15", activatedAt: "2026-05-22", inactiveReason: "", archivedAt: null, deletedAt: null, note: "" },
    { id: "s4", firstName: "Егор", lastName: "Ларионов", birthYear: 2017, status: "INACTIVE", primaryGroupId: "g3", joinedAt: "2026-05-01", trialAt: "2026-05-01", activatedAt: "2026-05-08", inactiveReason: "Пауза по решению родителя", archivedAt: null, deletedAt: null, note: "" },
    { id: "s5", firstName: "Артем", lastName: "Наумов", birthYear: 2020, status: "ACTIVE", primaryGroupId: "g4", joinedAt: "2026-07-03", trialAt: "2026-07-03", activatedAt: "2026-07-10", inactiveReason: "", archivedAt: null, deletedAt: null, note: "" },
    { id: "s6", firstName: "Никита", lastName: "Орехов", birthYear: 2018, status: "ACTIVE", primaryGroupId: "g1", joinedAt: "2026-06-20", trialAt: "2026-06-20", activatedAt: "2026-06-27", inactiveReason: "", archivedAt: null, deletedAt: null, note: "Ходит также в старшую группу по субботам" }
  ],
  parents: [
    { id: "p1", name: "Анна Ковалева", phone: "+7 900 101-20-30", vk: "", studentIds: ["s1"] },
    { id: "p2", name: "Ольга Беляева", phone: "+7 901 222-33-44", vk: "", studentIds: ["s2"] },
    { id: "p3", name: "Мария Миронова", phone: "+7 902 333-44-55", vk: "", studentIds: ["s3"] },
    { id: "p4", name: "Павел Ларионов", phone: "+7 903 444-55-66", vk: "", studentIds: ["s4"] },
    { id: "p5", name: "Елена Наумова", phone: "+7 904 555-66-77", vk: "", studentIds: ["s5"] },
    { id: "p6", name: "Виктория Орехова", phone: "+7 905 777-88-99", vk: "", studentIds: ["s6"] }
  ],
  enrollments: [
    { id: "e1", studentId: "s1", branchId: "b1", groupId: "g1", startsAt: "2026-06-01", endsAt: null, isPrimary: true },
    { id: "e2", studentId: "s2", branchId: "b1", groupId: "g1", startsAt: "2026-07-10", endsAt: null, isPrimary: true },
    { id: "e3", studentId: "s3", branchId: "b1", groupId: "g2", startsAt: "2026-05-15", endsAt: null, isPrimary: true },
    { id: "e4", studentId: "s4", branchId: "b2", groupId: "g3", startsAt: "2026-05-01", endsAt: null, isPrimary: true },
    { id: "e5", studentId: "s5", branchId: "b3", groupId: "g4", startsAt: "2026-07-03", endsAt: null, isPrimary: true },
    { id: "e6", studentId: "s6", branchId: "b1", groupId: "g1", startsAt: "2026-06-20", endsAt: null, isPrimary: true },
    { id: "e7", studentId: "s6", branchId: "b1", groupId: "g2", startsAt: "2026-07-01", endsAt: null, isPrimary: false }
  ],
  trainings: [
    { id: "t1", date: "2026-07-07", startTime: "17:00", endTime: "18:00", month: "2026-07", branchId: "b1", groupId: "g1", trainerId: "u3", assistantId: "u2", status: "DONE", type: "REGULAR", originalTrainingId: null, deletedAt: null, archivedAt: null },
    { id: "t2", date: "2026-07-10", startTime: "17:00", endTime: "18:00", month: "2026-07", branchId: "b1", groupId: "g1", trainerId: "u3", assistantId: "u2", status: "DONE", type: "REGULAR", originalTrainingId: null, deletedAt: null, archivedAt: null },
    { id: "t3", date: "2026-07-14", startTime: "17:00", endTime: "18:00", month: "2026-07", branchId: "b1", groupId: "g1", trainerId: "u3", assistantId: "u2", status: "DONE", type: "REGULAR", originalTrainingId: null, deletedAt: null, archivedAt: null },
    { id: "t4", date: "2026-07-17", startTime: "17:00", endTime: "18:00", month: "2026-07", branchId: "b1", groupId: "g1", trainerId: "u3", assistantId: "u2", status: "PLANNED", type: "REGULAR", originalTrainingId: null, deletedAt: null, archivedAt: null },
    { id: "t5", date: "2026-07-17", startTime: "18:10", endTime: "19:10", month: "2026-07", branchId: "b1", groupId: "g2", trainerId: "u3", assistantId: null, status: "PLANNED", type: "REGULAR", originalTrainingId: null, deletedAt: null, archivedAt: null },
    { id: "t6", date: "2026-07-16", startTime: "16:30", endTime: "17:30", month: "2026-07", branchId: "b2", groupId: "g3", trainerId: "u4", assistantId: "u3", status: "MOVED", type: "REGULAR", originalTrainingId: null, deletedAt: null, archivedAt: null },
    { id: "t7", date: "2026-07-18", startTime: "16:30", endTime: "17:30", month: "2026-07", branchId: "b2", groupId: "g3", trainerId: "u4", assistantId: "u3", status: "PLANNED", type: "REPLACEMENT", originalTrainingId: "t6", deletedAt: null, archivedAt: null },
    { id: "t8", date: "2026-07-17", startTime: "18:00", endTime: "19:00", month: "2026-07", branchId: "b3", groupId: "g4", trainerId: "u5", assistantId: null, status: "PLANNED", type: "REGULAR", originalTrainingId: null, deletedAt: null, archivedAt: null }
  ],
  attendance: [
    { id: "a1", trainingId: "t1", studentId: "s1", mark: "PRESENT", priceAtAttendance: 300 },
    { id: "a2", trainingId: "t1", studentId: "s6", mark: "PRESENT", priceAtAttendance: 300 },
    { id: "a3", trainingId: "t2", studentId: "s1", mark: "PRESENT", priceAtAttendance: 300 },
    { id: "a4", trainingId: "t2", studentId: "s2", mark: "TRIAL", priceAtAttendance: 0 },
    { id: "a5", trainingId: "t2", studentId: "s6", mark: "PRESENT", priceAtAttendance: 300 },
    { id: "a6", trainingId: "t3", studentId: "s1", mark: "PRESENT", priceAtAttendance: 300 },
    { id: "a7", trainingId: "t3", studentId: "s6", mark: "PRESENT", priceAtAttendance: 300 },
    { id: "a8", trainingId: "t5", studentId: "s3", mark: "PRESENT", priceAtAttendance: 300 }
  ],
  charges: [
    { id: "c1", studentId: "s1", groupId: "g1", branchId: "b1", month: "2026-07", trainingsCount: 8, pricePerTraining: 300, baseAmount: 2400, carryoverUsed: 300, overpayUsed: 0, finalAmount: 2100, dueDate: "2026-07-07", status: "PARTIAL", isConfirmed: true, deletedAt: null },
    { id: "c2", studentId: "s3", groupId: "g2", branchId: "b1", month: "2026-07", trainingsCount: 8, pricePerTraining: 300, baseAmount: 2400, carryoverUsed: 0, overpayUsed: 0, finalAmount: 2400, dueDate: "2026-07-07", status: "PARTIAL", isConfirmed: true, deletedAt: null },
    { id: "c3", studentId: "s5", groupId: "g4", branchId: "b3", month: "2026-07", trainingsCount: 5, pricePerTraining: 300, baseAmount: 1500, carryoverUsed: 0, overpayUsed: 0, finalAmount: 1500, dueDate: "2026-07-07", status: "PAID", isConfirmed: true, deletedAt: null },
    { id: "c4", studentId: "s6", groupId: "g1", branchId: "b1", month: "2026-07", trainingsCount: 8, pricePerTraining: 300, baseAmount: 2400, carryoverUsed: 0, overpayUsed: 0, finalAmount: 2400, dueDate: "2026-07-07", status: "AWAITING", isConfirmed: false, deletedAt: null }
  ],
  payments: [
    { id: "pay1", parentId: "p1", amount: 1200, paymentDate: "2026-07-03", createdBy: "u1", deletedAt: null },
    { id: "pay2", parentId: "p3", amount: 1200, paymentDate: "2026-07-04", createdBy: "u1", deletedAt: null },
    { id: "pay3", parentId: "p5", amount: 1500, paymentDate: "2026-07-05", createdBy: "u2", deletedAt: null }
  ],
  allocations: [
    { id: "al1", paymentId: "pay1", chargeId: "c1", allocatedAmount: 1200 },
    { id: "al2", paymentId: "pay2", chargeId: "c2", allocatedAmount: 1200 },
    { id: "al3", paymentId: "pay3", chargeId: "c3", allocatedAmount: 1500 }
  ],
  credits: [
    { id: "cr1", studentId: "s1", groupId: "g1", sourceMonth: "2026-06", amount: 300, remainingAmount: 0, sourceType: "ABSENCE_CARRYOVER" },
    { id: "cr2", studentId: "s6", groupId: "g1", sourceMonth: "2026-06", amount: 300, remainingAmount: 300, sourceType: "OVERPAYMENT" }
  ],
  debts: [],
  monthClosings: [],
  openedBranchMonths: [],
  deleted: [],
  archive: [],
  auditLog: [
    { id: "log1", at: "2026-07-17 09:00", userId: "u1", action: "Созданы демо-данные CRM", entity: "system" }
  ]
};

let db = loadData();
let remoteBootstrapping = false;
let remoteRefreshTimer = null;
syncBranchNames();
syncRealRoster();
syncRealSchedule();
syncAssistantRule();
resetHistoricalCounters();
if (normalizeChargesToConfirmed()) saveData();
if (rebuildAbsenceCarryovers()) saveData();
normalizeOwnerRole();
normalizeUserAccounts();
if (normalizeTrainerAssignments()) saveData();
if (sanitizeStoredData()) saveData();
migrateStoredPlainPasswords();

const labels = {
  owner: "Владелец",
  coach: "Тренер",
  ACTIVE: "Активный",
  TRIAL: "Пробный",
  INACTIVE: "Неактивный",
  PRESENT: "Был",
  TRIAL_MARK: "Пробная",
  PLANNED: "Запланирована",
  DONE: "Проведена",
  NOT_HELD: "Не запланирована",
  CANCELLED: "Отменена",
  MOVED: "Перенесена",
  REGULAR: "Постоянная",
  EXTRA: "Дополнительная",
  REPLACEMENT: "Заменяющая",
  AWAITING: "Ожидает оплаты",
  PARTIAL: "Оплачено частично",
  PAID: "Оплачено",
  DEBT: "Задолженность"
};

const navItems = [
  ["today", "◧", "Главная"],
  ["coach", "⚑", "Тренер"],
  ["students", "◎", "Ученики"],
  ["branches", "▦", "Филиалы"],
  ["trainings", "✓", "Тренировки"],
  ["payments", "₽", "Оплаты"],
  ["debts", "!", "Долги"],
  ["closing", "□", "Закрытие"],
  ["reports", "▤", "Статистика"],
  ["messages", "✉", "Сообщения"],
  ["settings", "⚙", "Настройки"],
  ["deleted", "⌫", "Удаленные"],
  ["finance", "₽", "Финансы"],
  ["audit", "⋯", "Журнал"]
];

const root = document.getElementById("viewRoot");
const navList = document.getElementById("navList");
const pageTitle = document.getElementById("pageTitle");
const accountPanel = document.getElementById("accountPanel");
const globalSearch = document.getElementById("globalSearch");
const mobileMenuButton = document.getElementById("mobileMenuBtn");
const mobileNavCloseButton = document.getElementById("mobileNavCloseBtn");
const mobileNavBackdrop = document.getElementById("mobileNavBackdrop");
const dialog = document.getElementById("studentDialog");
const studentForm = document.getElementById("studentForm");
const assistantDialog = document.getElementById("assistantDialog");
const assistantForm = document.getElementById("assistantForm");
const assistantTrainerSelect = document.getElementById("assistantTrainerSelect");
const extraTrainingDialog = document.getElementById("extraTrainingDialog");
const extraTrainingForm = document.getElementById("extraTrainingForm");
const toastHost = document.getElementById("toastHost");

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return clone(defaultData);
  try {
    const parsed = JSON.parse(saved);
    return { ...clone(defaultData), ...parsed };
  } catch {
    return clone(defaultData);
  }
}

function syncBranchNames() {
  const branchNames = {
    b1: "45 лицей",
    b2: "74 СОШ",
    b3: "87 СОШ",
    b4: "Первомайская СОШ",
    b5: "Первомайский детский сад",
    b6: "63 СОШ"
  };
  let changed = false;
  db.branches.forEach((branch) => {
    if (branchNames[branch.id] && branch.name !== branchNames[branch.id]) {
      branch.name = branchNames[branch.id];
      branch.address = branch.address && branch.address !== "Первомайская, 18" && branch.address !== "Спортивная, 4" && branch.address !== "Северная, 9" && branch.address !== "Мира, 11" && branch.address !== "Озерная, 3" && branch.address !== "Арена, 1"
        ? branch.address
        : "Адрес уточняется";
      changed = true;
    }
  });
  if (changed) localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function syncRealRoster() {
  const rosterVersion = "real-roster-branches-2026-07-17";
  if (db.realRosterVersion === rosterVersion) return;
  if (db.students.some((student) => String(student.id || "").startsWith("real_"))) {
    db.realRosterVersion = rosterVersion;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    return;
  }

  const demoStudentIds = ["s1", "s2", "s3", "s4", "s5", "s6"];
  const demoParentIds = ["p1", "p2", "p3", "p4", "p5", "p6"];
  const demoChargeIds = db.charges.filter((charge) => demoStudentIds.includes(charge.studentId)).map((charge) => charge.id);
  const demoPaymentIds = ["pay1", "pay2", "pay3"];

  db.students = db.students.filter((student) => !demoStudentIds.includes(student.id));
  db.parents = db.parents.filter((parent) => !demoParentIds.includes(parent.id));
  db.enrollments = db.enrollments.filter((enrollment) => !demoStudentIds.includes(enrollment.studentId));
  db.attendance = db.attendance.filter((item) => !demoStudentIds.includes(item.studentId));
  db.charges = db.charges.filter((charge) => !demoStudentIds.includes(charge.studentId));
  db.allocations = db.allocations.filter((allocation) => !demoChargeIds.includes(allocation.chargeId) && !demoPaymentIds.includes(allocation.paymentId));
  db.payments = db.payments.filter((payment) => !demoPaymentIds.includes(payment.id));
  db.credits = db.credits.filter((credit) => !demoStudentIds.includes(credit.studentId));
  db.debts = db.debts.filter((debt) => !demoStudentIds.includes(debt.studentId));

  const roster = {
    b2: [
      "Бекмансуров Ильдар",
      "Новиков Лев",
      "Новиков Филипп",
      "Благодатских Максим",
      "Камалов Аяз",
      "Князев Лев",
      "Осипов Александр",
      "Баймурзин Марсель",
      "Семиволков Михаил",
      "Мингазов Самир",
      "Расулев Камиль",
      "Мухамитов Амир",
      "Королев Степан",
      "Анисимов Максим",
      "Джумакулыев Карим",
      "Павлов Глеб",
      "Мерзляков Никита",
      "Зайцев Тимур",
      "Яшин Дмитрий",
      "Гущин Алексей",
      "Климов Иван",
      "Ниматов Руслан",
      "Сидоров Захар",
      "Брылякова Виктория",
      "Назмутдинов Тимур",
      "Агапов Тимур",
      "Мамедов Али",
      "Гильванов Риналь",
      "Калинин Денис",
      "Булдаков Максим",
      "Кудрявцев Арсений",
      "Стерхов Игорь",
      "Ванюшев Мирослав",
      "Матвейчук Тимур",
      "Неганов Никита",
      "Юрлов Владислав",
      "Андреев Илья",
      "Карабельская Алиса"
    ],
    b3: [
      "Аникин Савелий",
      "Бочкарев Тимофей",
      "Вичужанин Владислав",
      "Шамшурин Александр",
      "Кузнецов Даниил",
      "Красников Даниэль",
      "Александров Арсений",
      "Барабанщиков Тимофей",
      "Валеев Карим",
      "Корепанов Арсений",
      "Кузнецов Денис",
      "Ногай Михаил",
      "Павлов Егор",
      "Пономарёв Родион",
      "Стрелков Макар",
      "Тукмачев Артём",
      "Ходырев Егор",
      "Шаклеин Артём",
      "Швалев Матвей",
      "Пушин Александр",
      "Лопатина Ева",
      "Лукин Андрей",
      "Калинин Александр",
      "Проскуряков Савва",
      "Даниил Алалыкин",
      "Вичужанин Роман"
    ],
    b1: [
      "Пушин Михаил",
      "Стрелков Кирилл",
      "Костицин Макар",
      "Думовова Ева",
      "Носов Никита",
      "Микрюков Роман",
      "Сидоров Егор",
      "Саляхов Ансар",
      "Касьянова Настя",
      "Максимов Руслан",
      "Стрелков Роман",
      "Мусин Тимур"
    ],
    b4: [
      "Поздеев Кирилл",
      "Кашин Глеб",
      "Галушкин Филипп",
      "Костенков Илья",
      "Дородов Ярослав",
      "Павлов Тимур",
      "Шишкин Максим",
      "Калинин Роман",
      "Силин Федор",
      "Желдыбин Иван",
      "Поздеев Артем",
      "Балабанов Павел",
      "Поторочин Юрий",
      "Кадыров Тимур",
      "Козлов Макар",
      "Стулов Прохор",
      "Русских Кирилл",
      "Вахрушев Матвей",
      "Орлов Максим",
      "Чернышев Ярослав",
      "Штыков Иван",
      "Моор Давид",
      "Туктарова Мирослава",
      "Петров Кирилл",
      "Юсупова Камила",
      "Воронов Макар",
      "Анкудинов Дамир",
      "Акатьев Михаил",
      "Соковиков Кирилл"
    ],
    b6: [
      "Антонов Константин",
      "Бегишев Елисей",
      "Селеверстов Данил",
      "Перевозчиков Михаил",
      "Мерзлякова Ульяна",
      "Вахранев Кирилл",
      "Касимов Руслан",
      "Боднарчук Степан",
      "Трудолюбов Арсений",
      "Тронин Максим",
      "Жуйков Михаил",
      "Белокрылов Илья",
      "Углева Мария",
      "Загребин Никита",
      "Ярощук Соня",
      "Кузнецов Марк",
      "Орехов Данил",
      "Низамов Богдан",
      "Васильев Родион"
    ]
  };

  Object.entries(roster).forEach(([branchId, names]) => {
    const groupId = ensureRosterGroup(branchId);
    names.forEach((fullName, index) => {
      const studentId = `real_${branchId}_${String(index + 1).padStart(2, "0")}`;
      const parentId = `parent_${studentId}`;
      const enrollmentId = `enroll_${studentId}`;

      if (!db.students.some((student) => student.id === studentId)) {
        db.students.push({
          id: studentId,
          firstName: fullName,
          lastName: "",
          birthYear: 2017,
          status: "ACTIVE",
          primaryGroupId: groupId,
          joinedAt: "2026-07-01",
          trialAt: null,
          activatedAt: "2026-07-01",
          inactiveReason: "",
          archivedAt: null,
          deletedAt: null,
          note: "Добавлен из списка филиала"
        });
      } else {
        const student = db.students.find((item) => item.id === studentId);
        student.firstName = fullName;
        student.lastName = "";
        student.status ||= "ACTIVE";
        student.primaryGroupId = groupId;
        student.deletedAt = null;
        student.archivedAt = null;
      }

      if (!db.parents.some((parent) => parent.id === parentId)) {
        db.parents.push({
          id: parentId,
          name: `Родитель: ${fullName}`,
          phone: "не указан",
          vk: "",
          studentIds: [studentId]
        });
      }

      if (!db.enrollments.some((enrollment) => enrollment.id === enrollmentId)) {
        db.enrollments.push({
          id: enrollmentId,
          studentId,
          branchId,
          groupId,
          startsAt: "2026-07-01",
          endsAt: null,
          isPrimary: true
        });
      } else {
        const enrollment = db.enrollments.find((item) => item.id === enrollmentId);
        enrollment.branchId = branchId;
        enrollment.groupId = groupId;
        enrollment.endsAt = null;
        enrollment.isPrimary = true;
      }
    });
  });

  db.realRosterVersion = rosterVersion;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function syncRealSchedule() {
  const scheduleVersion = "real-schedule-aug-nov-2026-v2";
  if (db.scheduleVersion === scheduleVersion) return;

  if (Array.isArray(db.schedules) && db.schedules.length) {
    db.scheduleVersion = scheduleVersion;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    return;
  }

  db.schedules = [];
  db.trainings = [];
  db.attendance = [];
  db.charges = db.charges.filter((charge) => AVAILABLE_MONTHS.includes(charge.month));
  db.debts = db.debts.filter((debt) => AVAILABLE_MONTHS.includes(debt.month));
  db.monthClosings = db.monthClosings.filter((closing) => AVAILABLE_MONTHS.includes(closing.month));

  const scheduleRows = [
    { branchId: "b6", days: [{ weekday: 2, start: "17:00", end: "18:00" }, { weekday: 3, start: "19:30", end: "20:30" }, { weekday: 5, start: "17:30", end: "18:30" }] },
    { branchId: "b1", days: [{ weekday: 3, start: "20:00", end: "21:00" }, { weekday: 6, start: "15:00", end: "17:00" }, { weekday: 0, start: "15:30", end: "17:30" }] },
    { branchId: "b3", days: [{ weekday: 1, start: "18:45", end: "20:45" }, { weekday: 5, start: "19:30", end: "21:30" }, { weekday: 0, start: "18:00", end: "20:00" }] },
    { branchId: "b4", days: [{ weekday: 6, start: "17:30", end: "18:30" }, { weekday: 0, start: "13:00", end: "14:00" }] },
    { branchId: "b2", days: [{ weekday: 1, start: "20:00", end: "21:00" }, { weekday: 5, start: "19:00", end: "21:00" }, { weekday: 6, start: "15:30", end: "17:30" }] },
    { branchId: "b5", days: [{ weekday: 6, start: "16:30", end: "17:30" }, { weekday: 0, start: "12:00", end: "14:00" }] }
  ];

  scheduleRows.forEach((row) => {
    const groupId = ensureRosterGroup(row.branchId);
    row.days.forEach((day, index) => {
      db.schedules.push({
        id: `real_sch_${row.branchId}_${day.weekday}_${index}`,
        groupId,
        weekday: day.weekday,
        startTime: day.start,
        endTime: day.end,
        startsAt: "2026-07-01",
        endsAt: null
      });
    });
  });

  AVAILABLE_MONTHS.forEach((month) => createTrainingsFromRealSchedule(month));
  db.filters.month = CURRENT_MONTH;
  db.selectedTrainingId = null;
  db.scheduleVersion = scheduleVersion;
  audit("Внедрено настоящее расписание тренировок", "расписание с фото");
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function createTrainingsFromRealSchedule(month, fromDate = "") {
  const [year, monthNumber] = month.split("-").map(Number);
  const daysInMonth = new Date(year, monthNumber, 0).getDate();

  db.schedules.forEach((schedule) => {
    const group = byId(db.groups, schedule.groupId);
    if (!group) return;

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = `${year}-${String(monthNumber).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      if (fromDate && date < fromDate) continue;
      const weekday = new Date(`${date}T12:00:00`).getDay();
      if (weekday !== schedule.weekday) continue;
      const existing = db.trainings.some((training) =>
        training.groupId === group.id &&
        training.date === date &&
        training.startTime === schedule.startTime &&
        training.endTime === schedule.endTime &&
        !training.deletedAt
      );
      if (existing) continue;

      db.trainings.push({
        id: `real_tr_${schedule.id}_${date}`,
        date,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        month,
        branchId: group.branchId,
        groupId: group.id,
        trainerId: group.trainerId,
        assistantId: null,
        assistantConfirmed: false,
        status: "PLANNED",
        type: "REGULAR",
        originalTrainingId: null,
        deletedAt: null,
        archivedAt: null
      });
    }
  });
}

function trainingHasMarks(trainingId) {
  return db.attendance.some((mark) => mark.trainingId === trainingId && mark.mark && mark.mark !== "EMPTY");
}

function rebuildBranchTrainingsFromSchedule(branchId) {
  const group = byId(db.groups, ensureRosterGroup(branchId));
  if (!group) return;

  db.trainings = db.trainings.filter((training) => {
    if (training.branchId !== branchId || training.type !== "REGULAR") return true;
    if (training.date < TODAY) return true;
    if (trainingHasMarks(training.id)) return true;
    return false;
  });

  AVAILABLE_MONTHS.forEach((month) => createTrainingsFromRealSchedule(month, TODAY));
}

function syncAssistantRule() {
  const version = "assistant-explicit-selection-2026-07-17";
  if (db.assistantRuleVersion === version) return;
  db.trainings.forEach((training) => {
    training.assistantId = null;
    training.assistantConfirmed = false;
  });
  db.assistantRuleVersion = version;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function normalizeOwnerRole() {
  let changed = false;
  db.users.forEach((user) => {
    if (user.role !== "owner" && user.role !== "coach") {
      user.role = "owner";
      changed = true;
    }
  });
  const current = db.currentUserId ? byId(db.users, db.currentUserId) : null;
  if (current && current.role !== "owner" && current.role !== "coach") {
    current.role = "owner";
    changed = true;
  }
  if (changed) localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function normalizeUserAccounts() {
  let changed = false;
  const defaults = {
    u1: ["owner", "d523febf96b018e2dc367f8daa29a7150ef60a73e9fae34caa8e97cb0a72d8ef"],
    u2: ["marina", "f81b8cc97e59b62eda3127a323ffc0b0035505f71c780db05e50f9a4db650dda"],
    u3: ["morozov", "6fe5c275511b5b476ad1cce6b1bd9beda7cbf1fe73aa51fdbc5f6fb837fdc0ca"],
    u4: ["solovev", "6c269e6348a59807bf31847615f91b4dac931eea152c1c1f8a6d3e3726689255"],
    u5: ["orlov", "c22effe1ae6f2925f91549111dfd2489576f47bed9d2d8f21a4565310a5b9364"]
  };
  db.users.forEach((user, index) => {
    if (!user.login) {
      user.login = defaults[user.id]?.[0] || `user${index + 1}`;
      changed = true;
    }
    if (!user.passwordHash && !user.password) {
      user.passwordHash = defaults[user.id]?.[1] || "";
      user.passwordVersion = PASSWORD_VERSION;
      changed = true;
    }
    if (!Array.isArray(user.branchIds)) {
      user.branchIds = [];
      changed = true;
    }
    if (!Array.isArray(user.groupIds)) {
      user.groupIds = [];
      changed = true;
    }
  });
  if (changed) localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function sanitizeStoredData() {
  let changed = false;
  const cleanField = (item, field, maxLength = 200) => {
    if (!item || typeof item[field] !== "string") return;
    const next = cleanText(item[field], maxLength);
    if (next !== item[field]) {
      item[field] = next;
      changed = true;
    }
  };

  db.users.forEach((user) => {
    cleanField(user, "name", 120);
    cleanField(user, "login", 80);
  });
  db.branches.forEach((branch) => {
    cleanField(branch, "name", 120);
    cleanField(branch, "address", 180);
  });
  db.groups.forEach((group) => {
    cleanField(group, "name", 120);
    cleanField(group, "ageRange", 40);
  });
  db.students.forEach((student) => {
    cleanField(student, "firstName", 60);
    cleanField(student, "lastName", 80);
    cleanField(student, "note", 500);
    cleanField(student, "source", 80);
  });
  db.parents.forEach((parent) => {
    cleanField(parent, "name", 120);
    cleanField(parent, "phone", 40);
    cleanField(parent, "vk", 160);
  });
  return changed;
}

async function migrateStoredPlainPasswords() {
  let changed = false;
  for (const user of db.users) {
    if (user.password) {
      await setUserPassword(user, user.password);
      changed = true;
    }
  }
  if (changed) saveData();
}

function resetHistoricalCounters() {
  const version = "history-reset-all-2026-07-18";
  if (db.historyResetVersion === version) return;
  clearOperationalTables();
  db.historyResetVersion = version;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function clearOperationalTables() {
  db.attendance = [];
  db.charges = [];
  db.payments = [];
  db.allocations = [];
  db.credits = [];
  db.debts = [];
  db.monthClosings = [];
  db.openedBranchMonths = [];
  db.selectedTrainingId = null;
  db.showTrainingPicker = false;
  db.showCalendar = false;
  db.trainings.forEach((training) => {
    if (training.deletedAt || training.archivedAt) return;
    if (training.status !== "CANCELLED") training.status = "PLANNED";
    training.assistantConfirmed = false;
  });
}

function stockReset() {
  if (!isOwner()) return toast("СТОК доступен только владельцу");
  if (!confirm("СТОК очистит отметки, начисления, оплаты, долги, переносы и закрытия месяцев. Продолжить?")) return;
  const password = prompt("Введите пароль для СТОК");
  if (password !== "1337") return toast("Неверный пароль СТОК");
  clearOperationalTables();
  db.filters = { branchId: "all", groupId: "all", month: CURRENT_MONTH };
  db.trainingFilters = { branchId: "all", month: CURRENT_MONTH };
  db.coachFilters = { branchId: "all", month: CURRENT_MONTH };
  db.financeFilters = { branchId: "all", month: CURRENT_MONTH };
  db.paymentFilters = { branchId: "all", month: CURRENT_MONTH };
  db.messageFilters = { branchId: "all", month: CURRENT_MONTH };
  db.excelMonth = CURRENT_MONTH;
  db.excelBranchId = activeBranches()[0]?.id || "all";
  db.activeView = "today";
  db.query = "";
  db.selectedTrainingId = null;
  db.coachSelectedTrainingId = null;
  audit("СТОК", "очищены отметки, начисления, оплаты, долги, переносы и закрытия месяцев");
  saveData("СТОК выполнен");
  render();
}

function normalizeChargesToConfirmed() {
  let changed = false;
  db.charges.forEach((charge) => {
    if (charge.deletedAt) return;
    if (!charge.isConfirmed) {
      charge.isConfirmed = true;
      charge.status = charge.finalAmount > 0 ? "AWAITING" : "PAID";
      changed = true;
    }
  });
  return changed;
}

function ensureRosterGroup(branchId) {
  const existing = db.groups.find((group) => group.branchId === branchId && group.name === "Основная группа" && !group.deletedAt);
  if (existing) return existing.id;

  const fallback = db.groups.find((group) => group.branchId === branchId && !group.deletedAt && !group.archivedAt);
  if (fallback) return fallback.id;

  const groupId = `group_${branchId}_main`;
  db.groups.push({
    id: groupId,
    branchId,
    name: "Основная группа",
    ageRange: "уточнить",
    trainerId: fallbackCoachId(),
    assistantId: null,
    isActive: true,
    archivedAt: null,
    deletedAt: null
  });
  db.users.forEach((user) => {
    if (["owner"].includes(user.role) && !user.groupIds.includes(groupId)) user.groupIds.push(groupId);
  });
  return groupId;
}

function normalizeTrainerAssignments() {
  const fallback = fallbackCoachId();
  if (!fallback) return false;
  let changed = false;
  const isValidCoach = (userId) => {
    const user = byId(db.users, userId);
    return Boolean(user && !user.deletedAt && user.role === "coach");
  };

  db.groups.forEach((group) => {
    if (group.deletedAt || group.archivedAt) return;
    if (!isValidCoach(group.trainerId)) {
      group.trainerId = fallback;
      changed = true;
    }
    if (group.assistantId && !isValidCoach(group.assistantId)) {
      group.assistantId = null;
      changed = true;
    }
  });

  db.trainings.forEach((training) => {
    if (training.deletedAt || training.archivedAt) return;
    if (!isValidCoach(training.trainerId)) {
      const group = byId(db.groups, training.groupId);
      training.trainerId = isValidCoach(group?.trainerId) ? group.trainerId : fallback;
      changed = true;
    }
    if (training.assistantId && !isValidCoach(training.assistantId)) {
      training.assistantId = null;
      training.assistantConfirmed = false;
      changed = true;
    }
  });

  if (syncCoachAccessFromBranchTrainers()) changed = true;
  return changed;
}

function saveData(message) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  if (!remoteBootstrapping && window.AtakaRemote?.isReady?.() && window.AtakaRemote?.isSignedIn?.()) {
    window.AtakaRemote.saveState(remoteSafeData(db));
  }
  if (message) toast(message);
}

function remoteSafeData(state) {
  const copy = clone(state);
  copy.security = { loginFailures: {} };
  return copy;
}

function localUiState(state = db) {
  const ui = {};
  LOCAL_UI_KEYS.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(state, key)) ui[key] = clone(state[key]);
  });
  return ui;
}

function restoreLocalUi(state, ui) {
  Object.entries(ui || {}).forEach(([key, value]) => {
    state[key] = clone(value);
  });
}

function sharedStateSignature(state = db) {
  const shared = {};
  SHARED_STATE_KEYS.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(state, key)) shared[key] = state[key];
  });
  return JSON.stringify(shared);
}

function toast(message) {
  const item = document.createElement("div");
  item.className = "toast";
  item.textContent = message;
  toastHost.appendChild(item);
  setTimeout(() => item.remove(), 2600);
}

function id(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 7)}`;
}

function generateLogin() {
  let index = db.users.length + 1;
  let login = `user${index}`;
  while (db.users.some((user) => user.login === login)) {
    index += 1;
    login = `user${index}`;
  }
  return login;
}

function normalizeLogin(value) {
  return String(value || "").trim().replace(/\s+/g, "").toLowerCase();
}

function loginToSupabaseEmail(login) {
  const normalizedLogin = normalizeLogin(login);
  if (!normalizedLogin) return "";
  return normalizedLogin.includes("@") ? normalizedLogin : `${normalizedLogin}@${SUPABASE_LOGIN_DOMAIN}`;
}

function isValidLoginAlias(login) {
  const normalizedLogin = normalizeLogin(login);
  if (!normalizedLogin) return false;
  if (normalizedLogin.includes("@")) return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedLogin);
  return /^[a-z0-9._-]{2,40}$/.test(normalizedLogin);
}

function loginMatchesUser(user, login, supabaseEmail = "") {
  const storedLogin = normalizeLogin(user?.login);
  const normalizedLogin = normalizeLogin(login);
  const normalizedEmail = normalizeLogin(supabaseEmail);
  return Boolean(storedLogin && (storedLogin === normalizedLogin || storedLogin === normalizedEmail));
}

function generatePassword() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}

function randomToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function passwordDigest(userId, password) {
  const payload = new TextEncoder().encode(`${PASSWORD_VERSION}:${userId}:${password}:ataka-crm`);
  const buffer = await crypto.subtle.digest("SHA-256", payload);
  return Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function setUserPassword(user, password) {
  user.passwordHash = await passwordDigest(user.id, password);
  user.passwordVersion = PASSWORD_VERSION;
  delete user.password;
}

async function verifyUserPassword(user, password) {
  if (!user) return false;
  if (user.passwordHash && user.passwordVersion === PASSWORD_VERSION) {
    return user.passwordHash === await passwordDigest(user.id, password);
  }
  if (user.password && user.password === password) {
    await setUserPassword(user, password);
    saveData();
    return true;
  }
  return false;
}

function nowText() {
  const now = new Date();
  const date = todayIso();
  return `${date} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

function loggedUserId() {
  const token = localStorage.getItem(SESSION_KEY);
  const savedLogin = localStorage.getItem(SESSION_LOGIN_KEY) || "";
  db.security ||= { loginFailures: {}, sessions: {} };
  db.security.sessions ||= {};
  const session = token ? db.security.sessions[token] : null;
  if (session?.expiresAt && session.expiresAt > Date.now()) return session.userId;

  if (window.AtakaRemote?.isReady?.() && window.AtakaRemote?.isSignedIn?.() && savedLogin) {
    const user = db.users.find((item) => loginMatchesUser(item, savedLogin, loginToSupabaseEmail(savedLogin)) && !item.deletedAt);
    if (user) {
      db.currentUserId = user.id;
      return user.id;
    }
  }

  localStorage.removeItem(SESSION_KEY);
  return null;
}

function createLocalSession(userId, login = "") {
  db.security ||= { loginFailures: {}, sessions: {} };
  db.security.sessions ||= {};
  const sessionToken = randomToken();
  db.security.sessions[sessionToken] = {
    userId,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000
  };
  localStorage.setItem(SESSION_KEY, sessionToken);
  if (login) localStorage.setItem(SESSION_LOGIN_KEY, normalizeLogin(login));
  db.currentUserId = userId;
}

function isLoggedIn() {
  return Boolean(loggedUserId() && byId(db.users, loggedUserId()));
}

function currentUser() {
  return db.users.find((user) => user.id === loggedUserId()) || db.users.find((user) => user.id === db.currentUserId) || db.users[0];
}

function isOwner() {
  return currentUser().role === "owner";
}

function activeBranches() {
  const user = currentUser();
  return db.branches.filter((branch) => !branch.deletedAt && !branch.archivedAt && branch.isActive && (isOwner() || user.branchIds.includes(branch.id)));
}

function allActiveBranches() {
  return db.branches.filter((branch) => !branch.deletedAt && !branch.archivedAt && branch.isActive);
}

function homeBranches() {
  return currentUser().role === "owner" ? allActiveBranches() : activeBranches();
}

function activeGroups() {
  const branchIds = activeBranches().map((branch) => branch.id);
  const user = currentUser();
  return db.groups.filter((group) => !group.deletedAt && !group.archivedAt && group.isActive && branchIds.includes(group.branchId) && (isOwner() || user.groupIds.includes(group.id)));
}

function byId(collection, itemId) {
  return collection.find((item) => item.id === itemId);
}

function userName(userId) {
  return escapeHtml(byId(db.users, userId)?.name || "Не назначен");
}

function branchName(branchId) {
  return escapeHtml(byId(db.branches, branchId)?.name || "Филиал не найден");
}

function groupName(groupId) {
  return escapeHtml(byId(db.groups, groupId)?.name || "Группа не найдена");
}

function studentName(studentId) {
  const student = byId(db.students, studentId);
  return student ? escapeHtml(`${student.firstName} ${student.lastName}`.trim()) : "Ученик не найден";
}

function parentForStudent(studentId) {
  return db.parents.find((parent) => parent.studentIds.includes(studentId)) || { name: "Родитель не указан", phone: "" };
}

function money(value) {
  return `${new Intl.NumberFormat("ru-RU").format(Math.round(value || 0))} ₽`;
}

function formatMonth(month) {
  const [year, m] = month.split("-");
  const names = ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"];
  return `${names[Number(m) - 1]} ${year}`;
}

function formatDate(date) {
  if (!date) return "";
  const dateOnly = String(date).slice(0, 10);
  const [year, month, day] = dateOnly.split("-").map(Number);
  if (!year || !month || !day) return date;
  const names = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
  return `${day} ${names[month - 1]} ${year}`;
}

function formatDateTime(value) {
  if (!value) return "";
  const [date, time] = String(value).split(" ");
  return `${formatDate(date)}${time ? `, ${time}` : ""}`;
}

function weekdayName(day) {
  return ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"][day];
}

function weekdayFullName(day) {
  return ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"][day];
}

function branchScheduleMap(branchId) {
  const groupId = ensureRosterGroup(branchId);
  const map = new Map();
  db.schedules
    .filter((schedule) => schedule.groupId === groupId && !schedule.endsAt)
    .forEach((schedule) => {
      if (!map.has(schedule.weekday)) map.set(schedule.weekday, schedule);
    });
  return map;
}

function scheduleDayEditor(day, schedule, names) {
  const isActive = Boolean(schedule);
  return `
    <div class="schedule-day-row ${isActive ? "is-active" : ""}">
      <div class="schedule-day-main">
        <label class="schedule-switch" title="Включить тренировку">
          <input type="checkbox" name="${escapeHtml(names.active)}" ${isActive ? "checked" : ""}>
          <span aria-hidden="true"></span>
        </label>
        <div>
          <strong>${weekdayFullName(day)}</strong>
          <small>${isActive ? "Тренировка включена" : "Без тренировки"}</small>
        </div>
      </div>
      <div class="schedule-time-pair">
        <label><span>Начало</span><input type="time" name="${escapeHtml(names.start)}" value="${escapeHtml(schedule?.startTime || "")}"></label>
        <label><span>Конец</span><input type="time" name="${escapeHtml(names.end)}" value="${escapeHtml(schedule?.endTime || "")}"></label>
      </div>
    </div>
  `;
}

function trainerOptions(selectedId = "") {
  return activeCoachUsers()
    .map((user) => `<option value="${escapeHtml(user.id)}" ${user.id === selectedId ? "selected" : ""}>${escapeHtml(user.name)} · ${escapeHtml(labels[user.role] || "Тренер")}</option>`)
    .join("");
}

function activeCoachUsers() {
  return db.users
    .filter((user) => !user.deletedAt && user.role === "coach")
    .sort((a, b) => a.name.localeCompare(b.name, "ru"));
}

function allActiveBranchIds() {
  return db.branches
    .filter((branch) => !branch.deletedAt && !branch.archivedAt && branch.isActive)
    .map((branch) => branch.id);
}

function groupIdsForBranchIds(branchIds) {
  return db.groups
    .filter((group) => !group.deletedAt && !group.archivedAt && branchIds.includes(group.branchId))
    .map((group) => group.id);
}

function setUserBranchAccess(user, branchIds) {
  const uniqueBranchIds = [...new Set(branchIds.filter(Boolean))];
  if (user.role === "owner") {
    user.branchIds = allActiveBranchIds();
    user.groupIds = groupIdsForBranchIds(user.branchIds);
    return;
  }
  user.branchIds = uniqueBranchIds;
  user.groupIds = groupIdsForBranchIds(uniqueBranchIds);
}

function assignBranchTrainer(branchId, trainerId, options = {}) {
  const trainer = byId(db.users, trainerId);
  if (!trainer || trainer.deletedAt || trainer.role !== "coach") return false;

  let changed = false;
  db.groups
    .filter((group) => group.branchId === branchId && !group.deletedAt && !group.archivedAt)
    .forEach((group) => {
      if (group.trainerId !== trainerId) {
        group.trainerId = trainerId;
        changed = true;
      }
      if (group.assistantId === trainerId) {
        group.assistantId = null;
        changed = true;
      }
    });

  db.trainings
    .filter((training) => training.branchId === branchId && training.date >= TODAY && !training.deletedAt && !trainingHasMarks(training.id))
    .forEach((training) => {
      if (training.trainerId !== trainerId) {
        training.trainerId = trainerId;
        changed = true;
      }
      if (training.assistantId === trainerId) {
        training.assistantId = null;
        training.assistantConfirmed = false;
        changed = true;
      }
    });

  if (options.syncAccess !== false) {
    activeCoachUsers().forEach((user) => {
      const before = `${user.branchIds.join(",")}|${user.groupIds.join(",")}`;
      const nextBranchIds = user.id === trainerId
        ? [...new Set([...(user.branchIds || []), branchId])]
        : (user.branchIds || []).filter((item) => item !== branchId);
      setUserBranchAccess(user, nextBranchIds);
      const after = `${user.branchIds.join(",")}|${user.groupIds.join(",")}`;
      if (before !== after) changed = true;
    });
  }

  return changed;
}

function syncBranchTrainersFromCoachAccess() {
  let changed = false;
  allActiveBranchIds().forEach((branchId) => {
    const selectedCoach = activeCoachUsers().find((user) => (user.branchIds || []).includes(branchId));
    if (selectedCoach) {
      if (assignBranchTrainer(branchId, selectedCoach.id, { syncAccess: false })) changed = true;
    }
  });
  if (syncCoachAccessFromBranchTrainers()) changed = true;
  return changed;
}

function syncCoachAccessFromBranchTrainers() {
  let changed = false;
  const branchesByCoach = new Map(activeCoachUsers().map((user) => [user.id, []]));
  allActiveBranchIds().forEach((branchId) => {
    const group = db.groups.find((item) => item.branchId === branchId && !item.deletedAt && !item.archivedAt);
    const trainer = byId(db.users, group?.trainerId);
    if (trainer && !trainer.deletedAt && trainer.role === "coach") {
      branchesByCoach.get(trainer.id)?.push(branchId);
    }
  });

  activeCoachUsers().forEach((user) => {
    const before = `${(user.branchIds || []).join(",")}|${(user.groupIds || []).join(",")}`;
    setUserBranchAccess(user, branchesByCoach.get(user.id) || []);
    const after = `${user.branchIds.join(",")}|${user.groupIds.join(",")}`;
    if (before !== after) changed = true;
  });

  db.users
    .filter((user) => !user.deletedAt && user.role === "owner")
    .forEach((user) => {
      const before = `${(user.branchIds || []).join(",")}|${(user.groupIds || []).join(",")}`;
      setUserBranchAccess(user, allActiveBranchIds());
      const after = `${user.branchIds.join(",")}|${user.groupIds.join(",")}`;
      if (before !== after) changed = true;
    });

  return changed;
}

function fallbackCoachId() {
  return activeCoachUsers()[0]?.id || "";
}

function timeIsValid(value) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(String(value || ""));
}

function xmlEscape(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function excelSheetName(name, usedNames) {
  const base = String(name || "Sheet")
    .replace(/[\\/?*\[\]:]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 31) || "Sheet";
  let candidate = base;
  let index = 2;
  while (usedNames.has(candidate)) {
    const suffix = ` ${index}`;
    candidate = `${base.slice(0, Math.max(1, 31 - suffix.length)).trim()}${suffix}`.slice(0, 31);
    index += 1;
  }
  usedNames.add(candidate);
  return candidate;
}

function excelCell(value) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const cellValue = Object.prototype.hasOwnProperty.call(value, "value") ? value.value : "";
    const type = value.type || (typeof cellValue === "number" && Number.isFinite(cellValue) ? "Number" : "String");
    const style = value.style ? ` ss:StyleID="${xmlEscape(value.style)}"` : "";
    const mergeAcross = value.mergeAcross ? ` ss:MergeAcross="${Number(value.mergeAcross)}"` : "";
    const mergeDown = value.mergeDown ? ` ss:MergeDown="${Number(value.mergeDown)}"` : "";
    return `<Cell${style}${mergeAcross}${mergeDown}><Data ss:Type="${type}">${xmlEscape(cellValue)}</Data></Cell>`;
  }
  const type = typeof value === "number" && Number.isFinite(value) ? "Number" : "String";
  return `<Cell><Data ss:Type="${type}">${xmlEscape(value)}</Data></Cell>`;
}

function excelRow(values) {
  return `<Row>${values.map(excelCell).join("")}</Row>`;
}

const EXCEL_STYLES_XML = `
<Styles>
  <Style ss:ID="Default" ss:Name="Normal">
    <Alignment ss:Vertical="Center"/>
    <Font ss:FontName="Arial" ss:Size="10"/>
  </Style>
  <Style ss:ID="title">
    <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
    <Font ss:FontName="Arial" ss:Size="12" ss:Bold="1"/>
    <Interior ss:Color="#d6c99a" ss:Pattern="Solid"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
    </Borders>
  </Style>
  <Style ss:ID="headBeige">
    <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
    <Font ss:Bold="1"/>
    <Interior ss:Color="#d6c99a" ss:Pattern="Solid"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
    </Borders>
  </Style>
  <Style ss:ID="headBlue">
    <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
    <Font ss:Bold="1"/>
    <Interior ss:Color="#c7dff5" ss:Pattern="Solid"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
    </Borders>
  </Style>
  <Style ss:ID="headCyan">
    <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
    <Font ss:Bold="1"/>
    <Interior ss:Color="#a9f5ff" ss:Pattern="Solid"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
    </Borders>
  </Style>
  <Style ss:ID="headGreen">
    <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
    <Font ss:Bold="1"/>
    <Interior ss:Color="#72f24e" ss:Pattern="Solid"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
    </Borders>
  </Style>
  <Style ss:ID="headYellow">
    <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
    <Font ss:Bold="1"/>
    <Interior ss:Color="#fff94d" ss:Pattern="Solid"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
    </Borders>
  </Style>
  <Style ss:ID="headOrange">
    <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
    <Font ss:Bold="1"/>
    <Interior ss:Color="#ffa033" ss:Pattern="Solid"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
    </Borders>
  </Style>
  <Style ss:ID="rowText">
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
    </Borders>
  </Style>
  <Style ss:ID="rowIndex">
    <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
    </Borders>
  </Style>
  <Style ss:ID="attendMark">
    <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
    </Borders>
  </Style>
  <Style ss:ID="summaryBlue">
    <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
    <Interior ss:Color="#d0e2f3" ss:Pattern="Solid"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
    </Borders>
  </Style>
  <Style ss:ID="summaryCyan">
    <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
    <Interior ss:Color="#a9f5ff" ss:Pattern="Solid"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
    </Borders>
  </Style>
  <Style ss:ID="summaryGreen">
    <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
    <Interior ss:Color="#72f24e" ss:Pattern="Solid"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
    </Borders>
  </Style>
  <Style ss:ID="summaryYellow">
    <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
    <Interior ss:Color="#fff94d" ss:Pattern="Solid"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
    </Borders>
  </Style>
  <Style ss:ID="summaryOrange">
    <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
    <Interior ss:Color="#ffa033" ss:Pattern="Solid"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
    </Borders>
  </Style>
</Styles>`;

function buildExcelWorkbook(sheets) {
  const usedNames = new Set();
  const worksheetXml = sheets.map((sheet) => {
    const name = excelSheetName(sheet.name, usedNames);
    const rows = (sheet.rows?.length ? sheet.rows : [["Нет данных"]]).map(excelRow).join("");
    return `<Worksheet ss:Name="${xmlEscape(name)}"><Table>${rows}</Table></Worksheet>`;
  }).join("");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<?mso-application progid="Excel.Sheet"?>\n<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:html="http://www.w3.org/TR/REC-html40">${EXCEL_STYLES_XML}${worksheetXml}</Workbook>`;
}

function downloadExcelWorkbook() {
  const sheets = excelSheets();
  const xml = buildExcelWorkbook(sheets);
  const blob = new Blob(["\ufeff", xml], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `ataka-crm-${db.filters.month}.xls`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  toast("Excel-файл скачан");
}

function monthHasBranchData(branchId, month) {
  return db.trainings.some((training) => !training.deletedAt && !training.archivedAt && training.branchId === branchId && training.month === month);
}

function branchWorkbookSheets(branchId) {
  const branch = byId(db.branches, branchId);
  if (!branch) return [];
  const includedMonths = AVAILABLE_MONTHS.filter((month) => monthHasBranchData(branchId, month));
  const sheets = [{
    name: "Сводка",
    rows: [
      ["Филиал", branch.name],
      ["Адрес", branch.address || ""],
      ["Месяцы с данными", includedMonths.map((month) => formatMonth(month)).join(", ") || "Нет заполненных месяцев"],
      ["Ученики", db.students.filter((student) => !student.deletedAt && !student.archivedAt && activeEnrollments(student.id).some((enrollment) => enrollment.branchId === branchId)).length]
    ]
  }];
  includedMonths.forEach((month) => {
    sheets.push({
      name: formatMonth(month),
      rows: buildAttendanceSheetRows(month, branchId)
    });
  });
  return sheets;
}

function downloadBranchWorkbook(branchId) {
  const branch = byId(db.branches, branchId);
  if (!branch) {
    toast("Филиал не найден");
    return;
  }
  const sheets = branchWorkbookSheets(branchId);
  const xml = buildExcelWorkbook(sheets.length ? sheets : [{ name: "Сводка", rows: [["Нет данных"]] }]);
  const blob = new Blob(["\ufeff", xml], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `ataka-crm-${branch.name.replace(/[\\/?*\[\]:]/g, "_").replace(/\s+/g, "_")}.xls`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  toast(`Excel по филиалу «${branch.name}» скачан`);
}

function downloadExcelRows(sheetName, rows, filename) {
  const xml = buildExcelWorkbook([{ name: sheetName, rows }]);
  const blob = new Blob(["\ufeff", xml], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function downloadExcelSheetByName(sheetName) {
  const sheet = excelSheets().find((item) => item.name === sheetName);
  if (!sheet) {
    toast("Таблица не найдена");
    return;
  }
  const safeName = sheetName.replace(/[\\/?*\[\]:]/g, "_").replace(/\s+/g, "_");
  downloadExcelRows(sheet.name, sheet.rows, `ataka-crm-${safeName}.xls`);
  toast("Таблица скачана");
}

function downloadAttendanceSheet(month, branchId) {
  const branch = byId(db.branches, branchId);
  if (!branch) {
    toast("Филиал не найден");
    return;
  }
  const trainings = db.trainings
    .filter((training) => !training.deletedAt && !training.archivedAt && training.branchId === branchId && training.month === month)
    .sort((a, b) => `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`));
  const students = db.students
    .filter((student) => !student.deletedAt && !student.archivedAt && student.status !== "INACTIVE")
    .filter((student) => activeEnrollments(student.id).some((enrollment) => enrollment.branchId === branchId))
    .sort((a, b) => studentName(a.id).localeCompare(studentName(b.id), "ru"));
  const summaryColumns = [
    { label: "Посетил", style: "summaryBlue" },
    { label: "План", style: "summaryBlue" },
    { label: "Остаток", style: "summaryBlue" },
    { label: "Перенос с", style: "summaryCyan" },
    { label: `К оплате за ${formatMonth(month)}`, style: "summaryGreen" },
    { label: "Ставка", style: "summaryGreen" },
    { label: "К оплате", style: "summaryGreen" },
    { label: "Оплатил", style: "summaryYellow" },
    { label: "На счету", style: "summaryOrange" },
    { label: "остаток", style: "summaryOrange" }
  ];
  const totalColumns = 2 + trainings.length + summaryColumns.length;
  const rows = [
    [{ value: `Дата проведения тренировок ${formatMonth(month)} — ${branch.name}`, style: "title", mergeAcross: Math.max(totalColumns - 1, 0) }],
    [
      { value: "№ п/п", style: "headBeige" },
      { value: "ФИО", style: "headBeige" },
      ...trainings.map((training) => {
        const day = Number(String(training.date).slice(8, 10));
        const weekday = weekdayName(new Date(`${training.date}T12:00:00`).getDay()).toLowerCase();
        return { value: `${day} ${weekday}\n${training.startTime}`, style: "headBeige" };
      }),
      ...summaryColumns.map((column) => ({ value: column.label, style: column.style }))
    ],
    ...students.map((student, index) => {
      const attendanceMarks = trainings.map((training) => {
      const mark = db.attendance.find((item) => item.trainingId === training.id && item.studentId === student.id)?.mark || "";
        return { value: mark ? 1 : "", type: mark ? "Number" : "String", style: "attendMark" };
      });
      const visited = attendanceMarks.filter((cell) => cell.value === 1).length;
      const plan = trainings.length;
      const rest = Math.max(plan - visited, 0);
      const fin = studentFinance(student.id);
      const studentCharges = db.charges.filter((charge) => charge.studentId === student.id && !charge.deletedAt && charge.isConfirmed && charge.month === month);
      const paid = studentCharges.reduce((sum, charge) => sum + chargePaid(charge.id), 0);
      const base = plan * db.settings.pricePerTraining;
      const toPay = Math.max(base - paid, 0);
      return [
        { value: index + 1, type: "Number", style: "rowIndex" },
        { value: studentName(student.id), style: "rowText" },
        ...attendanceMarks,
        { value: visited, type: "Number", style: "summaryBlue" },
        { value: plan, type: "Number", style: "summaryBlue" },
        { value: rest, type: "Number", style: "summaryBlue" },
        { value: fin.credit || 0, type: "Number", style: "summaryCyan" },
        { value: toPay, type: "Number", style: "summaryGreen" },
        { value: db.settings.pricePerTraining, type: "Number", style: "summaryGreen" },
        { value: base, type: "Number", style: "summaryGreen" },
        { value: paid, type: "Number", style: "summaryYellow" },
        { value: fin.credit || 0, type: "Number", style: "summaryOrange" },
        { value: Math.max(base - paid - (fin.credit || 0), 0), type: "Number", style: "summaryOrange" }
      ];
    })
  ];

  const xml = buildExcelWorkbook([{ name: `Посещ. ${branch.name}`, rows }]);
  const blob = new Blob(["\ufeff", xml], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `ataka-crm-${month}-${branch.name.replace(/[\\/?*\[\]:]/g, "_").replace(/\s+/g, "_")}.xls`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  toast("Таблица скачана");
}

function excelSheets() {
  const currentMonth = db.filters.month;
  const visibleBranchIds = activeBranches().map((branch) => branch.id);
  const currentTrainings = visibleTrainings();
  const currentStudents = visibleStudents(true);
  const currentBranches = activeBranches();
  const visiblePayments = isOwner() ? db.payments.filter((payment) => !payment.deletedAt) : [];
  const visibleCharges = isOwner() ? db.charges.filter((charge) => !charge.deletedAt && hasBranchAccess(charge.branchId)) : [];
  const visibleDebts = isOwner() ? db.debts.filter((debt) => !debt.closedAt && hasBranchAccess(debt.branchId)) : [];
  const visibleArchiveStudents = isOwner() ? db.students.filter((student) => student.archivedAt && !student.deletedAt) : [];
  const visibleArchiveBranches = isOwner() ? db.branches.filter((branch) => branch.archivedAt && !branch.deletedAt) : [];

  const sheets = [
    {
      name: "Сводка",
      rows: [
        ["Показатель", "Значение"],
        ["Филиалов", currentBranches.length],
        ["Ученики", currentStudents.length],
        ["Тренировки", currentTrainings.length],
        ["Проведены", currentTrainings.filter((training) => effectiveTrainingStatus(training) === "DONE").length],
        ["Посещаемость", `${attendanceStats(currentTrainings).percent}%`],
        ["Начислено", isOwner() ? money(visibleCharges.reduce((sum, charge) => sum + charge.finalAmount, 0)) : "скрыто"],
        ["Оплачено", isOwner() ? money(visiblePayments.reduce((sum, payment) => sum + payment.amount, 0)) : "скрыто"],
        ["Долги", isOwner() ? money(visibleDebts.reduce((sum, debt) => sum + debt.amount, 0)) : "скрыто"],
        ["Месяц", formatMonth(currentMonth)]
      ]
    },
    {
      name: "Ученики",
      rows: [
        ["Ученик", "Статус", "Филиал", "Родитель", "Телефон", "Возраст", "Посещаемость", "К оплате", "Комментарий"],
        ...currentStudents.map((student) => {
          const parent = parentForStudent(student.id);
          const fin = studentFinance(student.id);
          const att = studentAttendanceSummary(student.id);
          const primaryBranch = activeEnrollments(student.id)[0]?.branchId;
          return [
            studentName(student.id),
            labels[student.status] || student.status,
            branchName(primaryBranch),
            parent.name,
            parent.phone,
            2026 - Number(student.birthYear || 0),
            `${att.visited}/${att.possible} (${att.percent}%)`,
            isOwner() ? money(fin.toPay) : "скрыто",
            student.note || ""
          ];
        })
      ]
    },
    {
      name: "Филиалы",
      rows: [
        ["Филиал", "Адрес", "Ученики", "Тренировки", "Посещаемость", "Начислено", "Оплачено"],
        ...currentBranches.map((branch) => {
          const branchStudents = db.students.filter((student) => activeEnrollments(student.id).some((enrollment) => enrollment.branchId === branch.id) && !student.deletedAt && !student.archivedAt);
          const branchTrainings = db.trainings.filter((training) => training.branchId === branch.id && !training.deletedAt);
          const branchAttendance = attendanceStats(branchTrainings);
          const branchCharges = db.charges.filter((charge) => charge.branchId === branch.id && charge.isConfirmed && !charge.deletedAt);
          return [
            branch.name,
            branch.address,
            branchStudents.length,
            branchTrainings.length,
            `${branchAttendance.percent}%`,
            isOwner() ? money(branchCharges.reduce((sum, charge) => sum + charge.finalAmount, 0)) : "скрыто",
            isOwner() ? money(branchCharges.reduce((sum, charge) => sum + chargePaid(charge.id), 0)) : "скрыто"
          ];
        })
      ]
    },
    {
      name: "Тренировки",
      rows: [
        ["Дата", "Время", "Филиал", "Группа", "Тренер", "Помощник", "Статус", "Тип", "Отметок", "Оплата тренеров"],
        ...currentTrainings.map((training) => {
          const attendance = db.attendance.filter((item) => item.trainingId === training.id);
          const status = effectiveTrainingStatus(training);
          return [
            formatDate(training.date),
            `${training.startTime}-${training.endTime}`,
            branchName(training.branchId),
            groupName(training.groupId),
            userName(training.trainerId),
            training.assistantConfirmed && training.assistantId ? userName(training.assistantId) : "",
            labels[status] || status,
            labels[training.type] || training.type,
            attendance.length,
            money(trainerPayroll([training]))
          ];
        })
      ]
    },
    {
      name: `Посещаемость ${currentMonth}`,
      rows: buildAttendanceSheetRows(currentMonth, visibleBranchIds[0] || currentBranches[0]?.id)
    },
    {
      name: "Начисления",
      rows: [
        ["Ученик", "Филиал", "Месяц", "Расчет", "К оплате", "Оплачено", "Статус"],
        ...visibleCharges.map((charge) => [
          studentName(charge.studentId),
          branchName(charge.branchId),
          formatMonth(charge.month),
          `${charge.trainingsCount} x ${money(charge.pricePerTraining)} | перенос ${money(charge.carryoverUsed)} | переплата ${money(charge.overpayUsed)}`,
          money(charge.finalAmount),
          money(chargePaid(charge.id)),
          charge.isConfirmed ? (labels[charge.status] || charge.status) : "Черновик"
        ])
      ]
    },
    {
      name: "Оплаты",
      rows: [
        ["Родитель", "Телефон", "Сумма", "Дата", "Создал"],
        ...visiblePayments.map((payment) => {
          const parent = byId(db.parents, payment.parentId) || { name: "Родитель не указан", phone: "" };
          return [parent.name, parent.phone, money(payment.amount), formatDate(payment.paymentDate), userName(payment.createdBy)];
        })
      ]
    },
    {
      name: "Долги",
      rows: [
        ["Ученик", "Филиал", "Месяц", "Сумма", "Родитель", "Телефон"],
        ...visibleDebts.map((debt) => [studentName(debt.studentId), branchName(debt.branchId), formatMonth(debt.month), money(debt.amount), parentForStudent(debt.studentId).name, parentForStudent(debt.studentId).phone])
      ]
    },
    {
      name: "Закрытие",
      rows: [
        ["Филиал", "Начисления", "Оплаты", "Переносы", "Проверка", "Статус"],
        ...currentBranches.map((branch) => {
          const report = closingReport(branch.id, currentMonth);
          const closing = db.monthClosings.find((item) => item.branchId === branch.id && item.month === currentMonth);
          return [
            branch.name,
            money(report.charged),
            money(report.paid),
            money(report.carryover),
            report.blocked ? "нет посещаемости" : "можно закрывать",
            closing?.status === "CLOSED" ? "Закрыт" : "Открыт"
          ];
        })
      ]
    },
    {
      name: "Статистика",
      rows: [
        ["Показатель", "Значение"],
        ["Филиалов", activeBranches().length],
        ["Тренировок", currentTrainings.length],
        ["План дохода", isOwner() ? money(stats().charged) : "скрыто"],
        ["Факт дохода", isOwner() ? money(stats().paid) : "скрыто"],
        ["Посещаемость", `${stats().attendance.percent}%`],
        ["Оплата тренеров", money(trainerPayroll(currentTrainings))]
      ]
    },
    {
      name: "Сообщения",
      rows: [
        ["Тип", "Ученик", "Сообщение"],
        ...visibleStudents().filter((student) => student.status === "TRIAL").map((student) => ["После пробной", studentName(student.id), trialMessage(student.id)]),
        ...visibleDebts.map((debt) => ["Долг", studentName(debt.studentId), debtMessage(debt.id)])
      ]
    }
  ];

  if (isOwner()) {
    sheets.push(
      {
        name: "Архив",
        rows: [
          ["Тип", "Название", "Дата"],
          ...visibleArchiveStudents.map((student) => ["Ученик", studentName(student.id), formatDateTime(student.archivedAt)]),
          ...visibleArchiveBranches.map((branch) => ["Филиал", branch.name, formatDateTime(branch.archivedAt)])
        ]
      },
      {
        name: "Удаленные",
        rows: [
          ["Тип", "Название", "Дата удаления", "Кто удалил"],
          ...db.deleted.map((item) => [item.type, item.title, formatDateTime(item.deletedAt), userName(item.deletedBy)])
        ]
      },
      {
        name: "Журнал",
        rows: [
          ["Дата", "Пользователь", "Действие", "Объект"],
          ...db.auditLog.map((log) => [formatDateTime(log.at), userName(log.userId), log.action, log.entity])
        ]
      }
    );
  }

  currentBranches.forEach((branch) => {
    sheets.push({
      name: `Посещ. ${branch.name}`,
      rows: buildAttendanceSheetRows(currentMonth, branch.id)
    });
  });

  return sheets;
}

function buildAttendanceSheetRows(month, branchId) {
  if (!branchId) return [["Нет данных"]];
  const trainings = db.trainings
    .filter((training) => !training.deletedAt && !training.archivedAt && training.branchId === branchId && training.month === month)
    .sort((a, b) => `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`));
  const students = db.students
    .filter((student) => !student.deletedAt && !student.archivedAt && student.status !== "INACTIVE")
    .filter((student) => activeEnrollments(student.id).some((enrollment) => enrollment.branchId === branchId))
    .sort((a, b) => studentName(a.id).localeCompare(studentName(b.id), "ru"));

  if (!trainings.length) {
    return [["Ученик", "Нет тренировок на этот месяц"]];
  }

  const price = db.settings.pricePerTraining || 0;
  const summaryColumns = [
    { label: "Посетил", style: "summaryBlue" },
    { label: "План тренировок", style: "summaryBlue" },
    { label: "Остаток", style: "summaryBlue" },
    { label: "Перенос с", style: "summaryCyan" },
    { label: `К оплате за ${formatMonth(month)}`, style: "summaryGreen" },
    { label: "Ставка", style: "summaryGreen" },
    { label: "Сумма к оплате", style: "summaryGreen" },
    { label: "Оплатил", style: "summaryYellow" },
    { label: "На счету", style: "summaryOrange" },
    { label: "остаток", style: "summaryOrange" }
  ];

  const rows = [];
  rows.push([
    { value: "№ п/п", style: "headBeige", mergeDown: 1 },
    { value: "ФИО", style: "headBeige", mergeDown: 1 },
    { value: `Дата проведения тренировок ${formatMonth(month)}`, style: "title", mergeAcross: trainings.length - 1 },
    ...summaryColumns.map((column) => ({ value: column.label, style: column.style, mergeDown: 1 }))
  ]);

  rows.push([
    { value: "", style: "headBeige" },
    { value: "", style: "headBeige" },
    ...trainings.map((training) => {
      const day = Number(String(training.date).slice(8, 10));
      const weekday = weekdayName(new Date(`${training.date}T12:00:00`).getDay()).toLowerCase();
      return { value: `${day}${weekday}\n${training.startTime}`, style: "headBeige" };
    })
  ]);

  const studentRows = students.map((student, index) => {
    const attendanceMarks = trainings.map((training) => {
      const mark = db.attendance.find((item) => item.trainingId === training.id && item.studentId === student.id)?.mark || "";
      return { value: mark ? 1 : "", type: mark ? "Number" : "String", style: "attendMark" };
    });
    const visited = attendanceMarks.filter((cell) => cell.value === 1).length;
    const plan = trainings.length;
    const rest = Math.max(plan - visited, 0);
    const branchCreditAmount = branchCredits(branchId, month).filter((credit) => credit.studentId === student.id).reduce((sum, credit) => sum + credit.remainingAmount, 0);
    const attendedAmount = visited * price;
    const carryoverApplied = Math.min(branchCreditAmount, attendedAmount);
    const carryoverCount = price > 0 ? Math.round(carryoverApplied / price) : 0;
    const carryoverRemainder = Math.max(branchCreditAmount - carryoverApplied, 0);
    const payableAmount = Math.max(attendedAmount - branchCreditAmount, 0);
    const payableCount = price > 0 ? Math.max(Math.round(payableAmount / price), 0) : 0;
    const studentCharges = db.charges.filter((charge) => charge.studentId === student.id && !charge.deletedAt && charge.isConfirmed && charge.month === month);
    const paid = studentCharges.reduce((sum, charge) => sum + chargePaid(charge.id), 0);
    const finalBalance = Math.max(payableAmount - paid, 0);
    return [
      { value: index + 1, type: "Number", style: "rowIndex" },
      { value: studentName(student.id), style: "rowText" },
      ...attendanceMarks,
      { value: visited, type: "Number", style: "summaryBlue" },
      { value: plan, type: "Number", style: "summaryBlue" },
      { value: rest, type: "Number", style: "summaryBlue" },
      { value: carryoverCount, type: "Number", style: "summaryCyan" },
      { value: payableCount, type: "Number", style: "summaryGreen" },
      { value: price, type: "Number", style: "summaryGreen" },
      { value: payableAmount, type: "Number", style: "summaryGreen" },
      { value: paid, type: "Number", style: "summaryYellow" },
      { value: carryoverRemainder, type: "Number", style: "summaryOrange" },
      { value: finalBalance, type: "Number", style: "summaryOrange" }
    ];
  });

  const perTrainingTotals = trainings.map((training) => ({
    value: db.attendance.filter((item) => item.trainingId === training.id && ["PRESENT", "TRIAL"].includes(item.mark)).length,
    type: "Number",
    style: "summaryYellow"
  }));
  const visitedTotal = studentRows.reduce((sum, row) => sum + Number(row[trainings.length + 2]?.value || 0), 0);
  const planTotal = students.length * trainings.length;
  const restTotal = Math.max(planTotal - visitedTotal, 0);
  const carryTotal = studentRows.reduce((sum, row) => sum + Number(row[trainings.length + 5]?.value || 0), 0);
  const payCountTotal = studentRows.reduce((sum, row) => sum + Number(row[trainings.length + 6]?.value || 0), 0);
  const baseTotal = studentRows.reduce((sum, row) => sum + Number(row[trainings.length + 8]?.value || 0), 0);
  const paidTotal = studentRows.reduce((sum, row) => sum + Number(row[trainings.length + 9]?.value || 0), 0);
  const creditTotal = studentRows.reduce((sum, row) => sum + Number(row[trainings.length + 10]?.value || 0), 0);
  const balanceTotal = studentRows.reduce((sum, row) => sum + Number(row[trainings.length + 11]?.value || 0), 0);

  rows.push(...studentRows);
  rows.push([
    { value: "ИТОГО", style: "headBeige" },
    { value: "", style: "headBeige" },
    ...perTrainingTotals,
    { value: visitedTotal, type: "Number", style: "summaryBlue" },
    { value: planTotal, type: "Number", style: "summaryBlue" },
    { value: restTotal, type: "Number", style: "summaryBlue" },
    { value: carryTotal, type: "Number", style: "summaryCyan" },
    { value: payCountTotal, type: "Number", style: "summaryGreen" },
    { value: price, type: "Number", style: "summaryGreen" },
    { value: baseTotal, type: "Number", style: "summaryGreen" },
    { value: paidTotal, type: "Number", style: "summaryYellow" },
    { value: creditTotal, type: "Number", style: "summaryOrange" },
    { value: balanceTotal, type: "Number", style: "summaryOrange" }
  ]);
  return rows;
}

function audit(action, entity) {
  db.auditLog.unshift({ id: id("log"), at: nowText(), userId: currentUser().id, action, entity });
}

function setView(view) {
  if (!canSeeView(view)) {
    toast("Нет доступа к разделу");
    return;
  }
  db.activeView = view;
  saveData();
  render();
}

function canSeeView(view) {
  if (view === "groups") return false;
  const ownerOnly = ["payments", "finance", "debts", "closing", "settings", "deleted", "audit"];
  if (ownerOnly.includes(view) && !isOwner()) return false;
  if (view === "settings" && !isOwner()) return false;
  return true;
}

function visibleStudents(includeArchived = false) {
  const groupIds = activeGroups().map((group) => group.id);
  const branchIds = activeBranches().map((branch) => branch.id);
  const query = db.query.trim().toLowerCase();

  return db.students.filter((student) => {
    if (student.deletedAt) return false;
    if (!includeArchived && student.archivedAt) return false;
    const enrollments = activeEnrollments(student.id);
    const hasAccess = enrollments.some((enrollment) => groupIds.includes(enrollment.groupId) && branchIds.includes(enrollment.branchId));
    const matchesBranch = db.filters.branchId === "all" || enrollments.some((enrollment) => enrollment.branchId === db.filters.branchId);
    const parent = parentForStudent(student.id);
    const haystack = [student.firstName, student.lastName, parent.name, parent.phone, student.note, branchName(enrollments[0]?.branchId)].join(" ").toLowerCase();
    return hasAccess && matchesBranch && (!query || haystack.includes(query));
  });
}

function activeEnrollments(studentId) {
  return db.enrollments.filter((enrollment) => enrollment.studentId === studentId && !enrollment.endsAt);
}

function groupStudents(groupId, options = {}) {
  return db.students.filter((student) => {
    if (student.deletedAt || student.archivedAt) return false;
    if (!options.includeInactive && student.status === "INACTIVE") return false;
    return activeEnrollments(student.id).some((enrollment) => enrollment.groupId === groupId);
  });
}

function visibleTrainings() {
  const groupIds = activeGroups().map((group) => group.id);
  return db.trainings
    .filter((training) => !training.deletedAt && !training.archivedAt && groupIds.includes(training.groupId))
    .filter((training) => db.filters.branchId === "all" || training.branchId === db.filters.branchId)
    .filter((training) => training.month === db.filters.month)
    .sort((a, b) => `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`));
}

function chargePaid(chargeId) {
  return db.allocations
    .filter((allocation) => allocation.chargeId === chargeId)
    .filter((allocation) => !byId(db.payments, allocation.paymentId)?.deletedAt)
    .reduce((sum, allocation) => sum + allocation.allocatedAmount, 0);
}

function updateChargeStatuses() {
  db.charges.forEach((charge) => {
    if (charge.deletedAt) return;
    const paid = chargePaid(charge.id);
    if (paid >= charge.finalAmount) charge.status = "PAID";
    else if (paid > 0) charge.status = "PARTIAL";
    else charge.status = charge.isConfirmed ? "AWAITING" : "DRAFT";
  });
}

function stats() {
  updateChargeStatuses();
  const students = visibleStudents();
  const active = students.filter((student) => student.status === "ACTIVE").length;
  const trial = students.filter((student) => student.status === "TRIAL").length;
  const trainings = visibleTrainings();
  const doneTrainings = trainings.filter((training) => effectiveTrainingStatus(training) === "DONE");
  const confirmedCharges = db.charges.filter((charge) => !charge.deletedAt && charge.isConfirmed && hasBranchAccess(charge.branchId));
  const payments = db.payments.filter((payment) => !payment.deletedAt);
  const charged = confirmedCharges.reduce((sum, charge) => sum + charge.finalAmount, 0);
  const paid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const debt = db.debts.filter((debtItem) => !debtItem.closedAt && hasBranchAccess(debtItem.branchId)).reduce((sum, debtItem) => sum + debtItem.amount, 0);
  const attendance = attendanceStats(trainings);
  return { students, active, trial, trainings, doneTrainings, confirmedCharges, payments, charged, paid, debt, attendance };
}

function hasBranchAccess(branchId) {
  return activeBranches().some((branch) => branch.id === branchId);
}

function effectiveTrainingStatus(training) {
  if (training.status === "CANCELLED" || training.status === "MOVED") return training.status;
  if (db.attendance.some((item) => item.trainingId === training.id && item.mark)) return "DONE";
  if (training.status === "DONE") return "NOT_HELD";
  if (`${training.date} ${training.endTime}` < `${TODAY} 00:00`) return "NOT_HELD";
  return training.status;
}

function hasTrainingMarks(trainingId) {
  return db.attendance.some((item) => item.trainingId === trainingId);
}

function attendanceStats(trainings) {
  let possible = 0;
  let visited = 0;
  trainings.forEach((training) => {
    if (effectiveTrainingStatus(training) !== "DONE") return;
    const students = groupStudents(training.groupId, { includeInactive: false })
      .filter((student) => student.joinedAt <= training.date);
    possible += students.length;
    visited += db.attendance.filter((item) => item.trainingId === training.id && ["PRESENT", "TRIAL"].includes(item.mark)).length;
  });
  return { possible, visited, percent: possible ? Math.round((visited / possible) * 100) : 0 };
}

function card(label, value, hint = "") {
  return `<article class="metric"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong><small>${escapeHtml(hint)}</small></article>`;
}

function statusPill(label, type = "neutral") {
  return `<span class="status ${escapeHtml(type)}">${escapeHtml(label)}</span>`;
}

function actionButton(label, action, idValue, type = "ghost-btn") {
  return `<button class="${escapeHtml(type)}" type="button" data-action="${escapeHtml(action)}" data-id="${escapeHtml(idValue)}">${escapeHtml(label)}</button>`;
}

function selectOptions(items, value, labelFn = (item) => item.name) {
  return items.map((item) => `<option value="${escapeHtml(item.id)}" ${item.id === value ? "selected" : ""}>${escapeHtml(labelFn(item))}</option>`).join("");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function cleanText(value, maxLength = 200) {
  return String(value || "").replace(/[<>]/g, "").trim().slice(0, maxLength);
}

function render() {
  updateChargeStatuses();
  const sectionEyebrow = document.getElementById("sectionEyebrow");
  if (sectionEyebrow) sectionEyebrow.textContent = `Сегодня, ${formatDate(TODAY)}`;
  if (!isLoggedIn()) {
    navList.innerHTML = "";
    pageTitle.textContent = "Вход";
    document.getElementById("welcomePanel").hidden = true;
    renderAccountPanel();
    root.innerHTML = viewLogin();
    bindView();
    return;
  }
  if (!AVAILABLE_MONTHS.includes(db.filters.month)) {
    db.filters.month = CURRENT_MONTH;
    saveData();
  }
  if (db.activeView === "groups") {
    db.activeView = "branches";
    saveData();
  }
  if (db.activeView === "archive") {
    db.activeView = "today";
    saveData();
  }
  if (db.filters.groupId !== "all") {
    db.filters.groupId = "all";
    saveData();
  }
  if (!db.trainingFilters) db.trainingFilters = { branchId: "all", month: CURRENT_MONTH };
  if (!db.coachFilters) db.coachFilters = { branchId: "all", month: CURRENT_MONTH };
  if (!db.financeFilters) db.financeFilters = { branchId: "all", month: CURRENT_MONTH };
  if (!db.paymentFilters) db.paymentFilters = { branchId: "all", month: CURRENT_MONTH };
  if (!db.messageFilters) db.messageFilters = { branchId: "all", month: CURRENT_MONTH };
  if (!["general", "schedule", "users"].includes(db.settingsTab)) db.settingsTab = "general";
  if (!db.messageFilters.month || !AVAILABLE_MONTHS.includes(db.messageFilters.month)) db.messageFilters.month = CURRENT_MONTH;
  if (!AVAILABLE_MONTHS.includes(db.trainingFilters.month)) db.trainingFilters.month = CURRENT_MONTH;
  if (!AVAILABLE_MONTHS.includes(db.coachFilters.month)) db.coachFilters.month = CURRENT_MONTH;
  if (!AVAILABLE_MONTHS.includes(db.financeFilters.month)) db.financeFilters.month = CURRENT_MONTH;
  if (!AVAILABLE_MONTHS.includes(db.paymentFilters.month)) db.paymentFilters.month = CURRENT_MONTH;
  const trainingBranches = activeBranches().map((branch) => branch.id);
  if (db.trainingFilters.branchId !== "all" && !trainingBranches.includes(db.trainingFilters.branchId)) db.trainingFilters.branchId = trainingBranches[0] || "all";
  if (db.coachFilters.branchId !== "all" && !trainingBranches.includes(db.coachFilters.branchId)) db.coachFilters.branchId = trainingBranches[0] || "all";
  if (db.financeFilters.branchId !== "all" && !trainingBranches.includes(db.financeFilters.branchId)) db.financeFilters.branchId = trainingBranches[0] || "all";
  if (db.paymentFilters.branchId !== "all" && !trainingBranches.includes(db.paymentFilters.branchId)) db.paymentFilters.branchId = trainingBranches[0] || "all";
  if (db.messageFilters.branchId !== "all" && !trainingBranches.includes(db.messageFilters.branchId)) db.messageFilters.branchId = trainingBranches[0] || "all";
  if (!AVAILABLE_MONTHS.includes(db.excelMonth)) {
    db.excelMonth = db.filters.month;
    saveData();
  }
  const availableExcelBranchIds = activeBranches().map((branch) => branch.id);
  if (!availableExcelBranchIds.includes(db.excelBranchId)) {
    db.excelBranchId = availableExcelBranchIds[0] || db.filters.branchId || "all";
    saveData();
  }
  renderNav();
  const current = navItems.find(([idValue]) => idValue === db.activeView);
  pageTitle.textContent = db.activeView === "excel" ? "Excel" : current?.[2] || "Атака CRM";
  document.getElementById("welcomePanel").hidden = db.activeView !== "today";
  renderAccountPanel();
  if (globalSearch) globalSearch.value = db.query;

  const map = {
    today: viewToday,
    coach: viewCoachMode,
    students: viewStudents,
    branches: viewBranches,
    groups: viewGroups,
    trainings: viewTrainings,
    excel: viewExcel,
    finance: viewFinance,
    payments: viewPayments,
    debts: viewDebts,
    closing: viewClosing,
    reports: viewReports,
    messages: viewMessages,
    settings: viewSettings,
    archive: viewArchive,
    deleted: viewDeleted,
    audit: viewAudit
  };

  root.innerHTML = map[db.activeView]?.() || "";
  bindView();
}

function renderNav() {
  navList.innerHTML = navItems
    .filter(([view]) => view !== "audit" && canSeeView(view))
    .map(([view, icon, label]) => `
      <button class="nav-item ${db.activeView === view ? "active" : ""}" type="button" data-view="${view}">
        <span class="nav-icon">${icon}</span>${label}
      </button>`
    ).join("") + `<button class="nav-item nav-tool ${db.activeView === "excel" ? "active" : ""}" type="button" data-view="excel"><span class="nav-icon">⌗</span>Excel</button>`;
}

function setMobileNav(open) {
  document.body.classList.toggle("mobile-nav-open", open);
}

function roleHintText() {
  if (currentUser().role === "owner") return "Полный доступ: пользователи, настройки, финансы, архив и удаление.";
  return "Видит только свои филиалы и тренировки. Финансы и настройки скрыты.";
}

function renderAccountPanel() {
  if (!accountPanel) return;
  if (!isLoggedIn()) {
    accountPanel.innerHTML = `
      <strong>Вход сотрудника</strong>
      <p>Введите логин и пароль, которые выдал владелец.</p>
    `;
    return;
  }
  const user = currentUser();
  accountPanel.innerHTML = `
    <strong>${escapeHtml(user.name)}</strong>
    <span class="account-role">${user.role === "owner" ? "Владелец" : "Тренер"}</span>
    <p>${roleHintText()}</p>
    <button class="ghost-btn account-logout" type="button" data-action="logout" data-id="${user.id}">Выйти</button>
  `;
  accountPanel.querySelector("[data-action='logout']")?.addEventListener("click", () => logoutUser());
}

function viewLogin() {
  const onlineMode = window.AtakaRemote?.isReady?.();
  return `
    <section class="panel login-panel">
      <div class="panel-head">
        <div>
          <p class="eyebrow">Доступ к CRM</p>
          <h2>Вход сотрудника</h2>
          <p>${onlineMode ? "Онлайн-режим включен: каждый сотрудник входит через свой логин и пароль." : "Каждый сотрудник входит под своим логином. Роль и филиалы задаёт владелец в настройках."}</p>
        </div>
      </div>
      <form id="loginForm" class="login-form">
        <label>Логин<input name="login" autocomplete="username" placeholder="Например: trener1" required></label>
        <label>Пароль<input name="password" type="password" autocomplete="current-password" required></label>
        <button class="primary-btn" type="submit">Войти</button>
      </form>
      <p class="muted">${onlineMode ? "Логин и пароль выдаёт владелец." : "Логин и пароль выдаёт владелец. Пароли на странице входа больше не показываются."}</p>
    </section>
  `;
}

async function loginUser(login, password) {
  const normalizedLogin = normalizeLogin(login);
  const normalizedPassword = String(password || "").trim();
  if (!isValidLoginAlias(normalizedLogin)) {
    toast("Логин: латинские буквы, цифры, точка, дефис или _");
    return;
  }
  if (window.AtakaRemote?.isReady?.()) {
    const supabaseEmail = loginToSupabaseEmail(normalizedLogin);
    const remoteUser = await window.AtakaRemote.signIn(supabaseEmail, normalizedPassword);
    if (!remoteUser) {
      toast("Неверный логин или пароль");
      return;
    }
    const hadRemoteData = await loadRemoteStateAfterSignIn(normalizedLogin);
    let user = db.users.find((item) => loginMatchesUser(item, normalizedLogin, supabaseEmail) && !item.deletedAt);
    if (!user && !hadRemoteData) {
      user = db.users.find((item) => item.role === "owner" && !item.deletedAt) || db.users[0];
    }
    if (!user) {
      await window.AtakaRemote.signOut();
      toast("Логин есть в Supabase, но не добавлен в пользователи CRM");
      return;
    }
    if (user.login !== normalizedLogin && user.role === "owner") user.login = normalizedLogin;
    createLocalSession(user.id, normalizedLogin);
    if (!canSeeView(db.activeView)) db.activeView = "today";
    saveData("Вход выполнен через общую базу");
    startRemoteRefresh();
    render();
    return;
  }

  db.security ||= { loginFailures: {} };
  db.security.loginFailures ||= {};
  const failure = db.security.loginFailures[normalizedLogin];
  if (failure?.lockedUntil && failure.lockedUntil > Date.now()) {
    toast("Слишком много попыток. Попробуйте позже.");
    return;
  }
  const user = db.users.find((item) => loginMatchesUser(item, normalizedLogin) && !item.deletedAt);
  if (!user || !(await verifyUserPassword(user, normalizedPassword))) {
    const nextFailure = db.security.loginFailures[normalizedLogin] || { count: 0, lockedUntil: 0 };
    nextFailure.count += 1;
    if (nextFailure.count >= MAX_LOGIN_ATTEMPTS) {
      nextFailure.lockedUntil = Date.now() + LOGIN_LOCK_MS;
      nextFailure.count = 0;
    }
    db.security.loginFailures[normalizedLogin] = nextFailure;
    saveData();
    toast("Неверный логин или пароль");
    return;
  }
  delete db.security.loginFailures[normalizedLogin];
  createLocalSession(user.id, normalizedLogin);
  if (!canSeeView(db.activeView)) db.activeView = "today";
  saveData("Вход выполнен");
  render();
}

function logoutUser() {
  const token = localStorage.getItem(SESSION_KEY);
  if (token && db.security?.sessions) delete db.security.sessions[token];
  if (remoteRefreshTimer) {
    clearInterval(remoteRefreshTimer);
    remoteRefreshTimer = null;
  }
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_LOGIN_KEY);
  window.AtakaRemote?.signOut?.();
  saveData();
  render();
}

function applyRemoteState(state) {
  if (!state || !Object.keys(state).length) return false;
  const ui = localUiState();
  const before = sharedStateSignature();
  db = { ...clone(defaultData), ...state };
  restoreLocalUi(db, ui);
  db.security ||= { loginFailures: {}, sessions: {} };
  syncBranchNames();
  syncRealRoster();
  syncRealSchedule();
  syncAssistantRule();
  if (normalizeChargesToConfirmed()) saveData();
  if (rebuildAbsenceCarryovers()) saveData();
  normalizeOwnerRole();
  normalizeUserAccounts();
  if (normalizeTrainerAssignments()) saveData();
  sanitizeStoredData();
  return before !== sharedStateSignature();
}

async function loadRemoteStateAfterSignIn(login = "", options = {}) {
  if (!window.AtakaRemote?.isReady?.() || !window.AtakaRemote?.isSignedIn?.()) return false;
  remoteBootstrapping = true;
  try {
    await window.AtakaRemote.refreshSession?.();
    const remoteState = await window.AtakaRemote.loadState();
    const hasRemote = Boolean(remoteState && Object.keys(remoteState).length);
    const changed = applyRemoteState(remoteState);
    if (!hasRemote) {
      const owner = db.users.find((user) => user.role === "owner" && !user.deletedAt);
      if (owner && login) owner.login = login;
      window.AtakaRemote.saveState(remoteSafeData(db));
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    return options.returnChanged ? changed : hasRemote;
  } catch (error) {
    console.error(error);
    if (!options.silent && !options.allowOffline) toast("Не удалось загрузить общую базу");
    return false;
  } finally {
    remoteBootstrapping = false;
  }
}

function startRemoteRefresh() {
  if (remoteRefreshTimer || !window.AtakaRemote?.isReady?.()) return;
  remoteRefreshTimer = setInterval(async () => {
    if (!window.AtakaRemote?.isSignedIn?.() || remoteBootstrapping) return;
    const changed = await loadRemoteStateAfterSignIn("", { silent: true, returnChanged: true });
    if (changed) render();
  }, 12000);
}

async function initializeApp() {
  if (window.AtakaRemote?.isReady?.() && window.AtakaRemote?.isSignedIn?.()) {
    await loadRemoteStateAfterSignIn("", { allowOffline: true });
    startRemoteRefresh();
  }
  render();
}

function viewToday() {
  const branches = homeBranches();
  const branchIds = branches.map((branch) => branch.id);
  const students = db.students.filter((student) => {
    if (student.deletedAt || student.archivedAt) return false;
    const hasAccess = activeEnrollments(student.id).some((enrollment) => branchIds.includes(enrollment.branchId));
    if (!hasAccess) return false;
    const query = db.query.trim().toLowerCase();
    if (!query) return true;
    const parent = parentForStudent(student.id);
    const haystack = [student.firstName, student.lastName, parent.name, parent.phone, student.note, branchName(activeEnrollments(student.id)[0]?.branchId)].join(" ").toLowerCase();
    return haystack.includes(query);
  });
  const trainings = db.trainings
    .filter((training) => !training.deletedAt && !training.archivedAt && branchIds.includes(training.branchId))
    .sort((a, b) => `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`));
  const todayTrainings = trainings.filter((training) => training.date === TODAY);
  const trialStudents = students.filter((student) => student.status === "TRIAL");
  const activeCount = students.filter((student) => student.status === "ACTIVE").length;
  const attendance = attendanceStats(trainings);
  const confirmedCharges = db.charges.filter((charge) => !charge.deletedAt && charge.isConfirmed && branchIds.includes(charge.branchId));
  const payments = db.payments.filter((payment) => !payment.deletedAt);
  const charged = confirmedCharges.reduce((sum, charge) => sum + charge.finalAmount, 0);
  const paid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const debt = db.debts.filter((item) => !item.closedAt && branchIds.includes(item.branchId)).reduce((sum, item) => sum + item.amount, 0);
  return `
    <div class="grid cols-4">
      ${card("Ученики", students.length, `${activeCount} активных, ${trialStudents.length} пробных`)}
      ${card("Тренировки сегодня", todayTrainings.length, "Открываются одним нажатием")}
      ${card("Посещаемость", `${attendance.percent}%`, `${attendance.visited}/${attendance.possible} отметок`)}
      ${isOwner() ? card("Факт / план", `${money(paid)} / ${money(charged)}`, `Долг: ${money(debt)}`) : card("Ваши филиалы", branches.length, "Только доступ тренера")}
    </div>
    <div class="grid cols-2">
      <section class="panel">
        <div class="panel-head">
          <div><h2>Сегодня</h2><p>Тренер должен открыть занятие и быстро отметить детей.</p></div>
          ${actionButton("Создать месяц", "create-month", CURRENT_MONTH, "primary-btn")}
        </div>
        <div class="attendance-list">
          ${todayTrainings.map(trainingCard).join("") || "<p class='muted'>На сегодня тренировок нет.</p>"}
        </div>
      </section>
      <section class="panel">
        <div class="panel-head">
          <div><h2>Пробные ученики</h2><p>CRM показывает, сколько тренировок прошло после пробной, но не переводит в неактивные без подтвержденного правила.</p></div>
        </div>
        <div class="attendance-list">
          ${trialStudents.map((student) => {
            const after = trainingsAfterTrial(student.id);
            return `<div class="attendance-row">
              <div><strong>${studentName(student.id)}</strong><p>${branchName(activeEnrollments(student.id)[0]?.branchId)} · прошло ${after} из 5</p></div>
              <div class="split-actions">${actionButton("Сообщение", "trial-message", student.id)}${actionButton("Неактивный", "inactive", student.id, "danger-btn")}</div>
            </div>`;
          }).join("") || "<p class='muted'>Нет пробных учеников.</p>"}
        </div>
      </section>
    </div>
    <section class="table-panel">
      <div class="table-toolbar"><h2>Статистика филиалов</h2><span class="chip">автоматический пересчет</span></div>
      ${branchesTable(false, branches)}
    </section>
  `;
}

function trainingCard(training) {
  const status = effectiveTrainingStatus(training);
  const attended = db.attendance.filter((item) => item.trainingId === training.id).length;
  return `<div class="attendance-row">
    <div>
      <strong>${training.startTime} · ${branchName(training.branchId)}</strong>
      <p>${userName(training.trainerId)}${training.assistantConfirmed && training.assistantId ? ` · помощник ${userName(training.assistantId)}` : ""}</p>
    </div>
    <div class="split-actions">
      ${statusPill(labels[status] || status, status === "DONE" ? "paid" : status === "NOT_HELD" || status === "CANCELLED" ? "inactive" : "neutral")}
      <span class="chip">${attended} отметок</span>
      ${actionButton("Открыть", "open-training", training.id, "primary-btn")}
    </div>
  </div>`;
}

function branchChipsForStudent(studentId) {
  const names = [...new Set(activeEnrollments(studentId).map((enrollment) => branchName(enrollment.branchId)))];
  return names.map((name) => `<span class="chip">${name}</span>`).join(" ");
}

function viewStudents() {
  const students = visibleStudents();
  return `
    ${filtersPanel("Ученики", "Карточка хранит родителей, статус, филиал, посещаемость, финансы и историю.")}
    <section class="table-panel">
      <div class="table-toolbar">
        <h2>База учеников</h2>
        <div class="split-actions">${actionButton("+ Ученик", "open-student", "new", "primary-btn")}${actionButton("Сбросить фильтры", "reset-filters", "all")}</div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Ученик</th><th>Статус</th><th>Филиал</th><th>Родитель</th><th>Посещаемость</th><th>Финансы</th><th>Действия</th></tr></thead>
          <tbody>
            ${students.map((student) => {
              const parent = parentForStudent(student.id);
              const st = studentAttendanceSummary(student.id);
              const fin = studentFinance(student.id);
              return `<tr>
                <td><strong>${studentName(student.id)}</strong><br><span class="muted">${2026 - student.birthYear} лет · ${escapeHtml(student.note || "без комментария")}</span></td>
                <td>${studentStatusControl(student)}</td>
                <td>${branchChipsForStudent(student.id)}</td>
                <td>${parent.name}<br><span class="muted">${parent.phone}</span></td>
                <td>${st.visited}/${st.possible} · ${st.percent}%</td>
                <td>${isOwner() ? `К оплате ${money(fin.toPay)}<br><span class="muted">долг ${money(fin.debt)}</span>` : "скрыто"}</td>
                <td><div class="split-actions">${actionButton("Редактировать", "edit-student", student.id, "primary-btn")}${actionButton("×", "delete-student", student.id, "danger-btn icon-danger-btn")}</div></td>
              </tr>`;
            }).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function studentStatusControl(student) {
  return `<select class="inline-select" data-action="status" data-id="${student.id}">
    <option value="TRIAL" ${student.status === "TRIAL" ? "selected" : ""}>Пробный</option>
    <option value="ACTIVE" ${student.status === "ACTIVE" ? "selected" : ""}>Активный</option>
    <option value="INACTIVE" ${student.status === "INACTIVE" ? "selected" : ""}>Неактивный</option>
  </select>`;
}

function filtersPanel(title, text) {
  return `<section class="panel">
    <div class="panel-head">
      <div><h2>${title}</h2><p>${text}</p></div>
    </div>
    <div class="filters">
      <select id="branchFilter"><option value="all">Все филиалы</option>${activeBranches().map((branch) => `<option value="${escapeHtml(branch.id)}" ${db.filters.branchId === branch.id ? "selected" : ""}>${escapeHtml(branch.name)}</option>`).join("")}</select>
      <select id="monthFilter">${AVAILABLE_MONTHS.map((month) => `<option value="${month}" ${db.filters.month === month ? "selected" : ""}>${formatMonth(month)}</option>`).join("")}</select>
    </div>
  </section>`;
}

function studentAttendanceSummary(studentId) {
  const enrollments = activeEnrollments(studentId);
  const trainings = db.trainings.filter((training) => !training.deletedAt && enrollments.some((enrollment) => enrollment.groupId === training.groupId && enrollment.startsAt <= training.date) && effectiveTrainingStatus(training) === "DONE");
  const possible = trainings.length;
  const visited = trainings.filter((training) => db.attendance.some((item) => item.trainingId === training.id && item.studentId === studentId && ["PRESENT", "TRIAL"].includes(item.mark))).length;
  return { possible, visited, percent: possible ? Math.round((visited / possible) * 100) : 0 };
}

function studentFinance(studentId) {
  const charges = db.charges.filter((charge) => charge.studentId === studentId && !charge.deletedAt && charge.isConfirmed);
  const toPay = charges.reduce((sum, charge) => sum + Math.max(charge.finalAmount - chargePaid(charge.id), 0), 0);
  const debt = db.debts.filter((item) => item.studentId === studentId && !item.closedAt).reduce((sum, item) => sum + item.amount, 0);
  const credit = db.credits.filter((item) => item.studentId === studentId).reduce((sum, item) => sum + item.remainingAmount, 0);
  return { toPay, debt, credit };
}

function viewBranches() {
  const branches = activeBranches();
  const selected = branches.find((branch) => branch.id === db.selectedBranchId) || branches[0];
  if (selected && db.selectedBranchId !== selected.id) db.selectedBranchId = selected.id;
  return `
    <section class="table-panel">
      <div class="table-toolbar"><h2>Филиалы</h2>${isOwner() ? actionButton("+ Филиал", "add-branch", "new", "primary-btn") : ""}</div>
      ${branchesTable(true, branches)}
    </section>
    ${selected ? branchDetailsPanel(selected) : ""}
  `;
}

function branchesTable(withActions = false, branches = activeBranches()) {
  const rows = branches.map((branch) => {
    const branchStudents = db.students.filter((student) => activeEnrollments(student.id).some((enrollment) => enrollment.branchId === branch.id) && !student.deletedAt && !student.archivedAt);
    const branchCharges = db.charges.filter((charge) => charge.branchId === branch.id && charge.isConfirmed && !charge.deletedAt);
    const branchPaid = branchCharges.reduce((sum, charge) => sum + chargePaid(charge.id), 0);
    const branchTrainings = db.trainings.filter((training) => training.branchId === branch.id && !training.deletedAt);
    const attendance = attendanceStats(branchTrainings);
    return `<tr>
      <td><button class="link-button" type="button" data-action="${withActions ? "select-branch" : "filter-branch"}" data-id="${escapeHtml(branch.id)}"><strong>${escapeHtml(branch.name)}</strong></button><br><span class="muted">${escapeHtml(branch.address)}</span></td>
      <td>${branchStudents.length}</td>
      <td>${branchTrainings.length}</td>
      <td>${attendance.percent}%</td>
      <td>${isOwner() ? money(branchPaid) : "скрыто"}</td>
      ${withActions ? "" : ""}
    </tr>`;
  }).join("");
  return `<div class="table-wrap"><table><thead><tr><th>Филиал</th><th>Ученики</th><th>Тренировки</th><th>Посещаемость</th><th>Оплаты</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

function branchDetailsPanel(branch) {
  const groupId = ensureRosterGroup(branch.id);
  const group = byId(db.groups, groupId);
  const scheduleMap = branchScheduleMap(branch.id);
  const weekOrder = [1, 2, 3, 4, 5, 6, 0];
  return `
    <section class="panel branch-detail-panel">
      <div class="panel-head">
        <div>
          <p class="eyebrow">Карточка филиала</p>
          <h2>${escapeHtml(branch.name)}</h2>
          <p>${escapeHtml(branch.address || "Адрес не указан")}</p>
        </div>
      </div>
      <form id="branchDetailsForm" data-branch="${escapeHtml(branch.id)}">
        <div class="branch-detail-grid">
          <label>Тренер филиала
            <select name="branchTrainer">${trainerOptions(group?.trainerId || currentUser().id)}</select>
          </label>
        </div>
        <div class="branch-schedule-head">
          <h3>Расписание</h3>
          <span class="muted">Изменяются только последующие тренировки</span>
        </div>
        <div class="schedule-week">
          ${weekOrder.map((day) => {
            const schedule = scheduleMap.get(day);
            return scheduleDayEditor(day, schedule, {
              active: `branchScheduleActive_${day}`,
              start: `branchScheduleStart_${day}`,
              end: `branchScheduleEnd_${day}`
            });
          }).join("")}
        </div>
        <div class="split-actions">
          <button class="primary-btn" type="button" data-action="save-branch-details" data-id="${escapeHtml(branch.id)}">Сохранить филиал</button>
        </div>
      </form>
    </section>
  `;
}

function viewGroups() {
  return `
    <section class="table-panel">
      <div class="table-toolbar"><h2>Группы</h2>${isOwner() ? actionButton("+ Группа", "add-group", "new", "primary-btn") : ""}</div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Группа</th><th>Филиал</th><th>Расписание</th><th>Тренер</th><th>Помощник</th><th>Ученики</th><th>Действия</th></tr></thead>
          <tbody>${activeGroups().map((group) => {
            const schedules = db.schedules.filter((schedule) => schedule.groupId === group.id).map((schedule) => `${weekdayName(schedule.weekday)} ${schedule.startTime}-${schedule.endTime}`).join(", ");
            return `<tr>
              <td><strong>${escapeHtml(group.name)}</strong><br><span class="muted">${escapeHtml(group.ageRange)}</span></td>
              <td>${branchName(group.branchId)}</td>
              <td>${schedules || "Не задано"}</td>
              <td>${userName(group.trainerId)}</td>
              <td>${group.assistantId ? userName(group.assistantId) : "Нет"}</td>
              <td>${groupStudents(group.id, { includeInactive: true }).length}</td>
              <td><div class="split-actions">${actionButton("Ученики", "filter-group", group.id)}${actionButton("Тренировки", "group-trainings", group.id)}</div></td>
            </tr>`;
          }).join("")}</tbody>
        </table>
      </div>
    </section>
  `;
}

function viewTrainings() {
  const filters = trainingPageFilters();
  const branchId = filters.branchId;
  const month = filters.month;
  const trainings = db.trainings
    .filter((training) => !training.deletedAt && !training.archivedAt && training.month === month)
    .filter((training) => branchId === "all" || training.branchId === branchId)
    .sort((a, b) => `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`));
  const selected = trainings.find((training) => training.id === db.selectedTrainingId) || trainings.find((training) => training.date === TODAY) || trainings[0];
  return `
    <section class="panel">
      <div class="panel-head">
        <div><h2>Тренировки</h2><p>В этой странице свои фильтры. Все месяцы доступны сразу, независимо от оплат.</p></div>
      </div>
      <div class="filters">
        <select id="branchFilter">
          <option value="all" ${filters.branchId === "all" ? "selected" : ""}>Все филиалы</option>
          ${activeBranches().map((branch) => `<option value="${escapeHtml(branch.id)}" ${filters.branchId === branch.id ? "selected" : ""}>${escapeHtml(branch.name)}</option>`).join("")}
        </select>
        <select id="monthFilter">
          ${AVAILABLE_MONTHS.map((itemMonth) => `<option value="${itemMonth}" ${filters.month === itemMonth ? "selected" : ""}>${formatMonth(itemMonth)}</option>`).join("")}
        </select>
      </div>
    </section>
    <section class="trainings-stack">
      ${selected ? attendancePanel(selected, trainings, month) : `<section class='panel training-panel'>${calendarDropdown(trainings, selected, month)}<h2>Нет тренировок</h2></section>`}
      <div class="grid cols-3 trainings-metrics">
        ${card("Всего", trainings.length, formatMonth(month))}
        ${card("Проведены", trainings.filter((training) => effectiveTrainingStatus(training) === "DONE").length, "После первой отметки автоматически")}
        ${card("Оплата тренеров", money(trainerPayroll(trainings)), "Только если есть отметки")}
      </div>
      <div class="trainings-month">
        ${monthAttendanceTable(month, branchId)}
      </div>
    </section>
  `;
}

function coachTrainingList(filters) {
  return db.trainings
    .filter((training) => !training.deletedAt && !training.archivedAt && training.month === filters.month)
    .filter((training) => filters.branchId === "all" || training.branchId === filters.branchId)
    .filter((training) => hasBranchAccess(training.branchId))
    .sort((a, b) => `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`));
}

function viewCoachMode() {
  const filters = coachPageFilters();
  const trainings = coachTrainingList(filters);
  const selected = trainings.find((training) => training.id === db.coachSelectedTrainingId) || trainings.find((training) => training.date >= TODAY) || trainings[0];
  if (selected && db.coachSelectedTrainingId !== selected.id) db.coachSelectedTrainingId = selected.id;
  const students = selected ? groupStudents(selected.groupId) : [];
  const attendance = selected ? db.attendance.filter((item) => item.trainingId === selected.id) : [];
  const presentCount = attendance.filter((item) => item.mark === "PRESENT").length;
  const trialCount = attendance.filter((item) => item.mark === "TRIAL").length;

  return `
    <section class="panel coach-hero">
      <div>
        <p class="eyebrow">Мобильный режим</p>
        <h2>Быстрая отметка тренировки</h2>
        <p>Минимум лишнего: выбери тренировку, отметь учеников, добавь пробного или помощника.</p>
      </div>
      <div class="filters coach-filters">
        <select id="branchFilter">
          <option value="all" ${filters.branchId === "all" ? "selected" : ""}>Все филиалы</option>
          ${activeBranches().map((branch) => `<option value="${escapeHtml(branch.id)}" ${filters.branchId === branch.id ? "selected" : ""}>${escapeHtml(branch.name)}</option>`).join("")}
        </select>
        <select id="monthFilter">
          ${AVAILABLE_MONTHS.map((month) => `<option value="${month}" ${filters.month === month ? "selected" : ""}>${formatMonth(month)}</option>`).join("")}
        </select>
      </div>
    </section>

    <section class="coach-layout">
      <div class="panel coach-list-panel">
        <div class="table-toolbar compact">
          <div>
            <h2>Тренировки</h2>
            <p>${formatMonth(filters.month)} · ${trainings.length} шт.</p>
          </div>
        </div>
        <div class="coach-training-list">
          ${trainings.map((training) => {
            const status = effectiveTrainingStatus(training);
            return `<button class="coach-training-card ${selected?.id === training.id ? "active" : ""}" type="button" data-action="select-coach-training" data-id="${training.id}">
              <span>
                <strong>${formatDate(training.date)}</strong>
                <small>${training.startTime}-${training.endTime} · ${branchName(training.branchId)}</small>
              </span>
              ${statusPill(labels[status] || status, status === "DONE" ? "paid" : status === "NOT_HELD" || status === "CANCELLED" ? "inactive" : "neutral")}
            </button>`;
          }).join("") || "<p class='muted'>Тренировок нет.</p>"}
        </div>
      </div>

      ${selected ? `<section class="panel coach-attendance-panel">
        <div class="coach-training-head">
          <div>
            <p class="eyebrow">Выбранная тренировка</p>
            <h2>${formatDate(selected.date)} · ${selected.startTime}-${selected.endTime}</h2>
            <p>${branchName(selected.branchId)} · ${userName(selected.trainerId)}${selected.assistantConfirmed && selected.assistantId ? ` · помощник ${userName(selected.assistantId)}` : ""}</p>
          </div>
          <div class="training-tools">${trainerChangeControl(selected)}<div class="split-actions">${actionButton("+ Пробный", "open-student-training", selected.id, "primary-btn")}${actionButton(selected.assistantConfirmed && selected.assistantId ? `Помощник: ${userName(selected.assistantId)}` : "Был помощник", "toggle-assistant", selected.id)}${actionButton("+ Доп. тренировка", "open-extra-training", selected.id)}${actionButton("×", "delete-coach-training", selected.id, "danger-btn icon-danger-btn")}</div></div>
        </div>
        <div class="training-summary">
          <span><strong>${students.length}</strong> учеников</span>
          <span><strong>${presentCount}</strong> был</span>
          <span><strong>${trialCount}</strong> пробная</span>
          <span><strong>${Math.max(students.length - attendance.length, 0)}</strong> пусто</span>
        </div>
        <div class="coach-attendance-list">
          ${students.map((student) => {
            const mark = attendance.find((item) => item.studentId === student.id)?.mark || "";
            return `<div class="coach-student-row">
              <div class="attendance-person"><strong>${studentName(student.id)}</strong><span>${escapeHtml(labels[student.status])} · ${escapeHtml(parentForStudent(student.id).phone)}</span></div>
              <button class="single-mark ${mark ? "active" : ""} ${mark === "TRIAL" ? "trial" : ""}" type="button" data-training="${selected.id}" data-student="${student.id}">
                ${mark === "PRESENT" ? "Был" : mark === "TRIAL" ? "Пробная" : "Отметить"}
              </button>
            </div>`;
          }).join("") || "<p class='muted'>В группе нет учеников.</p>"}
        </div>
      </section>` : `<section class="panel"><h2>Выберите тренировку</h2><p>После выбора здесь появится список учеников.</p></section>`}
    </section>
  `;
}

function viewExcel() {
  const branches = activeBranches();
  const branchInfo = branches.map((branch) => {
    const months = AVAILABLE_MONTHS.filter((month) => monthHasBranchData(branch.id, month));
    return { branch, months };
  });

  return `
    <section class="panel excel-hero">
      <div>
        <p class="eyebrow">Excel</p>
        <h2>Скачивай файл каждого филиала отдельно</h2>
        <p>Внутри одного файла у филиала будут вкладки только с заполненными месяцами.</p>
      </div>
    </section>

    <section class="panel excel-page">
      <div class="table-toolbar">
        <div>
          <h2>Файлы филиалов</h2>
          <p>Нажми на филиал, чтобы скачать один файл с месячными вкладками внутри.</p>
        </div>
      </div>
      <div class="excel-grid">
        ${branchInfo.map(({ branch, months }) => `
          <article class="excel-card">
            <div>
              <strong>${escapeHtml(branch.name)}</strong>
              <span>${months.length ? months.map((month) => formatMonth(month)).join(" · ") : "Нет заполненных месяцев"}</span>
            </div>
            <button class="primary-btn" type="button" data-action="download-branch-workbook" data-id="${branch.id}">Скачать файл</button>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function calendarDropdown(trainings, selected, month) {
  return `<section class="calendar-dropdown">
    <div class="calendar-dropdown-head">
      <button class="calendar-toggle" type="button" data-action="toggle-calendar" data-id="calendar">
        <span>
          <strong>Календарь тренировок</strong>
          <small>${selected ? `${formatDate(selected.date)} · ${selected.startTime}-${selected.endTime} · ${branchName(selected.branchId)}` : `${formatMonth(month)} · ${trainings.length} тренировок`}</small>
        </span>
        <span class="calendar-arrow">
          <span>${db.showCalendar ? "Скрыть" : "Открыть"}</span>
          <strong>${db.showCalendar ? "▲" : "▼"}</strong>
        </span>
      </button>
      <div class="split-actions">${isOwner() ? actionButton("Создать месяц", "create-month", month, "primary-btn") : ""}</div>
    </div>
    ${db.showCalendar ? `<div class="calendar-scroll">
      ${trainings.map((training) => {
        const active = selected?.id === training.id;
        const status = effectiveTrainingStatus(training);
        return `<button class="calendar-item ${active ? "active" : ""}" type="button" data-action="select-training" data-id="${training.id}">
          <span>
            <strong>${formatDate(training.date)}</strong>
            <small>${training.startTime}-${training.endTime} · ${branchName(training.branchId)}</small>
          </span>
          ${statusPill(labels[status], status === "DONE" ? "paid" : status === "NOT_HELD" || status === "CANCELLED" ? "inactive" : "neutral")}
        </button>`;
      }).join("") || "<p class='muted'>Тренировок в этом месяце нет.</p>"}
    </div>` : ""}
  </section>`;
}

function trainingPicker(selected, trainings) {
  if (!trainings.length) return "";
  return `<section class="training-picker">
    <button class="training-picker-main" type="button" data-action="toggle-training-picker" data-id="picker">
      <span>
        <strong>${selected ? `${formatDate(selected.date)} · ${selected.startTime}-${selected.endTime}` : "Выберите тренировку"}</strong>
        <small>${selected ? branchName(selected.branchId) : "Нажмите, чтобы открыть список"}</small>
      </span>
      <span class="picker-chevron">${db.showTrainingPicker ? "▲" : "▼"}</span>
    </button>
    ${db.showTrainingPicker ? `<div class="training-picker-list">
      ${trainings.map((training) => `<button class="${selected?.id === training.id ? "active" : ""}" type="button" data-action="select-training" data-id="${training.id}">
        <strong>${formatDate(training.date)}</strong>
        <span>${training.startTime}-${training.endTime} · ${branchName(training.branchId)}</span>
      </button>`).join("")}
    </div>` : ""}
  </section>`;
}

function monthAttendanceTable(month, branchId = db.filters.branchId, options = {}) {
  const compact = Boolean(options.compact);
  if (branchId === "all") {
    return `<section class="panel">
      <h2>Таблица посещаемости за месяц</h2>
      <p>Выберите филиал в фильтре выше, чтобы открыть полную таблицу посещаемости на ${formatMonth(month)}.</p>
    </section>`;
  }

  const trainings = db.trainings
    .filter((training) => !training.deletedAt && !training.archivedAt && training.branchId === branchId && training.month === month)
    .sort((a, b) => `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`));
  const students = db.students
    .filter((student) => !student.deletedAt && !student.archivedAt && student.status !== "INACTIVE")
    .filter((student) => activeEnrollments(student.id).some((enrollment) => enrollment.branchId === branchId))
    .sort((a, b) => studentName(a.id).localeCompare(studentName(b.id), "ru"));

  if (!trainings.length) {
    return `<section class="panel"><h2>Таблица посещаемости за месяц</h2><p>Для филиала «${branchName(branchId)}» нет тренировок на ${formatMonth(month)}.</p></section>`;
  }

  const head = trainings.map((training) => {
    const day = training.date.slice(8, 10);
    const weekday = weekdayName(new Date(`${training.date}T12:00:00`).getDay());
    return `<th><span>${day} ${weekday}</span><br><small>${training.startTime}</small></th>`;
  }).join("");

  const rows = students.map((student) => {
    const cells = trainings.map((training) => {
      const mark = db.attendance.find((item) => item.trainingId === training.id && item.studentId === student.id)?.mark || "";
      const label = mark === "PRESENT" ? "Б" : mark === "TRIAL" ? "П" : "";
      const title = mark === "PRESENT" ? "Был" : mark === "TRIAL" ? "Пробная" : "Пусто";
      return `<td><button class="month-mark ${mark ? "filled" : ""}" type="button" data-training="${training.id}" data-student="${student.id}" title="${title}">${label}</button></td>`;
    }).join("");
    const summary = studentAttendanceSummary(student.id);
    return `<tr>
      <th class="student-sticky"><strong>${studentName(student.id)}</strong><br><small>${summary.visited}/${summary.possible} · ${summary.percent}%</small></th>
      ${cells}
    </tr>`;
  }).join("");

  return `<section class="table-panel month-attendance ${compact ? "compact" : ""}">
    <div class="table-toolbar ${compact ? "compact" : ""}">
      <div>
        <h2>Таблица посещаемости: ${branchName(branchId)}</h2>
        <p>${formatMonth(month)} · нажмите на ячейку, чтобы переключить отметку</p>
      </div>
      ${compact ? "" : `<div class="split-actions"><span class="chip">Б — был</span><span class="chip">П — пробная</span><span class="chip">пусто — не был</span></div>`}
    </div>
    <div class="table-wrap">
      <table class="attendance-month-table">
        <thead><tr><th class="student-sticky">Ученик</th>${head}</tr></thead>
        <tbody>${rows || `<tr><td colspan="${trainings.length + 1}">В филиале нет активных учеников.</td></tr>`}</tbody>
      </table>
    </div>
  </section>`;
}

function trainerPayroll(trainings) {
  return trainings
    .filter((training) => effectiveTrainingStatus(training) === "DONE" && hasTrainingMarks(training.id))
    .reduce((sum, training) => sum + db.settings.trainerRate + (training.assistantConfirmed && training.assistantId ? db.settings.assistantRate : 0), 0);
}

function payrollUsers() {
  return activeCoachUsers();
}

function trainerOptionsForTraining(training) {
  return activeCoachUsers().map((user) => `<option value="${escapeHtml(user.id)}" ${user.id === training.trainerId ? "selected" : ""}>${escapeHtml(user.name)}</option>`).join("");
}

function trainerChangeControl(training) {
  return `<label class="trainer-change">Тренер
    <select data-action="change-trainer" data-id="${training.id}">
      ${trainerOptionsForTraining(training)}
    </select>
  </label>`;
}

function payrollRows(filters) {
  const rows = new Map();
  const source = db.trainings
    .filter((training) => !training.deletedAt && !training.archivedAt)
    .filter((training) => training.month === filters.month)
    .filter((training) => filters.branchId === "all" || training.branchId === filters.branchId)
    .filter((training) => effectiveTrainingStatus(training) === "DONE" && hasTrainingMarks(training.id));

  function ensure(userId) {
    if (!rows.has(userId)) {
      rows.set(userId, {
        userId,
        mainCount: 0,
        assistantCount: 0,
        mainAmount: 0,
        assistantAmount: 0,
        trainings: []
      });
    }
    return rows.get(userId);
  }

  source.forEach((training) => {
    const main = ensure(training.trainerId);
    main.mainCount += 1;
    main.mainAmount += db.settings.trainerRate;
    main.trainings.push(training);

    if (training.assistantConfirmed && training.assistantId) {
      const assistant = ensure(training.assistantId);
      assistant.assistantCount += 1;
      assistant.assistantAmount += db.settings.assistantRate;
      assistant.trainings.push(training);
    }
  });

  return Array.from(rows.values())
    .map((row) => ({ ...row, total: row.mainAmount + row.assistantAmount }))
    .sort((a, b) => b.total - a.total || userName(a.userId).localeCompare(userName(b.userId), "ru"));
}

function financePageFilters() {
  if (!db.financeFilters) db.financeFilters = { branchId: "all", month: CURRENT_MONTH };
  if (!AVAILABLE_MONTHS.includes(db.financeFilters.month)) db.financeFilters.month = CURRENT_MONTH;
  return db.financeFilters;
}

function viewFinance() {
  if (!isOwner()) return denied();
  const filters = financePageFilters();
  const rows = payrollRows(filters);
  const totalMain = rows.reduce((sum, row) => sum + row.mainAmount, 0);
  const totalAssistant = rows.reduce((sum, row) => sum + row.assistantAmount, 0);
  const totalTrainings = rows.reduce((sum, row) => sum + row.mainCount, 0);
  return `
    <section class="panel">
      <div class="panel-head">
        <div><h2>Финансы тренеров</h2><p>Выплата считается только за проведенные тренировки, где есть хотя бы одна отметка.</p></div>
      </div>
      <div class="filters">
        <select id="branchFilter">
          <option value="all" ${filters.branchId === "all" ? "selected" : ""}>Все филиалы</option>
          ${activeBranches().map((branch) => `<option value="${escapeHtml(branch.id)}" ${filters.branchId === branch.id ? "selected" : ""}>${escapeHtml(branch.name)}</option>`).join("")}
        </select>
        <select id="monthFilter">
          ${AVAILABLE_MONTHS.map((month) => `<option value="${month}" ${filters.month === month ? "selected" : ""}>${formatMonth(month)}</option>`).join("")}
        </select>
      </div>
    </section>
    <div class="grid cols-4">
      ${card("К выплате", money(totalMain + totalAssistant), formatMonth(filters.month))}
      ${card("Основные тренеры", money(totalMain), `${totalTrainings} тренировок`)}
      ${card("Помощники", money(totalAssistant), `${rows.reduce((sum, row) => sum + row.assistantCount, 0)} выходов`)}
      ${card("Ставки", `${money(db.settings.trainerRate)} / ${money(db.settings.assistantRate)}`, "тренер / помощник")}
    </div>
    <section class="table-panel">
      <div class="table-toolbar"><h2>Список тренеров</h2><span class="muted">${filters.branchId === "all" ? "Все филиалы" : branchName(filters.branchId)}</span></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Тренер</th><th>Основной</th><th>Помощник</th><th>Сумма</th><th>Тренировки</th></tr></thead>
          <tbody>
            ${rows.map((row) => {
              const detail = row.trainings
                .slice()
                .sort((a, b) => `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`))
                .map((training) => `${formatDate(training.date)} · ${training.startTime}-${training.endTime} · ${branchName(training.branchId)}`)
                .join("<br>");
              return `<tr>
                <td><strong>${userName(row.userId)}</strong><br><span class="muted">${labels[byId(db.users, row.userId)?.role] || "Тренер"}</span></td>
                <td>${row.mainCount} × ${money(db.settings.trainerRate)}<br><strong>${money(row.mainAmount)}</strong></td>
                <td>${row.assistantCount} × ${money(db.settings.assistantRate)}<br><strong>${money(row.assistantAmount)}</strong></td>
                <td><strong>${money(row.total)}</strong></td>
                <td>${detail || "<span class='muted'>Нет тренировок</span>"}</td>
              </tr>`;
            }).join("") || "<tr><td colspan='5'>По выбранному месяцу выплат нет.</td></tr>"}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function attendancePanel(training, trainings = [], month = db.filters.month) {
  const students = groupStudents(training.groupId);
  const attendance = db.attendance.filter((item) => item.trainingId === training.id);
  return `<section class="panel training-panel" id="attendancePanel">
    ${calendarDropdown(trainings, training, month)}
    <div class="training-head">
      <div>
        <p class="eyebrow">Конкретная тренировка</p>
        <h2>${formatDate(training.date)} · ${training.startTime}-${training.endTime}</h2>
        <p>${branchName(training.branchId)} · ${userName(training.trainerId)}${training.assistantConfirmed && training.assistantId ? ` · помощник ${userName(training.assistantId)}` : ""}</p>
      </div>
      <div class="training-tools">${trainerChangeControl(training)}<div class="split-actions">${actionButton("+ Пробный", "open-student-training", training.id, "primary-btn")}${actionButton(training.assistantConfirmed && training.assistantId ? `Помощник: ${userName(training.assistantId)}` : "Был помощник", "toggle-assistant", training.id)}${actionButton("+ Доп. тренировка", "open-extra-training", training.id)}${actionButton("Завершить", "finish-training", training.id)}${actionButton("×", "delete-coach-training", training.id, "danger-btn icon-danger-btn")}</div></div>
    </div>
    <div class="training-summary">
      <span><strong>${students.length}</strong> учеников</span>
      <span><strong>${attendance.filter((item) => item.mark === "PRESENT").length}</strong> был</span>
      <span><strong>${attendance.filter((item) => item.mark === "TRIAL").length}</strong> пробная</span>
      <span><strong>${Math.max(students.length - attendance.length, 0)}</strong> пусто</span>
      <span><strong>${money(trainerPayroll([training]))}</strong> оплата тренеров</span>
    </div>
    <div class="attendance-grid">
      ${students.map((student) => {
        const mark = attendance.find((item) => item.studentId === student.id)?.mark || "";
        return `<div class="attendance-card">
          <div class="attendance-person"><strong>${studentName(student.id)}</strong><span>${escapeHtml(labels[student.status])} · ${escapeHtml(parentForStudent(student.id).phone)}</span></div>
          <button class="single-mark ${mark ? "active" : ""} ${mark === "TRIAL" ? "trial" : ""}" type="button" data-training="${training.id}" data-student="${student.id}">
            ${mark === "PRESENT" ? "Был" : mark === "TRIAL" ? "Пробная" : "Отметить"}
          </button>
        </div>`;
      }).join("")}
    </div>
  </section>`;
}

function viewPayments() {
  if (!isOwner()) return denied();
  const filters = paymentPageFilters();
  const branchId = filters.branchId;
  if (rebuildAbsenceCarryovers(branchId)) saveData();
  const availableMonths = paymentAvailableMonths(branchId);
  if (!availableMonths.includes(filters.month)) {
    filters.month = availableMonths[0] || CURRENT_MONTH;
    saveData();
  }
  const month = filters.month;
  const charges = db.charges.filter((charge) => !charge.deletedAt && hasBranchAccess(charge.branchId) && charge.month === month && (branchId === "all" || charge.branchId === branchId));
  const confirmed = charges.filter((charge) => charge.isConfirmed);
  const branchCreditTotal = branchCredits(branchId, month).reduce((sum, credit) => sum + credit.remainingAmount, 0);
  return `
    <section class="panel">
      <div class="panel-head">
        <div><h2>Оплаты и начисления</h2><p>Здесь отдельные фильтры по филиалу и месяцу.</p></div>
      </div>
      <div class="filters">
        <select id="branchFilter">
          <option value="all" ${filters.branchId === "all" ? "selected" : ""}>Все филиалы</option>
          ${activeBranches().map((branch) => `<option value="${escapeHtml(branch.id)}" ${filters.branchId === branch.id ? "selected" : ""}>${escapeHtml(branch.name)}</option>`).join("")}
        </select>
        <select id="monthFilter">
          ${availableMonths.map((itemMonth) => `<option value="${itemMonth}" ${filters.month === itemMonth ? "selected" : ""}>${formatMonth(itemMonth)}</option>`).join("")}
        </select>
      </div>
    </section>
    <div class="grid cols-4">
      ${card("Начислено", money(confirmed.reduce((sum, charge) => sum + charge.finalAmount, 0)), `${formatMonth(month)} · ${branchId === "all" ? "все филиалы" : branchName(branchId)}`)}
      ${card("Оплачено", money(confirmed.reduce((sum, charge) => sum + chargePaid(charge.id), 0)), "По выбранному месяцу")}
      ${card("Переносы", money(branchCreditTotal), branchId === "all" ? "По всем филиалам" : branchName(branchId))}
    </div>
    <section class="panel">
      <div class="panel-head">
        <div><h2>Формирование начислений</h2><p>Старые долги не включаются в новое начисление, они показываются отдельно.</p></div>
        <div class="split-actions">${actionButton("Сформировать", "generate-base-charges", "selected", "primary-btn")}${actionButton("Перерасчет", "recalculate-charges", "selected")}</div>
      </div>
    </section>
    <section class="table-panel">
      <div class="table-toolbar"><h2>Начисления</h2><button class="ghost-btn" type="button" data-action="copy-parent-table" data-id="all">Скопировать таблицу</button></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Ученик</th><th>Филиал</th><th>Месяц</th><th>Расчет</th><th>К оплате</th><th>Оплачено</th><th>Статус</th><th>Действия</th></tr></thead>
          <tbody>${charges.map((charge) => {
            const paid = chargePaid(charge.id);
            return `<tr>
              <td><strong>${studentName(charge.studentId)}</strong></td>
              <td>${branchName(charge.branchId)}</td>
              <td>${formatMonth(charge.month)}</td>
              <td>${charge.trainingsCount} × ${money(charge.pricePerTraining)}<br><span class="muted">перенос ${money(charge.carryoverIncoming ?? charge.carryoverUsed)}, переплата ${money(charge.overpayUsed ?? carryoverAmountForCharge(charge))}</span></td>
              <td>${money(charge.finalAmount)}</td>
              <td>${money(paid)}</td>
              <td>${statusPill(labels[charge.status] || charge.status, charge.status === "PAID" ? "paid" : charge.status === "PARTIAL" ? "partial" : "debt")}</td>
              <td><div class="split-actions">${actionButton("+ Оплата", "add-payment", charge.id, "primary-btn")}${actionButton("Удалить", "delete-charge", charge.id, "danger-btn")}</div></td>
            </tr>`;
          }).join("")}</tbody>
        </table>
      </div>
    </section>
  `;
}

function viewDebts() {
  if (!isOwner()) return denied();
  const debts = db.debts.filter((debt) => !debt.closedAt && hasBranchAccess(debt.branchId));
  return `
    <div class="grid cols-3">
      ${card("Должников", new Set(debts.map((debt) => debt.studentId)).size, "После закрытия месяца")}
      ${card("Сумма долга", money(debts.reduce((sum, debt) => sum + debt.amount, 0)), "Неоплаченный остаток")}
      ${card("Средний долг", money(debts.length ? debts.reduce((sum, debt) => sum + debt.amount, 0) / debts.length : 0), "На ученика")}
    </div>
    <section class="table-panel">
      <div class="table-toolbar"><h2>Общий список должников</h2>${actionButton("Скопировать все сообщения", "copy-debt-messages", "all", "primary-btn")}</div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Ученик</th><th>Филиал</th><th>Месяц</th><th>Долг</th><th>Сообщение</th></tr></thead>
          <tbody>${debts.map((debt) => `<tr>
            <td><strong>${studentName(debt.studentId)}</strong><br><span class="muted">${escapeHtml(parentForStudent(debt.studentId).phone)}</span></td>
            <td>${branchName(debt.branchId)}</td>
            <td>${formatMonth(debt.month)}</td>
            <td>${money(debt.amount)}</td>
            <td>${actionButton("Скопировать", "debt-message", debt.id)}</td>
          </tr>`).join("") || "<tr><td colspan='5'>Долгов нет. Они появляются только после закрытия месяца.</td></tr>"}</tbody>
        </table>
      </div>
    </section>
  `;
}

function viewClosing() {
  if (!isOwner()) return denied();
  const month = db.filters.month;
  return `
    ${filtersPanel("Закрытие месяца", "Закрытие выполняется отдельно по каждому филиалу. Долги не блокируют закрытие.")}
    <section class="table-panel">
      <div class="table-toolbar"><h2>${formatMonth(month)}</h2><span class="chip">проверка перед закрытием</span></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Филиал</th><th>Начисления</th><th>Оплаты</th><th>Переносы</th><th>Проверка</th><th>Статус</th><th>Действия</th></tr></thead>
          <tbody>${activeBranches().map((branch) => {
            const report = closingReport(branch.id, month);
            const closing = db.monthClosings.find((item) => item.branchId === branch.id && item.month === month);
            return `<tr>
              <td><strong>${escapeHtml(branch.name)}</strong></td>
              <td>${money(report.charged)}</td>
              <td>${money(report.paid)}</td>
              <td>${money(report.carryover)}</td>
              <td>${report.blocked ? statusPill("нет посещаемости", "inactive") : statusPill("можно закрывать", "paid")}</td>
              <td>${closing?.status === "CLOSED" ? statusPill("Закрыт", "paid") : statusPill("Открыт", "neutral")}</td>
              <td><div class="split-actions">${actionButton("Проверить", "check-closing", branch.id)}${closing?.status === "CLOSED" ? actionButton("Открыть", "reopen-month", branch.id) : actionButton("Закрыть", "close-month", branch.id, "primary-btn")}</div></td>
            </tr>`;
          }).join("")}</tbody>
        </table>
      </div>
    </section>
  `;
}

function closingReport(branchId, month) {
  const trainings = db.trainings.filter((training) => training.branchId === branchId && training.month === month && !training.deletedAt);
  const hasAnyAttendance = trainings.some((training) => db.attendance.some((item) => item.trainingId === training.id));
  const charges = db.charges.filter((charge) => charge.branchId === branchId && charge.month === month && charge.isConfirmed && !charge.deletedAt);
  const charged = charges.reduce((sum, charge) => sum + charge.finalAmount, 0);
  const paid = charges.reduce((sum, charge) => sum + chargePaid(charge.id), 0);
  const carryover = calculateCarryover(branchId, month);
  return { trainings, charges, charged, paid, carryover, blocked: trainings.length > 0 && !hasAnyAttendance };
}

function calculateCarryover(branchId, month) {
  const charges = db.charges.filter((charge) => charge.branchId === branchId && charge.month === month && charge.isConfirmed && !charge.deletedAt);
  return charges.reduce((sum, charge) => {
    return sum + carryoverAmountForCharge(charge);
  }, 0);
}

function shouldApplyCarryover(month) {
  return monthIndex(month) > monthIndex(CURRENT_MONTH);
}

function viewReports() {
  const s = stats();
  return `
    ${filtersPanel("Статистика и отчеты", "Все показатели пересчитываются после изменений данных без ручного обновления страницы.")}
    <div class="grid cols-4">
      ${card("Филиалов", activeBranches().length, "Активные")}
      ${card("Тренировок", s.trainings.length, "Доступные текущей роли")}
      ${card("План дохода", isOwner() ? money(s.charged) : "скрыто", "Подтвержденные начисления")}
      ${card("Факт дохода", isOwner() ? money(s.paid) : "скрыто", "Действующие платежи")}
    </div>
    <div class="grid cols-3">
      ${card("Посещаемость", `${s.attendance.percent}%`, "Был и Пробная / возможные посещения")}
      ${card("Конверсия пробных", `${trialConversion()}%`, "Пробный → Активный")}
      ${card("Оплата тренеров", money(trainerPayroll(s.trainings)), "Только тренировки с отметками")}
    </div>
    <section class="table-panel">
      <div class="table-toolbar"><h2>Статистика филиалов</h2><div class="split-actions"><button class="ghost-btn" type="button">PDF</button><button class="ghost-btn" type="button" data-action="export-excel" data-id="all">Excel</button><button class="ghost-btn" type="button">Печать</button></div></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Филиал</th><th>Ученики</th><th>Тренировки</th><th>Посещаемость</th><th>Начислено</th><th>Оплачено</th></tr></thead>
          <tbody>${activeBranches().map((branch) => {
            const trainings = db.trainings.filter((training) => training.branchId === branch.id && !training.deletedAt);
            const attendance = attendanceStats(trainings);
            const charges = db.charges.filter((charge) => charge.branchId === branch.id && charge.isConfirmed && !charge.deletedAt);
            const studentCount = db.students.filter((student) => activeEnrollments(student.id).some((enrollment) => enrollment.branchId === branch.id) && !student.deletedAt && !student.archivedAt).length;
            return `<tr><td><strong>${escapeHtml(branch.name)}</strong></td><td>${studentCount}</td><td>${trainings.length}</td><td>${attendance.percent}%</td><td>${isOwner() ? money(charges.reduce((sum, charge) => sum + charge.finalAmount, 0)) : "скрыто"}</td><td>${isOwner() ? money(charges.reduce((sum, charge) => sum + chargePaid(charge.id), 0)) : "скрыто"}</td></tr>`;
          }).join("")}</tbody>
        </table>
      </div>
    </section>
  `;
}

function trialConversion() {
  const trialOrActivated = db.students.filter((student) => student.trialAt);
  if (!trialOrActivated.length) return 0;
  return Math.round((trialOrActivated.filter((student) => student.status === "ACTIVE").length / trialOrActivated.length) * 100);
}

function viewMessages() {
  const filters = messagePageFilters();
  const paymentCharges = db.charges
    .filter((charge) => !charge.deletedAt && charge.isConfirmed && hasBranchAccess(charge.branchId))
    .filter((charge) => filters.branchId === "all" || charge.branchId === filters.branchId)
    .filter((charge) => charge.month === filters.month)
    .filter((charge) => Math.max(charge.finalAmount - chargePaid(charge.id), 0) > 0)
    .sort((a, b) => `${a.month} ${studentName(a.studentId)}`.localeCompare(`${b.month} ${studentName(b.studentId)}`, "ru"));
  const debts = db.debts
    .filter((debt) => !debt.closedAt && hasBranchAccess(debt.branchId))
    .filter((debt) => filters.branchId === "all" || debt.branchId === filters.branchId)
    .filter((debt) => debt.month === filters.month)
    .sort((a, b) => `${a.month} ${studentName(a.studentId)}`.localeCompare(`${b.month} ${studentName(b.studentId)}`, "ru"));
  return `
    <section class="panel">
      <div class="panel-head"><div><h2>Фильтр сообщений</h2><p>Выберите филиал, чтобы видеть сообщения только по нему.</p></div></div>
      <div class="filters">
        <select id="branchFilter">
          <option value="all" ${filters.branchId === "all" ? "selected" : ""}>Все филиалы</option>
          ${activeBranches().map((branch) => `<option value="${escapeHtml(branch.id)}" ${filters.branchId === branch.id ? "selected" : ""}>${escapeHtml(branch.name)}</option>`).join("")}
        </select>
        <select id="monthFilter">
          ${AVAILABLE_MONTHS.map((month) => `<option value="${month}" ${filters.month === month ? "selected" : ""}>${formatMonth(month)}</option>`).join("")}
        </select>
      </div>
    </section>
    <div class="grid cols-2">
      <section class="panel">
        <div class="panel-head"><div><h2>Сообщения об оплате</h2><p>Для начислений, где ещё есть сумма к оплате.</p></div>${actionButton("Скопировать все", "copy-payment-messages", "filtered", "primary-btn")}</div>
        <div class="attendance-list">${paymentCharges.map((charge) => messageRow(charge.studentId, paymentMessage(charge.id), "payment-message", charge.id)).join("") || "<p class='muted'>Нет сообщений об оплате.</p>"}</div>
      </section>
      <section class="panel">
        <div class="panel-head"><div><h2>Сообщения о долгах</h2><p>Для долгов после закрытия месяца.</p></div>${actionButton("Скопировать все", "copy-debt-messages", "filtered", "primary-btn")}</div>
        <div class="attendance-list">${debts.map((debt) => messageRow(debt.studentId, debtMessage(debt.id), "debt-message", debt.id)).join("") || "<p class='muted'>Долговых сообщений нет.</p>"}</div>
      </section>
    </div>
  `;
}

function messageRow(studentId, message, action, itemId = studentId) {
  return `<div class="student-card">
    <strong>${studentName(studentId)}</strong>
    <div class="message-box">${message}</div>
    ${actionButton("Скопировать", action, itemId, "primary-btn")}
  </div>`;
}

function trialMessage(studentId) {
  const student = byId(db.students, studentId);
  const parent = parentForStudent(studentId);
  return `Здравствуйте, ${parent.name}!\n\nХотели узнать, понравилась ли ${studentName(studentId)} пробная тренировка в футбольной школе «Атака»?\n\nПланируете ли вы продолжить занятия?\n\nБудем рады получить вашу обратную связь.`;
}

function paymentMessage(chargeId) {
  const charge = byId(db.charges, chargeId);
  if (!charge) return "";
  const parent = parentForStudent(charge.studentId);
  const left = Math.max(charge.finalAmount - chargePaid(charge.id), 0);
  return `Здравствуйте, ${parent.name}!\n\nПо занятиям в футбольной школе «Атака» за ${formatMonth(charge.month)} к оплате осталось ${money(left)}.\n\nПожалуйста, внесите оплату до ${formatDate(charge.dueDate)}. Если оплата уже была отправлена, сообщите нам, и мы проверим данные.`;
}

function debtMessage(debtId) {
  const debt = byId(db.debts, debtId);
  if (!debt) return "";
  const parent = parentForStudent(debt.studentId);
  return `Здравствуйте, ${parent.name}!\n\nПо занятиям в футбольной школе «Атака» за ${formatMonth(debt.month)} осталась задолженность ${money(debt.amount)}.\n\nПожалуйста, внесите оплату удобным способом. Если оплата уже была отправлена, сообщите нам, и мы проверим данные.`;
}

function viewSettings() {
  if (!isOwner()) return denied();
  const branchColumns = db.branches.filter((branch) => !branch.deletedAt && !branch.archivedAt && branch.isActive);
  const weekOrder = [1, 2, 3, 4, 5, 6, 0];
  const tab = ["general", "schedule", "users"].includes(db.settingsTab) ? db.settingsTab : "general";
  const tabButton = (idValue, label) => `<button class="tab-btn ${tab === idValue ? "active" : ""}" type="button" data-action="set-settings-tab" data-id="${idValue}">${label}</button>`;
  return `
    <section class="panel settings-tabs-panel">
      <div class="settings-tabs">
        ${tabButton("general", "Общие")}
        ${tabButton("schedule", "Расписание")}
        ${tabButton("users", "Пользователи")}
      </div>
    </section>
    ${tab === "general" ? `
      <section class="panel">
        <div class="panel-head"><div><h2>Общие настройки</h2><p>Изменение цены не пересчитывает старые начисления автоматически.</p></div></div>
        <label>Стоимость одной тренировки, ₽<input id="priceInput" type="number" min="0" value="${db.settings.pricePerTraining}"></label>
        <label>Срок оплаты, число месяца<input id="dueInput" type="number" min="1" max="28" value="${db.settings.dueDay}"></label>
        <div class="split-actions"><button class="primary-btn" type="button" data-action="save-settings" data-id="settings">Сохранить настройки</button></div>
        <div class="danger-zone">
          <div>
            <strong>СТОК</strong>
            <p>Очищает отметки, начисления, оплаты, долги, переносы и закрытия месяцев. Ученики, филиалы, пользователи и расписание останутся.</p>
          </div>
          ${actionButton("СТОК", "stock-reset", "settings", "danger-btn")}
        </div>
      </section>
    ` : ""}
    ${tab === "schedule" ? `
      <section class="panel schedule-settings-panel">
        <div class="panel-head">
          <div><h2>Расписание</h2><p>Меняйте дни и время тренировок по каждому филиалу.</p></div>
        </div>
        <form id="scheduleSettingsForm">
          <div class="schedule-settings">
            ${branchColumns.map((branch) => {
              const scheduleMap = branchScheduleMap(branch.id);
              return `
                <details class="accordion-drop">
                  <summary>
                    <span>${escapeHtml(branch.name)}</span>
                    <strong>${scheduleMap.size} дн.</strong>
                  </summary>
                  <div class="accordion-body schedule-week">
                    ${weekOrder.map((day) => {
                      const schedule = scheduleMap.get(day);
                      return scheduleDayEditor(day, schedule, {
                        active: `scheduleActive_${branch.id}_${day}`,
                        start: `scheduleStart_${branch.id}_${day}`,
                        end: `scheduleEnd_${branch.id}_${day}`
                      });
                    }).join("")}
                  </div>
                </details>
              `;
            }).join("")}
          </div>
          <div class="split-actions"><button class="primary-btn" type="button" data-action="save-settings" data-id="settings">Сохранить расписание</button></div>
        </form>
      </section>
    ` : ""}
    ${tab === "users" ? `
      <section class="panel">
        <div class="panel-head">
          <div><h2>Пользователи и роли</h2><p>Владелец создаёт учетные записи, назначает роль и филиалы.</p></div>
          ${actionButton("+ Добавить роль", "add-user-account", "new", "primary-btn")}
        </div>
        <form id="usersSettingsForm">
          <div class="users-settings">
            ${db.users.filter((user) => !user.deletedAt).map((user) => `
              <article class="user-setting">
                <div class="user-setting-head">
                  <input class="user-name-input" name="userName_${user.id}" value="${escapeHtml(user.name)}">
                  <div class="user-setting-actions">
                    <span class="user-setting-badge">${user.role === "owner" ? "Владелец" : "Тренер"}</span>
                    ${actionButton("Удалить", "delete-user-account", user.id, "danger-btn")}
                  </div>
                </div>
                <div class="account-fields">
                  <label>Логин<input name="userLogin_${user.id}" value="${escapeHtml(user.login || "")}" placeholder="trener1"></label>
                  <label>Новый пароль<input name="userPassword_${user.id}" type="password" autocomplete="new-password" placeholder="Оставить прежний"></label>
                </div>
                <details class="accordion-drop">
                  <summary>
                    <span>Роль</span>
                    <strong>${user.role === "owner" ? "Владелец" : "Тренер"}</strong>
                  </summary>
                  <div class="accordion-body">
                    <label>Выбор роли
                      <select name="userRole_${user.id}">
                        <option value="owner" ${user.role === "owner" ? "selected" : ""}>Владелец</option>
                        <option value="coach" ${user.role === "coach" ? "selected" : ""}>Тренер</option>
                      </select>
                    </label>
                  </div>
                </details>
                <details class="accordion-drop">
                  <summary>
                    <span>Филиалы</span>
                    <strong>${user.branchIds.length ? `${user.branchIds.length} выбрано` : "Не выбрано"}</strong>
                  </summary>
                  <div class="accordion-body">
                    <div class="user-branches">
                      ${branchColumns.map((branch) => `
                        <label class="branch-check">
                          <input type="checkbox" name="userBranch_${user.id}" value="${branch.id}" ${user.branchIds.includes(branch.id) ? "checked" : ""}>
                          <span>${escapeHtml(branch.name)}</span>
                        </label>
                      `).join("")}
                    </div>
                  </div>
                </details>
              </article>
            `).join("")}
          </div>
          <div class="split-actions"><button class="primary-btn" type="button" data-action="save-settings" data-id="settings">Сохранить пользователей и роли</button></div>
        </form>
      </section>
    ` : ""}
  `;
}

function viewArchive() {
  if (!isOwner()) return denied();
  const archivedStudents = db.students.filter((student) => student.archivedAt && !student.deletedAt);
  const archivedBranches = db.branches.filter((branch) => branch.archivedAt && !branch.deletedAt);
  return `<section class="table-panel">
    <div class="table-toolbar"><h2>Архив</h2><span class="chip">архив не участвует в текущей работе</span></div>
    <div class="table-wrap"><table><thead><tr><th>Тип</th><th>Название</th><th>Дата</th><th>Действие</th></tr></thead><tbody>
      ${archivedStudents.map((student) => `<tr><td>Ученик</td><td>${studentName(student.id)}</td><td>${formatDateTime(student.archivedAt)}</td><td>${actionButton("Восстановить", "restore-archive-student", student.id)}</td></tr>`).join("")}
      ${archivedBranches.map((branch) => `<tr><td>Филиал</td><td>${escapeHtml(branch.name)}</td><td>${formatDateTime(branch.archivedAt)}</td><td>${actionButton("Восстановить", "restore-archive-branch", branch.id)}</td></tr>`).join("")}
      ${!archivedStudents.length && !archivedBranches.length ? "<tr><td colspan='4'>Архив пуст.</td></tr>" : ""}
    </tbody></table></div>
  </section>`;
}

function viewDeleted() {
  if (!isOwner()) return denied();
  return `<section class="table-panel">
    <div class="table-toolbar"><h2>Недавно удаленные</h2><div class="split-actions"><span class="chip">хранятся 30 дней</span>${db.deleted.length ? actionButton("Удалить все", "purge-deleted-all", "all", "danger-btn") : ""}</div></div>
    <div class="table-wrap"><table><thead><tr><th>Тип</th><th>Название</th><th>Дата удаления</th><th>Кто удалил</th><th>Действия</th></tr></thead><tbody>
      ${db.deleted.map((item) => `<tr><td>${item.type}</td><td><strong>${item.title}</strong></td><td>${formatDateTime(item.deletedAt)}</td><td>${userName(item.deletedBy)}</td><td><div class="split-actions">${actionButton("Восстановить", "restore-deleted", item.id, "primary-btn")}${actionButton("Удалить навсегда", "purge-deleted", item.id, "danger-btn")}</div></td></tr>`).join("") || "<tr><td colspan='5'>Нет недавно удаленных записей.</td></tr>"}
    </tbody></table></div>
  </section>`;
}

function viewAudit() {
  if (!isOwner()) return denied();
  return `<section class="table-panel">
    <div class="table-toolbar"><h2>Журнал изменений</h2><span class="chip">финансовые и важные действия</span></div>
    <div class="table-wrap"><table><thead><tr><th>Дата</th><th>Пользователь</th><th>Действие</th><th>Объект</th></tr></thead><tbody>
      ${db.auditLog.map((log) => `<tr><td>${formatDateTime(log.at)}</td><td>${userName(log.userId)}</td><td>${log.action}</td><td>${log.entity}</td></tr>`).join("")}
    </tbody></table></div>
  </section>`;
}

function denied() {
  return `<section class="panel"><h2>Нет доступа</h2><p>Этот раздел доступен владельцу. Тренер видит только свои филиалы, тренировки и статистику без финансов.</p></section>`;
}

function trainingsAfterTrial(studentId) {
  const student = byId(db.students, studentId);
  if (!student?.trialAt) return 0;
  return db.trainings.filter((training) => training.groupId === student.primaryGroupId && training.date > student.trialAt && effectiveTrainingStatus(training) === "DONE").length;
}

function markAttendance(trainingId, studentId, mark) {
  const existing = db.attendance.find((item) => item.trainingId === trainingId && item.studentId === studentId);
  const training = byId(db.trainings, trainingId);
  const student = byId(db.students, studentId);
  if (!training || !student || !hasBranchAccess(training.branchId)) return toast("Нет доступа к тренировке");

  if (!mark) {
    if (existing) db.attendance = db.attendance.filter((item) => item.id !== existing.id);
    audit("Удалена отметка посещаемости", studentName(studentId));
    saveData("Отметка очищена");
    return;
  }

  const price = mark === "TRIAL" ? 0 : db.settings.pricePerTraining;
  if (existing) {
    existing.mark = mark;
    existing.priceAtAttendance = price;
  } else {
    db.attendance.push({ id: id("att"), trainingId, studentId, mark, priceAtAttendance: price });
  }
  training.status = "DONE";

  audit(`Поставлена отметка ${labels[mark === "TRIAL" ? "TRIAL_MARK" : mark]}`, studentName(studentId));
  saveData("Посещаемость обновлена");
}

function createMonth(month) {
  if (!isOwner()) {
    toast("Создать месяц может только владелец");
    return;
  }
  let created = 0;
  activeGroups().forEach((group) => {
    const schedules = db.schedules.filter((schedule) => schedule.groupId === group.id);
    const [year, monthNumber] = month.split("-").map(Number);
    const days = new Date(year, monthNumber, 0).getDate();
    for (let day = 1; day <= days; day += 1) {
      const date = `${year}-${String(monthNumber).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const weekday = new Date(`${date}T12:00:00`).getDay();
      schedules.filter((schedule) => schedule.weekday === weekday).forEach((schedule) => {
        const exists = db.trainings.some((training) => training.groupId === group.id && training.date === date && training.startTime === schedule.startTime && !training.deletedAt);
        if (!exists) {
          db.trainings.push({
            id: id("tr"),
            date,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            month,
            branchId: group.branchId,
            groupId: group.id,
            trainerId: group.trainerId,
            assistantId: null,
            assistantConfirmed: false,
            status: "PLANNED",
            type: "REGULAR",
            originalTrainingId: null,
            deletedAt: null,
            archivedAt: null
          });
          created += 1;
        }
      });
    }
  });
  audit(`Создан календарь месяца: ${created} тренировок`, month);
  saveData(`Создано тренировок: ${created}`);
  render();
}

function monthIndex(month) {
  return AVAILABLE_MONTHS.indexOf(month);
}

function monthClosedForBranch(branchId, month) {
  return db.monthClosings.some((closing) => closing.branchId === branchId && closing.month === month && closing.status === "CLOSED");
}

function trainingPageFilters() {
  if (!db.trainingFilters) db.trainingFilters = { branchId: "all", month: CURRENT_MONTH };
  return db.trainingFilters;
}

function paymentPageFilters() {
  if (!db.paymentFilters) db.paymentFilters = { branchId: "all", month: CURRENT_MONTH };
  return db.paymentFilters;
}

function coachPageFilters() {
  if (!db.coachFilters) db.coachFilters = { branchId: "all", month: CURRENT_MONTH };
  if (!AVAILABLE_MONTHS.includes(db.coachFilters.month)) db.coachFilters.month = CURRENT_MONTH;
  return db.coachFilters;
}

function messagePageFilters() {
  if (!db.messageFilters) db.messageFilters = { branchId: "all", month: CURRENT_MONTH };
  if (!db.messageFilters.month || !AVAILABLE_MONTHS.includes(db.messageFilters.month)) db.messageFilters.month = CURRENT_MONTH;
  return db.messageFilters;
}

function paymentAvailableMonths(branchId) {
  if (branchId === "all") return AVAILABLE_MONTHS;
  const months = [];
  AVAILABLE_MONTHS.forEach((month, index) => {
    if (index === 0) {
      months.push(month);
      return;
    }
    if (monthClosedForBranch(branchId, AVAILABLE_MONTHS[index - 1])) months.push(month);
  });
  return months;
}

function previousMonth(month) {
  const index = monthIndex(month);
  if (index <= 0) return null;
  return AVAILABLE_MONTHS[index - 1] || null;
}

function creditBranchId(credit) {
  const group = byId(db.groups, credit.groupId);
  if (group?.branchId) return group.branchId;
  const studentBranch = activeEnrollments(credit.studentId)[0]?.branchId;
  return studentBranch || null;
}

function branchCredits(branchId, month = null) {
  return db.credits.filter((credit) => {
    if (credit.remainingAmount <= 0) return false;
    if (branchId !== "all" && creditBranchId(credit) !== branchId) return false;
    if (month) {
      const sourceMonth = previousMonth(month);
      if (!sourceMonth || credit.sourceMonth !== sourceMonth) return false;
    }
    return true;
  });
}

function monthAttendanceSummaryForCharge(charge) {
  const trainings = db.trainings
    .filter((training) => training.groupId === charge.groupId && training.month === charge.month && effectiveTrainingStatus(training) === "DONE")
    .sort((a, b) => `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`));
  const attended = trainings.filter((training) => db.attendance.some((item) => item.trainingId === training.id && item.studentId === charge.studentId && ["PRESENT", "TRIAL"].includes(item.mark))).length;
  const missed = Math.max(trainings.length - attended, 0);
  return { trainings, attended, missed, missedAmount: missed * (charge.pricePerTraining || db.settings.pricePerTraining) };
}

function factualDebtForCharge(charge) {
  const summary = monthAttendanceSummaryForCharge(charge);
  const price = charge.pricePerTraining || db.settings.pricePerTraining || 0;
  const attendedAmount = summary.attended * price;
  const carryover = Math.max(charge.carryoverIncoming || charge.carryoverUsed || 0, 0);
  const paid = chargePaid(charge.id);
  return Math.max(attendedAmount - carryover - paid, 0);
}

function carryoverAmountForCharge(charge) {
  const paidOverFinalAmount = Math.max(chargePaid(charge.id) - charge.finalAmount, 0);
  return paidOverFinalAmount + Math.max(charge.carryoverForward || 0, 0);
}

function rollForwardUnusedCarryovers(branchId, month) {
  const sourceMonth = previousMonth(month);
  if (!sourceMonth) return;
  db.credits.forEach((credit) => {
    if (credit.remainingAmount <= 0) return;
    if (creditBranchId(credit) !== branchId) return;
    if (credit.sourceMonth !== sourceMonth) return;
    credit.sourceMonth = month;
    credit.sourceType = "OVERPAYMENT";
  });
}

function rebuildAbsenceCarryovers(branchId = "all") {
  const branches = branchId === "all" ? activeBranches() : activeBranches().filter((branch) => branch.id === branchId);
  let changed = false;

  branches.forEach((branch) => {
    const closedMonths = db.monthClosings.filter((closing) => closing.branchId === branch.id && closing.status === "CLOSED").map((closing) => closing.month);
    closedMonths.forEach((month) => {
      const before = db.credits.length;
      db.credits = db.credits.filter((credit) => !["ABSENCE_CARRYOVER", "OVERPAYMENT"].includes(credit.sourceType) || credit.sourceMonth !== month || creditBranchId(credit) !== branch.id);
      const charges = db.charges.filter((charge) => charge.branchId === branch.id && charge.month === month && charge.isConfirmed && !charge.deletedAt);
      charges.forEach((charge) => {
        const amount = carryoverAmountForCharge(charge);
        if (amount > 0) {
          db.credits.push({
            id: id("cr"),
            studentId: charge.studentId,
            groupId: charge.groupId,
            sourceMonth: month,
            amount,
            remainingAmount: amount,
            sourceType: "OVERPAYMENT"
          });
        }
      });
      if (db.credits.length !== before) changed = true;
    });
  });

  return changed;
}

function refreshOverpaymentCredits(branchId = "all", month = null) {
  const branches = branchId === "all" ? activeBranches() : activeBranches().filter((branch) => branch.id === branchId);
  let changed = false;

  branches.forEach((branch) => {
    const months = month ? [month] : AVAILABLE_MONTHS;
    months.forEach((currentMonth) => {
      const before = db.credits.length;
      db.credits = db.credits.filter((credit) => !["ABSENCE_CARRYOVER", "OVERPAYMENT"].includes(credit.sourceType) || credit.sourceMonth !== currentMonth || creditBranchId(credit) !== branch.id);
      const charges = db.charges.filter((charge) => charge.branchId === branch.id && charge.month === currentMonth && charge.isConfirmed && !charge.deletedAt);
      charges.forEach((charge) => {
        const amount = carryoverAmountForCharge(charge);
        if (amount > 0) {
          db.credits.push({
            id: id("cr"),
            studentId: charge.studentId,
            groupId: charge.groupId,
            sourceMonth: currentMonth,
            amount,
            remainingAmount: amount,
            sourceType: "OVERPAYMENT"
          });
        }
      });
      if (db.credits.length !== before) changed = true;
    });
  });

  return changed;
}

function restoreCreditsFromCharge(charge) {
  if (!charge?.creditUsage?.length) return;
  charge.creditUsage.forEach((usage) => {
    const credit = byId(db.credits, usage.creditId);
    if (!credit) return;
    credit.remainingAmount = Math.min((credit.remainingAmount || 0) + usage.amount, credit.amount);
  });
}

function rebuildChargeFromCurrentState(charge, { confirm = false, useCredits = true, countMode = "calendar" } = {}) {
  restoreCreditsFromCharge(charge);

  const relevantTrainings = db.trainings
    .filter((training) => training.branchId === charge.branchId && training.groupId === charge.groupId && training.month === charge.month && !training.deletedAt && !training.archivedAt)
    .filter((training) => training.status !== "CANCELLED" && training.type !== "REPLACEMENT")
    .sort((a, b) => `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`));
  const summary = monthAttendanceSummaryForCharge(charge);
  const trainingsCount = countMode === "attended" ? summary.attended : relevantTrainings.length;
  const baseAmount = trainingsCount * db.settings.pricePerTraining;
  const credits = useCredits ? branchCredits(charge.branchId, charge.month)
    .filter((item) => item.studentId === charge.studentId && item.groupId === charge.groupId && item.remainingAmount > 0)
    .sort((a, b) => `${a.sourceMonth} ${a.id}`.localeCompare(`${b.sourceMonth} ${b.id}`)) : [];
  const incomingCarryover = credits.reduce((sum, item) => sum + item.remainingAmount, 0);

  let rest = baseAmount;
  const usage = [];
  credits.forEach((item) => {
    if (rest <= 0) return;
    const take = Math.min(item.remainingAmount, rest);
    if (take <= 0) return;
    usage.push({ creditId: item.id, amount: take });
    rest -= take;
  });

  const used = usage.reduce((sum, item) => sum + item.amount, 0);
  if (useCredits) {
    usage.forEach((item) => {
      const credit = byId(db.credits, item.creditId);
      if (!credit) return;
      credit.remainingAmount = Math.max(credit.remainingAmount - item.amount, 0);
    });
  }

  charge.trainingsCount = trainingsCount;
  charge.pricePerTraining = db.settings.pricePerTraining;
  charge.baseAmount = baseAmount;
  charge.carryoverUsed = used;
  charge.carryoverIncoming = incomingCarryover;
  charge.carryoverForward = Math.max(incomingCarryover - used, 0);
  charge.finalAmount = Math.max(baseAmount - used, 0);
  charge.overpayUsed = carryoverAmountForCharge(charge);
  charge.dueDate = `${charge.month}-${String(db.settings.dueDay).padStart(2, "0")}`;
  if (confirm) charge.isConfirmed = true;
  charge.status = charge.isConfirmed ? (charge.finalAmount > 0 ? "AWAITING" : "PAID") : "DRAFT";
  charge.creditUsage = usage;
}

function isBranchMonthOpened(branchId, month) {
  return db.openedBranchMonths.some((item) => item.branchId === branchId && item.month === month);
}

function markBranchMonthOpened(branchId, month) {
  const existing = db.openedBranchMonths.find((item) => item.branchId === branchId && item.month === month);
  if (existing) {
    existing.openedAt = nowText();
    existing.openedBy = currentUser().id;
    return;
  }
  db.openedBranchMonths.push({ id: id("open"), branchId, month, openedAt: nowText(), openedBy: currentUser().id });
}

function generateBranchChargesForMonth(branchId, month, { confirm = true, useCredits = true, countMode = "calendar" } = {}) {
  const branch = byId(db.branches, branchId);
  if (!branch) return { created: 0, skipped: 0 };

  const groups = activeGroups().filter((group) => group.branchId === branchId);
  let created = 0;
  let skipped = 0;

  groups.forEach((group) => {
    const trainings = db.trainings
      .filter((training) => training.branchId === branchId && training.groupId === group.id && training.month === month && !training.deletedAt && !training.archivedAt)
      .filter((training) => training.status !== "CANCELLED" && training.type !== "REPLACEMENT")
      .sort((a, b) => `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`));

    groupStudents(group.id).filter((student) => student.status === "ACTIVE").forEach((student) => {
      const existingCharges = db.charges.filter((charge) => charge.studentId === student.id && charge.groupId === group.id && charge.branchId === branchId && charge.month === month && !charge.deletedAt);
      if (existingCharges.length) {
        const [existing, ...duplicates] = existingCharges;
        rebuildChargeFromCurrentState(existing, { confirm, useCredits, countMode });
        duplicates.forEach((duplicate) => {
          if (!duplicate.deletedAt) {
            restoreCreditsFromCharge(duplicate);
            duplicate.deletedAt = nowText();
          }
        });
        skipped += 1;
        return;
      }

      const charge = {
        id: id("ch"),
        studentId: student.id,
        groupId: group.id,
        branchId,
        month,
        trainingsCount: 0,
        pricePerTraining: db.settings.pricePerTraining,
        baseAmount: 0,
        carryoverUsed: 0,
        overpayUsed: 0,
        finalAmount: 0,
        dueDate: `${month}-${String(db.settings.dueDay).padStart(2, "0")}`,
        status: confirm ? "AWAITING" : "DRAFT",
        isConfirmed: confirm,
        creditUsage: [],
        deletedAt: null
      };
      db.charges.push(charge);
      rebuildChargeFromCurrentState(charge, { confirm, useCredits, countMode });
      created += 1;
    });
  });

  markBranchMonthOpened(branchId, month);

  return { created, skipped, opened: isBranchMonthOpened(branchId, month) };
}

function openBranchMonth(branchId, month) {
  if (!isOwner()) return toast("Месяц открывает только владелец");
  if (!AVAILABLE_MONTHS.includes(month)) return toast("Неверный месяц");

  const endIndex = monthIndex(month);
  if (endIndex < 0) return toast("Неверный месяц");

  rebuildAbsenceCarryovers(branchId);
  let created = 0;
  let skipped = 0;
  AVAILABLE_MONTHS.slice(0, endIndex + 1).forEach((currentMonth) => {
    const result = generateBranchChargesForMonth(branchId, currentMonth, { confirm: true });
    created += result.created;
    skipped += result.skipped;
  });

  db.filters.branchId = branchId;
  db.filters.groupId = "all";
  db.filters.month = month;
  db.activeView = "payments";
  audit("Открыт месяц", `${branchName(branchId)} ${month}`);
  saveData(`Открыт ${formatMonth(month)}: начислено ${created}, пропущено ${skipped}`);
  render();
}

function generateChargesBase() {
  if (!isOwner()) return toast("Начисления создает только владелец");
  const filters = paymentPageFilters();
  const month = filters.month;
  const targetBranches = activeBranches();
  if (!targetBranches.length) return toast("Нет активных филиалов");
  let created = 0;
  let skipped = 0;
  targetBranches.forEach((branch) => {
    if (!paymentAvailableMonths(branch.id).includes(month)) {
      skipped += 1;
      return;
    }
    const result = generateBranchChargesForMonth(branch.id, month, { confirm: true, useCredits: shouldApplyCarryover(month), countMode: "calendar" });
    created += result.created;
    skipped += result.skipped;
  });

  audit(`Сформированы базовые начисления: ${created}`, `${filters.branchId === "all" ? "Все филиалы" : branchName(filters.branchId)} ${month}`);
  saveData(`Базовые начисления сформированы: ${created}`);
  render();
}

function recalculateCharges() {
  if (!isOwner()) return toast("Начисления создает только владелец");
  const filters = paymentPageFilters();
  const targetBranches = activeBranches();
  if (!targetBranches.length) return toast("Нет активных филиалов");
  if (rebuildAbsenceCarryovers()) saveData();
  let created = 0;
  let skipped = 0;
  targetBranches.forEach((branch) => {
    const months = paymentAvailableMonths(branch.id);
    months.forEach((currentMonth) => {
      const result = generateBranchChargesForMonth(branch.id, currentMonth, { confirm: true, useCredits: true, countMode: "attended" });
      created += result.created;
      skipped += result.skipped;
      refreshOverpaymentCredits(branch.id, currentMonth);
    });
  });

  audit(`Выполнен перерасчет начислений: ${created}`, `${filters.branchId === "all" ? "Все филиалы" : branchName(filters.branchId)} ${filters.month}`);
  saveData(`Перерасчет начислений: ${created}`);
  render();
}

function confirmChargesForPaymentPage() {
  if (!isOwner()) return toast("Начисления подтверждает только владелец");
  const filters = paymentPageFilters();
  const month = filters.month;
  const charges = db.charges.filter((charge) => !charge.deletedAt && !charge.isConfirmed && charge.month === month && (filters.branchId === "all" || charge.branchId === filters.branchId));
  charges.forEach((charge) => {
    charge.isConfirmed = true;
    charge.status = "AWAITING";
  });
  audit("Подтверждены начисления", `${charges.length} записей`);
  saveData("Начисления подтверждены");
  render();
}

function confirmCharge(chargeId) {
  if (!isOwner()) return toast("Начисления подтверждает только владелец");
  const charges = chargeId === "all" ? db.charges.filter((charge) => !charge.isConfirmed && !charge.deletedAt) : [byId(db.charges, chargeId)].filter(Boolean);
  charges.forEach((charge) => {
    charge.isConfirmed = true;
    charge.status = "AWAITING";
  });
  audit("Подтверждены начисления", `${charges.length} записей`);
  saveData("Начисления подтверждены");
  render();
}

function addPayment(chargeId) {
  if (!isOwner()) return toast("Оплаты вносит владелец");
  const charge = byId(db.charges, chargeId);
  if (!charge || !hasBranchAccess(charge.branchId)) return toast("Нет доступа к начислению");
  const currentPaid = chargePaid(charge.id);
  const input = prompt(`Введите новую сумму оплаты для ${studentName(charge.studentId)}. Сейчас оплачено: ${money(currentPaid)}`, currentPaid || charge.finalAmount || db.settings.pricePerTraining);
  const amount = Number(input);
  if (!Number.isFinite(amount) || amount < 0 || amount > 500000) return toast("Введите корректную сумму оплаты");
  const replacedPaymentIds = db.allocations
    .filter((allocation) => allocation.chargeId === chargeId)
    .map((allocation) => allocation.paymentId);
  db.allocations = db.allocations.filter((allocation) => allocation.chargeId !== chargeId);
  db.payments = db.payments.filter((payment) => !replacedPaymentIds.includes(payment.id));
  db.credits = db.credits.filter((credit) => credit.sourceType !== "OVERPAYMENT" || credit.studentId !== charge.studentId || credit.groupId !== charge.groupId || credit.sourceMonth !== charge.month);
  if (amount === 0) {
    charge.overpayUsed = 0;
    audit("Оплата очищена", studentName(charge.studentId));
    saveData("Оплата очищена");
    render();
    return;
  }
  const parent = parentForStudent(charge.studentId);
  const payment = { id: id("pay"), parentId: parent.id, amount, paymentDate: TODAY, createdBy: currentUser().id, deletedAt: null };
  db.payments.push(payment);
  db.allocations.push({ id: id("al"), paymentId: payment.id, chargeId, allocatedAmount: amount });
  if (amount > charge.finalAmount) {
    const overpay = amount - charge.finalAmount;
    db.credits.push({ id: id("cr"), studentId: charge.studentId, groupId: charge.groupId, sourceMonth: charge.month, amount: overpay, remainingAmount: overpay, sourceType: "OVERPAYMENT" });
  }
  charge.overpayUsed = carryoverAmountForCharge(charge);
  audit("Изменена оплата", `${studentName(charge.studentId)} ${money(amount)}`);
  saveData("Оплата обновлена");
  render();
}

function closeMonth(branchId) {
  const month = db.filters.month;
  const report = closingReport(branchId, month);
  if (report.blocked) return toast("Закрытие заблокировано: по филиалу нет посещаемости");
  if (!confirm(`Закрыть ${formatMonth(month)} для филиала «${branchName(branchId)}»? Долги не блокируют закрытие.`)) return;
  report.charges.forEach((charge) => {
    const left = factualDebtForCharge(charge);
    const existingDebt = db.debts.find((debt) => debt.chargeId === charge.id && !debt.closedAt);
    if (left > 0) {
      if (existingDebt) existingDebt.amount = left;
      else db.debts.push({ id: id("debt"), chargeId: charge.id, studentId: charge.studentId, branchId, groupId: charge.groupId, month, amount: left, closedAt: null });
    } else if (existingDebt) {
      existingDebt.closedAt = nowText();
    }
  });
  db.credits = db.credits.filter((credit) => !["ABSENCE_CARRYOVER", "OVERPAYMENT"].includes(credit.sourceType) || credit.sourceMonth !== month || creditBranchId(credit) !== branchId);
  const carryover = calculateCarryover(branchId, month);
  if (carryover > 0) {
    report.charges.forEach((charge) => {
      const amount = carryoverAmountForCharge(charge);
      if (amount > 0) db.credits.push({ id: id("cr"), studentId: charge.studentId, groupId: charge.groupId, sourceMonth: month, amount, remainingAmount: amount, sourceType: "OVERPAYMENT" });
    });
  }
  rollForwardUnusedCarryovers(branchId, month);
  const existing = db.monthClosings.find((item) => item.branchId === branchId && item.month === month);
  if (existing) {
    existing.status = "CLOSED";
    existing.closedAt = nowText();
    existing.closedBy = currentUser().id;
  } else {
    db.monthClosings.push({ id: id("close"), branchId, month, status: "CLOSED", closedAt: nowText(), closedBy: currentUser().id, reopenedAt: null, totals: report });
  }
  audit("Закрыт месяц", `${branchName(branchId)} ${month}`);
  saveData("Месяц закрыт");
  render();
}

function deleteEntity(type, itemId) {
  if (!isOwner()) return toast("Удаление доступно владельцу");
  const map = {
    student: [db.students, "Ученик", studentName(itemId)],
    branch: [db.branches, "Филиал", branchName(itemId)],
    training: [db.trainings, "Тренировка", byId(db.trainings, itemId)?.date],
    charge: [db.charges, "Начисление", itemId]
  };
  const [collection, typeLabel, title] = map[type];
  if (!confirm(`Удалить: ${title}? Запись попадет в «Недавно удаленные».`)) return;
  const item = byId(collection, itemId);
  if (!item) return;
  if (type === "charge" && !item.isConfirmed) {
    restoreCreditsFromCharge(item);
  }
  item.deletedAt = nowText();
  db.deleted.unshift({ id: id("del"), type, typeLabel, itemId, title, deletedAt: nowText(), deletedBy: currentUser().id });
  audit(`Удаление: ${typeLabel}`, title);
  saveData("Запись перемещена в недавно удаленные");
  render();
}

function archiveStudent(studentId) {
  const student = byId(db.students, studentId);
  if (!student) return;
  student.archivedAt = nowText();
  audit("Ученик отправлен в архив", studentName(studentId));
  saveData("Ученик отправлен в архив");
  render();
}

function saveBranchDetails(branchId) {
  if (!isOwner()) return toast("Филиал может менять только владелец");
  const branch = byId(db.branches, branchId);
  const form = document.getElementById("branchDetailsForm");
  if (!branch || !form) return toast("Филиал не найден");

  const groupId = ensureRosterGroup(branchId);
  const group = byId(db.groups, groupId);
  const trainerId = String(new FormData(form).get("branchTrainer") || "");
  const trainer = byId(db.users, trainerId);
  if (!group || !trainer || trainer.deletedAt || trainer.role !== "coach") return toast("Выберите сотрудника с ролью Тренер");

  assignBranchTrainer(branchId, trainerId);

  const weekOrder = [1, 2, 3, 4, 5, 6, 0];
  const nextSchedules = [];
  for (const day of weekOrder) {
    const activeInput = form.querySelector(`[name="branchScheduleActive_${day}"]`);
    if (!activeInput?.checked) continue;
    const start = form.querySelector(`[name="branchScheduleStart_${day}"]`)?.value || "";
    const end = form.querySelector(`[name="branchScheduleEnd_${day}"]`)?.value || "";
    if (!timeIsValid(start) || !timeIsValid(end)) return toast(`Проверьте время: ${weekdayFullName(day)}`);
    if (start >= end) return toast(`Конец должен быть позже начала: ${weekdayFullName(day)}`);
    nextSchedules.push({
      id: `real_sch_${branchId}_${day}_0`,
      groupId,
      weekday: day,
      startTime: start,
      endTime: end,
      startsAt: TODAY,
      endsAt: null
    });
  }

  db.schedules = db.schedules.filter((schedule) => schedule.groupId !== groupId);
  db.schedules.push(...nextSchedules);
  rebuildBranchTrainingsFromSchedule(branchId);
  audit("Изменен филиал", `${branch.name}: тренер ${userName(trainerId)}, расписание ${nextSchedules.length} дн.`);
  saveData("Филиал сохранен");
  render();
}

function archiveBranch(branchId) {
  const branch = byId(db.branches, branchId);
  if (!branch) return;
  branch.archivedAt = nowText();
  audit("Филиал отправлен в архив", branchName(branchId));
  saveData("Филиал отправлен в архив");
  render();
}

function copyText(text, message) {
  navigator.clipboard?.writeText(text);
  toast(message || "Скопировано");
}

function bindView() {
  root.querySelector("#loginForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    loginUser(form.get("login"), form.get("password"));
  });

  root.querySelectorAll("[data-action]").forEach((el) => {
    if (el.tagName === "SELECT" && el.dataset.action === "status") {
      el.addEventListener("change", () => {
        const student = byId(db.students, el.dataset.id);
        student.status = el.value;
        if (el.value === "INACTIVE") student.inactiveReason ||= "Изменено вручную";
        audit("Изменен статус ученика", studentName(student.id));
        saveData("Статус изменен");
        render();
      });
      return;
    }

    if (el.tagName === "SELECT" && el.dataset.action === "change-trainer") {
      el.addEventListener("change", () => changeTrainingTrainer(el.dataset.id, el.value));
      return;
    }

    el.addEventListener("click", () => runAction(el.dataset.action, el.dataset.id));
  });

  root.querySelectorAll(".segmented button").forEach((button) => {
    button.addEventListener("click", () => {
      const wrap = button.closest(".segmented");
      markAttendance(wrap.dataset.training, wrap.dataset.student, button.dataset.mark);
      render();
    });
  });

  root.querySelectorAll(".single-mark").forEach((button) => {
    button.addEventListener("click", () => {
      const current = db.attendance.find((item) => item.trainingId === button.dataset.training && item.studentId === button.dataset.student)?.mark || "";
      const next = current === "" ? "PRESENT" : current === "PRESENT" ? "TRIAL" : "";
      markAttendance(button.dataset.training, button.dataset.student, next);
      render();
    });
  });

  root.querySelectorAll(".month-mark").forEach((button) => {
    button.addEventListener("click", () => {
      const current = db.attendance.find((item) => item.trainingId === button.dataset.training && item.studentId === button.dataset.student)?.mark || "";
      const next = current === "" ? "PRESENT" : current === "PRESENT" ? "TRIAL" : "";
      markAttendance(button.dataset.training, button.dataset.student, next);
      render();
    });
  });

  root.querySelector("#branchFilter")?.addEventListener("change", (event) => {
    if (db.activeView === "trainings") {
      const filters = trainingPageFilters();
      filters.branchId = event.target.value;
      const branchMonths = AVAILABLE_MONTHS;
      if (!branchMonths.includes(filters.month)) filters.month = CURRENT_MONTH;
      const trainings = db.trainings
        .filter((training) => !training.deletedAt && !training.archivedAt && training.month === filters.month)
        .filter((training) => filters.branchId === "all" || training.branchId === filters.branchId)
        .sort((a, b) => `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`));
      db.selectedTrainingId = trainings[0]?.id || null;
    } else if (db.activeView === "payments") {
      const filters = paymentPageFilters();
      filters.branchId = event.target.value;
      const months = paymentAvailableMonths(filters.branchId);
      if (!months.includes(filters.month)) filters.month = months[0] || CURRENT_MONTH;
    } else if (db.activeView === "finance") {
      const filters = financePageFilters();
      filters.branchId = event.target.value;
    } else if (db.activeView === "coach") {
      const filters = coachPageFilters();
      filters.branchId = event.target.value;
      const trainings = coachTrainingList(filters);
      db.coachSelectedTrainingId = trainings[0]?.id || null;
    } else if (db.activeView === "messages") {
      const filters = messagePageFilters();
      filters.branchId = event.target.value;
    } else {
      db.filters.branchId = event.target.value;
      db.filters.groupId = "all";
    }
    saveData();
    render();
  });
  root.querySelector("#groupFilter")?.addEventListener("change", (event) => {
    db.filters.groupId = event.target.value;
    saveData();
    render();
  });
  root.querySelector("#monthFilter")?.addEventListener("change", (event) => {
    if (db.activeView === "trainings") {
      const filters = trainingPageFilters();
      filters.month = event.target.value;
      const trainings = db.trainings
        .filter((training) => !training.deletedAt && !training.archivedAt && training.month === filters.month)
        .filter((training) => filters.branchId === "all" || training.branchId === filters.branchId)
        .sort((a, b) => `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`));
      db.selectedTrainingId = trainings[0]?.id || null;
    } else if (db.activeView === "payments") {
      const filters = paymentPageFilters();
      const months = paymentAvailableMonths(filters.branchId);
      if (months.includes(event.target.value)) filters.month = event.target.value;
      else filters.month = months[0] || CURRENT_MONTH;
    } else if (db.activeView === "finance") {
      const filters = financePageFilters();
      filters.month = event.target.value;
    } else if (db.activeView === "coach") {
      const filters = coachPageFilters();
      filters.month = event.target.value;
      const trainings = coachTrainingList(filters);
      db.coachSelectedTrainingId = trainings[0]?.id || null;
    } else if (db.activeView === "messages") {
      const filters = messagePageFilters();
      filters.month = event.target.value;
    } else {
      db.filters.month = event.target.value;
    }
    saveData();
    render();
  });
}

function runAction(action, itemId) {
  const actions = {
    "open-student": () => openStudentDialog(),
    "open-student-training": () => openStudentDialog(itemId),
    "create-month": () => createMonth(itemId),
    "open-training": () => {
      const training = byId(db.trainings, itemId);
      if (!training) return toast("Тренировка не найдена");
      const filters = coachPageFilters();
      filters.branchId = training.branchId;
      filters.month = training.month;
      db.coachSelectedTrainingId = training.id;
      db.activeView = "coach";
      saveData();
      render();
      document.querySelector(".coach-attendance-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    "toggle-training-picker": () => { db.showTrainingPicker = !db.showTrainingPicker; saveData(); render(); },
    "toggle-calendar": () => { db.showCalendar = !db.showCalendar; saveData(); render(); },
    "download-sheet": () => downloadExcelSheetByName(itemId),
    "download-attendance-sheet": () => {
      const [month, branchId] = String(itemId).split("|");
      if (!month || !branchId) {
        toast("Не удалось скачать таблицу");
        return;
      }
      downloadAttendanceSheet(month, branchId);
    },
    "open-branch-month": () => {
      const [month, branchId] = String(itemId).split("|");
      if (!month || !branchId) {
        toast("Не удалось открыть месяц");
        return;
      }
      openBranchMonth(branchId, month);
    },
    "select-training": () => {
      const training = byId(db.trainings, itemId);
      db.selectedTrainingId = itemId;
      const filters = db.activeView === "payments" ? paymentPageFilters() : trainingPageFilters();
      filters.branchId = training.branchId;
      filters.month = training.month;
      db.showTrainingPicker = false;
      db.showCalendar = false;
      saveData();
      render();
    },
    "select-coach-training": () => {
      const training = byId(db.trainings, itemId);
      if (!training) return;
      const filters = coachPageFilters();
      filters.branchId = training.branchId;
      filters.month = training.month;
      db.coachSelectedTrainingId = training.id;
      saveData();
      render();
      document.querySelector(".coach-attendance-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    "trial-message": () => copyText(trialMessage(itemId), "Сообщение после пробной скопировано"),
    "payment-message": () => copyText(paymentMessage(itemId), "Сообщение об оплате скопировано"),
    "copy-payment-messages": () => {
      const filters = messagePageFilters();
      const messages = db.charges
        .filter((charge) => !charge.deletedAt && charge.isConfirmed && hasBranchAccess(charge.branchId))
        .filter((charge) => filters.branchId === "all" || charge.branchId === filters.branchId)
        .filter((charge) => charge.month === filters.month)
        .filter((charge) => Math.max(charge.finalAmount - chargePaid(charge.id), 0) > 0)
        .map((charge) => paymentMessage(charge.id))
        .join("\n\n---\n\n");
      copyText(messages, messages ? "Все сообщения об оплате скопированы" : "Нет сообщений об оплате");
    },
    "debt-message": () => copyText(debtMessage(itemId), "Сообщение о долге скопировано"),
    "copy-debt-messages": () => {
      const filters = messagePageFilters();
      const messages = db.debts
        .filter((debt) => !debt.closedAt && hasBranchAccess(debt.branchId))
        .filter((debt) => filters.branchId === "all" || debt.branchId === filters.branchId)
        .filter((debt) => debt.month === filters.month)
        .map((debt) => debtMessage(debt.id))
        .join("\n\n---\n\n");
      copyText(messages, messages ? "Все сообщения о долгах скопированы" : "Долговых сообщений нет");
    },
    "export-excel": () => downloadExcelWorkbook(),
    "delete-user-account": () => deleteUserAccount(itemId),
    "set-settings-tab": () => {
      db.settingsTab = ["general", "schedule", "users"].includes(itemId) ? itemId : "general";
      saveData();
      render();
    },
    "stock-reset": () => stockReset(),
    "inactive": () => {
      const student = byId(db.students, itemId);
      student.status = "INACTIVE";
      student.inactiveReason = "Отказался продолжать после пробной";
      audit("Пробный переведен в неактивные вручную", studentName(itemId));
      saveData("Статус изменен");
      render();
    },
    "edit-student": () => openStudentDialog(null, itemId),
    "archive-student": () => archiveStudent(itemId),
    "delete-student": () => deleteEntity("student", itemId),
    "select-branch": () => {
      db.selectedBranchId = itemId;
      saveData();
      render();
      document.querySelector(".branch-detail-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    "filter-branch": () => { db.filters.branchId = itemId; db.filters.groupId = "all"; db.activeView = "students"; saveData(); render(); },
    "filter-group": () => { db.filters.groupId = itemId; db.activeView = "students"; saveData(); render(); },
    "group-trainings": () => { db.filters.groupId = itemId; db.activeView = "trainings"; saveData(); render(); },
    "archive-branch": () => archiveBranch(itemId),
    "add-branch": () => addBranch(),
    "add-group": () => addGroup(),
    "add-training": () => addTraining(),
    "open-extra-training": () => openExtraTrainingDialog(itemId),
    "save-branch-details": () => saveBranchDetails(itemId),
    "toggle-assistant": () => toggleAssistant(itemId),
    "finish-training": () => {
      const training = byId(db.trainings, itemId);
      if (!training || !hasBranchAccess(training.branchId)) return toast("Нет доступа к тренировке");
      training.status = "DONE";
      audit("Тренировка завершена", itemId);
      saveData("Тренировка завершена");
      render();
    },
    "cancel-training": () => {
      const training = byId(db.trainings, itemId);
      if (!training || !hasBranchAccess(training.branchId)) return toast("Нет доступа к тренировке");
      training.status = "CANCELLED";
      audit("Тренировка отменена", itemId);
      saveData("Тренировка отменена");
      render();
    },
    "delete-coach-training": () => deleteCoachTraining(itemId),
    "delete-training": () => deleteEntity("training", itemId),
    "generate-charges": () => generateChargesBase(),
    "generate-base-charges": () => generateChargesBase(),
    "recalculate-charges": () => recalculateCharges(),
    "confirm-charge": () => confirmCharge(itemId),
    "confirm-charges": () => confirmChargesForPaymentPage(),
    "add-payment": () => addPayment(itemId),
    "delete-charge": () => deleteEntity("charge", itemId),
    "copy-parent-table": () => copyParentTable(),
    "download-branch-workbook": () => downloadBranchWorkbook(itemId),
    "check-closing": () => {
      const report = closingReport(itemId, db.filters.month);
      toast(report.blocked ? "Есть блокирующая ошибка: нет посещаемости" : "Проверка пройдена");
    },
    "close-month": () => closeMonth(itemId),
    "reopen-month": () => reopenMonth(itemId),
    "save-settings": () => saveSettings(),
    "add-user-account": () => addUserAccount(),
    "make-coach": () => toast("Роли меняются только владельцем в настройках"),
    "restore-archive-student": () => { byId(db.students, itemId).archivedAt = null; saveData("Ученик восстановлен"); render(); },
    "restore-archive-branch": () => { byId(db.branches, itemId).archivedAt = null; saveData("Филиал восстановлен"); render(); },
    "restore-deleted": () => restoreDeleted(itemId),
    "purge-deleted": () => purgeDeleted(itemId),
    "purge-deleted-all": () => purgeAllDeleted(),
    "reset-filters": () => {
      db.filters = { branchId: "all", groupId: "all", month: CURRENT_MONTH };
      db.trainingFilters = { branchId: "all", month: CURRENT_MONTH };
      db.paymentFilters = { branchId: "all", month: CURRENT_MONTH };
      saveData();
      render();
    },
  };
  actions[action]?.();
}

function openStudentDialog(trainingId = null, studentId = null) {
  populateStudentForm(trainingId, studentId);
  studentForm.dataset.training = trainingId || "";
  studentForm.dataset.editing = studentId || "";
  dialog.showModal();
}

function closeStudentDialog() {
  studentForm.reset();
  studentForm.dataset.training = "";
  studentForm.dataset.editing = "";
  dialog.close();
}

function populateStudentForm(trainingId = null, studentId = null) {
  const branchSelect = document.getElementById("studentBranch");
  const groupSelect = document.getElementById("studentGroup");
  const training = trainingId ? byId(db.trainings, trainingId) : null;
  const student = studentId ? byId(db.students, studentId) : null;
  const parent = student ? parentForStudent(student.id) : null;
  const enrollment = student ? activeEnrollments(student.id).find((item) => item.isPrimary) || activeEnrollments(student.id)[0] : null;
  const title = studentForm.querySelector(".modal-head h2");
  const eyebrow = studentForm.querySelector(".modal-head .eyebrow");
  if (title) title.textContent = student ? "Редактировать ученика" : "Добавить ученика";
  if (eyebrow) eyebrow.textContent = student ? "Карточка ученика" : "Новая карточка";

  branchSelect.innerHTML = activeBranches().map((branch) => `<option value="${escapeHtml(branch.id)}">${escapeHtml(branch.name)}</option>`).join("");
  branchSelect.value = enrollment?.branchId || training?.branchId || activeBranches()[0]?.id || "";

  const fillGroups = () => {
    groupSelect.innerHTML = activeGroups()
      .filter((group) => group.branchId === branchSelect.value)
      .map((group) => `<option value="${escapeHtml(group.id)}">${escapeHtml(group.name)}</option>`).join("");
    if (student?.primaryGroupId && Array.from(groupSelect.options).some((option) => option.value === student.primaryGroupId)) groupSelect.value = student.primaryGroupId;
    else if (training) groupSelect.value = training.groupId;
  };
  branchSelect.onchange = fillGroups;
  fillGroups();

  studentForm.querySelector("[name=firstName]").value = student ? student.firstName : "";
  studentForm.querySelector("[name=lastName]").value = student ? student.lastName : "";
  studentForm.querySelector("[name=age]").value = student ? Math.max(3, 2026 - student.birthYear) : 8;
  studentForm.querySelector("[name=parent]").value = parent?.name || "";
  studentForm.querySelector("[name=phone]").value = parent?.phone || "";
  studentForm.querySelector("[name=parentVk]").value = parent?.vk || "";
  studentForm.querySelector("[name=source]").value = student?.source || "школа";
  studentForm.querySelector("[name=status]").value = student ? labels[student.status] : training ? "Пробный" : "Активный";
  studentForm.querySelector("[name=comment]").value = student?.note || "";
}

function addStudentFromForm(event) {
  if (event.submitter?.value === "cancel") {
    closeStudentDialog();
    return;
  }
  event.preventDefault();
  const form = new FormData(studentForm);
  const firstName = cleanText(form.get("firstName"), 60);
  const lastName = cleanText(form.get("lastName"), 80);
  const displayName = [firstName, lastName].filter(Boolean).join(" ").trim();
  const age = Number(form.get("age"));
  const parentName = cleanText(form.get("parent"), 120);
  const phone = cleanText(form.get("phone"), 40);
  const parentVk = cleanText(form.get("parentVk"), 160);
  if (!firstName || !lastName || !age) return toast("Заполните имя, фамилию и возраст");
  if (studentForm.dataset.editing) {
    updateStudentFromForm(studentForm.dataset.editing, form);
    return;
  }
  const duplicate = phone && db.parents.some((parent) => parent.phone === phone) && db.students.some((student) => studentName(student.id).toLowerCase() === displayName.toLowerCase() && !student.deletedAt);
  if (duplicate && !confirm("Похожий ученик уже есть. Все равно создать карточку?")) return;

  const groupId = form.get("group");
  const group = byId(db.groups, groupId);
  const studentId = id("st");
  const parentId = id("par");
  const status = form.get("status") === "Пробный" ? "TRIAL" : form.get("status") === "Неактивный" ? "INACTIVE" : "ACTIVE";
  const training = studentForm.dataset.training ? byId(db.trainings, studentForm.dataset.training) : null;
  const startDate = training?.date || TODAY;
  db.students.push({
    id: studentId,
    firstName,
    lastName,
    birthYear: 2026 - age,
    status,
    primaryGroupId: groupId,
    joinedAt: startDate,
    trialAt: status === "TRIAL" ? startDate : null,
    activatedAt: status === "ACTIVE" ? startDate : null,
    inactiveReason: "",
    archivedAt: null,
    deletedAt: null,
    note: cleanText(form.get("comment"), 500),
    source: cleanText(form.get("source"), 80),
    vk: ""
  });
  db.parents.push({ id: parentId, name: parentName || "Родитель не указан", phone, vk: parentVk, studentIds: [studentId] });
  db.enrollments.push({ id: id("en"), studentId, branchId: group.branchId, groupId, startsAt: startDate, endsAt: null, isPrimary: true });
  if (training && training.groupId === groupId) {
    db.attendance.push({ id: id("att"), trainingId: training.id, studentId, mark: "TRIAL", priceAtAttendance: 0 });
    training.status = "DONE";
  }
  audit("Создан ученик", studentName(studentId));
  saveData("Ученик добавлен");
  studentForm.reset();
  dialog.close();
  render();
}

function updateStudentFromForm(studentId, form) {
  const student = byId(db.students, studentId);
  if (!student) return toast("Ученик не найден");

  const firstName = cleanText(form.get("firstName"), 60);
  const lastName = cleanText(form.get("lastName"), 80);
  const age = Number(form.get("age"));
  const parentName = cleanText(form.get("parent"), 120);
  const phone = cleanText(form.get("phone"), 40);
  const parentVk = cleanText(form.get("parentVk"), 160);
  const branchId = String(form.get("branch"));
  const groupId = String(form.get("group"));
  const status = form.get("status") === "Пробный" ? "TRIAL" : form.get("status") === "Неактивный" ? "INACTIVE" : "ACTIVE";
  const group = byId(db.groups, groupId);

  if (!firstName || !lastName || !age || !group) return toast("Заполните имя, фамилию и возраст");

  student.firstName = firstName;
  student.lastName = lastName;
  student.birthYear = 2026 - age;
  student.status = status;
  student.primaryGroupId = groupId;
  student.note = cleanText(form.get("comment"), 500);
  student.source = cleanText(form.get("source"), 80);
  if (status === "INACTIVE") student.inactiveReason ||= "Изменено вручную";
  if (status === "ACTIVE") student.activatedAt ||= TODAY;
  if (status === "TRIAL") student.trialAt ||= TODAY;

  let parent = parentForStudent(studentId);
  if (!parent.id) {
    parent = { id: id("par"), name: parentName || "Родитель не указан", phone, vk: parentVk, studentIds: [studentId] };
    db.parents.push(parent);
  } else {
    parent.name = parentName || "Родитель не указан";
    parent.phone = phone;
    parent.vk = parentVk;
    if (!parent.studentIds.includes(studentId)) parent.studentIds.push(studentId);
  }

  activeEnrollments(studentId).forEach((enrollment) => {
    if (enrollment.isPrimary && (enrollment.branchId !== branchId || enrollment.groupId !== groupId)) {
      enrollment.endsAt = TODAY;
    }
  });

  const currentPrimary = activeEnrollments(studentId).find((enrollment) => enrollment.isPrimary);
  if (!currentPrimary || currentPrimary.branchId !== branchId || currentPrimary.groupId !== groupId) {
    db.enrollments.push({
      id: id("en"),
      studentId,
      branchId,
      groupId,
      startsAt: TODAY,
      endsAt: null,
      isPrimary: true
    });
  } else {
    currentPrimary.branchId = branchId;
    currentPrimary.groupId = groupId;
  }

  audit("Отредактирована карточка ученика", studentName(studentId));
  saveData("Карточка ученика сохранена");
  studentForm.reset();
  studentForm.dataset.editing = "";
  studentForm.dataset.training = "";
  dialog.close();
  render();
}

function transferStudent(studentId) {
  const groups = activeGroups();
  const current = byId(db.students, studentId);
  const nextGroupId = prompt(`Введите ID новой группы:\n${groups.map((group) => `${group.id}: ${branchName(group.branchId)} / ${group.name}`).join("\n")}`, current.primaryGroupId);
  const group = byId(db.groups, nextGroupId);
  if (!group) return toast("Группа не найдена");
  activeEnrollments(studentId).forEach((enrollment) => {
    if (enrollment.isPrimary) enrollment.endsAt = TODAY;
  });
  db.enrollments.push({ id: id("en"), studentId, branchId: group.branchId, groupId: group.id, startsAt: TODAY, endsAt: null, isPrimary: true });
  current.primaryGroupId = group.id;
  audit("Ученик переведен", `${studentName(studentId)} → ${group.name}`);
  saveData("Ученик переведен без создания дубля");
  render();
}

function showStudentCard(studentId) {
  const student = byId(db.students, studentId);
  const parent = parentForStudent(studentId);
  const fin = studentFinance(studentId);
  const att = studentAttendanceSummary(studentId);
  const text = `${studentName(studentId)}\nСтатус: ${labels[student.status]}\nРодитель: ${parent.name}, ${parent.phone}\nПосещаемость: ${att.visited}/${att.possible} (${att.percent}%)\nК оплате: ${money(fin.toPay)}\nДолг: ${money(fin.debt)}\nПеренос/переплата: ${money(fin.credit)}\nКомментарий: ${student.note || "нет"}`;
  alert(text);
}

function addBranch() {
  const name = cleanText(prompt("Название филиала"), 120);
  if (!name) return;
  const branch = { id: id("br"), name, address: "Указать адрес", isActive: true, archivedAt: null, deletedAt: null };
  db.branches.push(branch);
  currentUser().branchIds.push(branch.id);
  audit("Создан филиал", name);
  saveData("Филиал добавлен");
  render();
}

function addGroup() {
  const branch = activeBranches()[0];
  if (!branch) return;
  const name = cleanText(prompt("Название группы"), 120);
  if (!name) return;
  const group = { id: id("gr"), branchId: branch.id, name, ageRange: "указать", trainerId: currentUser().id, assistantId: null, isActive: true, archivedAt: null, deletedAt: null };
  db.groups.push(group);
  currentUser().groupIds.push(group.id);
  audit("Создана группа", name);
  saveData("Группа добавлена");
  render();
}

function addTraining() {
  const group = db.filters.groupId !== "all" ? byId(db.groups, db.filters.groupId) : activeGroups()[0];
  if (!group) return toast("Нет группы для тренировки");
  db.trainings.push({ id: id("tr"), date: TODAY, startTime: "19:00", endTime: "20:00", month: CURRENT_MONTH, branchId: group.branchId, groupId: group.id, trainerId: group.trainerId, assistantId: null, assistantConfirmed: false, status: "PLANNED", type: "EXTRA", originalTrainingId: null, deletedAt: null, archivedAt: null });
  audit("Создана дополнительная тренировка", group.name);
  saveData("Тренировка добавлена");
  render();
}

function deleteCoachTraining(trainingId) {
  const training = byId(db.trainings, trainingId);
  if (!training || training.deletedAt) return toast("Тренировка не найдена");
  if (!hasBranchAccess(training.branchId)) return toast("Нет доступа к тренировке");
  const title = `${formatDate(training.date)} ${training.startTime}-${training.endTime} · ${branchName(training.branchId)}`;
  if (!confirm(`Удалить тренировку: ${title}?`)) return;
  training.deletedAt = nowText();
  db.attendance = db.attendance.filter((item) => item.trainingId !== training.id);
  if (db.coachSelectedTrainingId === training.id) db.coachSelectedTrainingId = null;
  if (db.selectedTrainingId === training.id) db.selectedTrainingId = null;
  db.deleted.unshift({ id: id("del"), type: "training", typeLabel: "Тренировка", itemId: training.id, title, deletedAt: nowText(), deletedBy: currentUser().id });
  audit("Удалена тренировка", title);
  saveData("Тренировка удалена");
  render();
}

function addMinutesToTime(time, minutes) {
  if (!timeIsValid(time)) return "20:00";
  const [hours, mins] = time.split(":").map(Number);
  const total = Math.min(23 * 60 + 59, hours * 60 + mins + minutes);
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

function openExtraTrainingDialog(trainingId) {
  const baseTraining = byId(db.trainings, trainingId);
  if (!baseTraining || !hasBranchAccess(baseTraining.branchId)) return toast("Нет доступа к тренировке");
  if (!extraTrainingDialog || !extraTrainingForm) return toast("Окно дополнительной тренировки не найдено");
  extraTrainingForm.dataset.baseTraining = trainingId;
  extraTrainingForm.querySelector("[name=date]").value = baseTraining.date || TODAY;
  extraTrainingForm.querySelector("[name=startTime]").value = baseTraining.startTime || "19:00";
  extraTrainingForm.querySelector("[name=endTime]").value = baseTraining.endTime || addMinutesToTime(baseTraining.startTime || "19:00", 60);
  extraTrainingDialog.showModal();
}

function saveExtraTrainingFromForm(event) {
  event.preventDefault();
  if (event.submitter?.value === "cancel") {
    extraTrainingDialog.close();
    return;
  }
  const baseTraining = byId(db.trainings, extraTrainingForm.dataset.baseTraining);
  if (!baseTraining || !hasBranchAccess(baseTraining.branchId)) return toast("Нет доступа к тренировке");
  const form = new FormData(extraTrainingForm);
  const date = String(form.get("date") || "");
  const startTime = String(form.get("startTime") || "");
  const endTime = String(form.get("endTime") || "");
  const month = date.slice(0, 7);
  if (!AVAILABLE_MONTHS.includes(month)) return toast("Выберите месяц из календаря CRM");
  if (!timeIsValid(startTime) || !timeIsValid(endTime)) return toast("Проверьте время тренировки");
  if (startTime >= endTime) return toast("Конец тренировки должен быть позже начала");
  const group = byId(db.groups, baseTraining.groupId) || byId(db.groups, ensureRosterGroup(baseTraining.branchId));
  if (!group) return toast("Нет группы для тренировки");

  const training = {
    id: id("tr"),
    date,
    startTime,
    endTime,
    month,
    branchId: baseTraining.branchId,
    groupId: group.id,
    trainerId: currentUser().id,
    assistantId: null,
    assistantConfirmed: false,
    status: "PLANNED",
    type: "EXTRA",
    originalTrainingId: baseTraining.id,
    deletedAt: null,
    archivedAt: null
  };
  db.trainings.push(training);
  db.coachFilters = { branchId: training.branchId, month };
  db.coachSelectedTrainingId = training.id;
  audit("Создана дополнительная тренировка тренером", `${branchName(training.branchId)} ${formatDate(date)} ${startTime}-${endTime}`);
  extraTrainingDialog.close();
  extraTrainingForm.reset();
  saveData("Дополнительная тренировка добавлена");
  render();
}

function changeTrainingTrainer(trainingId, trainerId) {
  const training = byId(db.trainings, trainingId);
  if (!training || !trainerId || training.trainerId === trainerId) return;
  if (!hasBranchAccess(training.branchId)) return toast("Нет доступа к тренировке");
  const trainer = byId(db.users, trainerId);
  if (!trainer || trainer.deletedAt || trainer.role !== "coach") return toast("Назначить можно только сотрудника с ролью Тренер");
  const oldTrainer = training.trainerId;
  training.trainerId = trainerId;
  if (training.assistantId === trainerId) {
    training.assistantId = null;
    training.assistantConfirmed = false;
  }
  audit("Заменен тренер на тренировке", `${formatDate(training.date)}: ${userName(oldTrainer)} -> ${userName(trainerId)}`);
  saveData("Тренер заменен");
  render();
}

function toggleAssistant(trainingId) {
  const training = byId(db.trainings, trainingId);
  if (!training) return;
  if (!hasBranchAccess(training.branchId)) return toast("Нет доступа к тренировке");
  assistantForm.dataset.training = trainingId;
  const trainers = activeCoachUsers().filter((user) => user.id !== training.trainerId);
  assistantTrainerSelect.innerHTML = trainers.map((user) => `<option value="${escapeHtml(user.id)}" ${user.id === training.assistantId ? "selected" : ""}>${escapeHtml(user.name)} · ${escapeHtml(labels[user.role])}</option>`).join("");
  if (!trainers.length) return toast("Нет доступных сотрудников с ролью Тренер");
  assistantDialog.showModal();
}

function saveAssistantFromForm(event) {
  const trainingId = assistantForm.dataset.training;
  const training = byId(db.trainings, trainingId);
  if (!training) return;

  if (event.submitter?.value === "cancel") return;
  event.preventDefault();

  if (event.submitter?.value === "remove") {
    training.assistantId = null;
    training.assistantConfirmed = false;
    audit("Помощник убран с тренировки", trainingId);
    saveData("Помощник убран");
  } else {
    const assistantId = assistantTrainerSelect.value;
    const assistant = byId(db.users, assistantId);
    if (!assistant || assistant.deletedAt || assistant.role !== "coach") return toast("Помощником можно выбрать только сотрудника с ролью Тренер");
    training.assistantId = assistantId;
    training.assistantConfirmed = true;
    audit("Подтвержден помощник на тренировке", `${trainingId}: ${userName(training.assistantId)}`);
    saveData("Помощник выбран");
  }

  assistantDialog.close();
  render();
}

function copyParentTable() {
  const lines = db.charges
    .filter((charge) => !charge.deletedAt && charge.isConfirmed)
    .map((charge) => `${studentName(charge.studentId)} | ${formatMonth(charge.month)} | к оплате ${money(Math.max(charge.finalAmount - chargePaid(charge.id), 0))} | срок ${formatDate(charge.dueDate)} | ${labels[charge.status]}`);
  copyText(lines.join("\n"), "Таблица для родителей скопирована");
}

function reopenMonth(branchId) {
  const month = db.filters.month;
  const closing = db.monthClosings.find((item) => item.branchId === branchId && item.month === month);
  if (!closing) return;
  closing.status = "OPEN";
  closing.reopenedAt = nowText();
  closing.reopenedBy = currentUser().id;
  audit("Месяц открыт повторно", `${branchName(branchId)} ${month}`);
  saveData("Месяц открыт повторно");
  render();
}

async function saveSettings() {
  if (!isOwner()) return toast("Настройки и роли может менять только владелец");
  const priceInput = document.getElementById("priceInput");
  const dueInput = document.getElementById("dueInput");
  if (priceInput || dueInput) {
    const nextPrice = Number(priceInput?.value);
    const nextDueDay = Number(dueInput?.value);
    if (!Number.isFinite(nextPrice) || nextPrice < 0 || nextPrice > 10000) return toast("Проверьте стоимость тренировки");
    if (!Number.isInteger(nextDueDay) || nextDueDay < 1 || nextDueDay > 28) return toast("Срок оплаты должен быть от 1 до 28");
    db.settings.pricePerTraining = nextPrice;
    db.settings.dueDay = nextDueDay;
  }
  const usersForm = document.getElementById("usersSettingsForm");
  const activeBranchIds = allActiveBranchIds();
  if (usersForm) {
    const selectedOwnerCount = db.users.filter((user) => {
      const roleInput = usersForm.querySelector(`[name="userRole_${user.id}"]`);
      return !user.deletedAt && (roleInput?.value || user.role) === "owner";
    }).length;
    if (selectedOwnerCount < 1) return toast("Должен остаться хотя бы один владелец");

    for (const user of db.users) {
      const nameInput = usersForm.querySelector(`[name="userName_${user.id}"]`);
      const loginInput = usersForm.querySelector(`[name="userLogin_${user.id}"]`);
      const passwordInput = usersForm.querySelector(`[name="userPassword_${user.id}"]`);
      const roleInput = usersForm.querySelector(`[name="userRole_${user.id}"]`);
      const branchInputs = Array.from(usersForm.querySelectorAll(`[name="userBranch_${user.id}"]`));
      const nextName = cleanText(nameInput?.value, 120);
      const nextLogin = normalizeLogin(cleanText(loginInput?.value, 80));
      const nextPassword = String(passwordInput?.value || "").trim();
      const nextRole = roleInput?.value === "coach" ? "coach" : "owner";
      const nextBranchIds = branchInputs.filter((input) => input.checked).map((input) => input.value);
      if (nextLogin && !isValidLoginAlias(nextLogin)) {
        return toast("Логин: латинские буквы, цифры, точка, дефис или _");
      }
      if (nextName) user.name = nextName;
      if (nextLogin && !db.users.some((item) => item.id !== user.id && item.login === nextLogin)) user.login = nextLogin;
      if (nextPassword) await setUserPassword(user, nextPassword);
      user.role = nextRole;
      setUserBranchAccess(user, nextRole === "owner" ? activeBranchIds : nextBranchIds);
    }
    syncBranchTrainersFromCoachAccess();
  }
  const scheduleForm = document.getElementById("scheduleSettingsForm");
  const changedScheduleBranches = [];
  if (scheduleForm) {
    const weekOrder = [1, 2, 3, 4, 5, 6, 0];
    for (const branch of db.branches.filter((item) => !item.deletedAt && !item.archivedAt && item.isActive)) {
      const groupId = ensureRosterGroup(branch.id);
      const nextSchedules = [];
      for (const day of weekOrder) {
        const activeInput = scheduleForm.querySelector(`[name="scheduleActive_${branch.id}_${day}"]`);
        if (!activeInput?.checked) continue;
        const start = scheduleForm.querySelector(`[name="scheduleStart_${branch.id}_${day}"]`)?.value || "";
        const end = scheduleForm.querySelector(`[name="scheduleEnd_${branch.id}_${day}"]`)?.value || "";
        if (!timeIsValid(start) || !timeIsValid(end)) {
          return toast(`Проверьте время: ${branch.name}, ${weekdayFullName(day)}`);
        }
        if (start >= end) {
          return toast(`Конец должен быть позже начала: ${branch.name}, ${weekdayFullName(day)}`);
        }
        nextSchedules.push({
          id: `real_sch_${branch.id}_${day}_0`,
          groupId,
          weekday: day,
          startTime: start,
          endTime: end,
          startsAt: "2026-07-01",
          endsAt: null
        });
      }

      const currentSchedules = db.schedules
        .filter((schedule) => schedule.groupId === groupId && !schedule.endsAt)
        .map((schedule) => `${schedule.weekday}|${schedule.startTime}|${schedule.endTime}`)
        .sort()
        .join(";");
      const nextSignature = nextSchedules
        .map((schedule) => `${schedule.weekday}|${schedule.startTime}|${schedule.endTime}`)
        .sort()
        .join(";");

      if (currentSchedules !== nextSignature) {
        db.schedules = db.schedules.filter((schedule) => schedule.groupId !== groupId);
        db.schedules.push(...nextSchedules);
        changedScheduleBranches.push(branch.id);
      }
    }
  }
  changedScheduleBranches.forEach((branchId) => rebuildBranchTrainingsFromSchedule(branchId));
  audit("Изменены настройки CRM", "стоимость, роли и филиалы пользователей");
  saveData(changedScheduleBranches.length ? "Настройки и расписание сохранены" : "Настройки сохранены. Пользователи и роли обновлены.");
  render();
}

async function addUserAccount() {
  if (!isOwner()) return toast("Добавлять роли может только владелец");
  const login = generateLogin();
  const password = generatePassword();
  const user = {
    id: id("u"),
    name: "Новый сотрудник",
    login,
    role: "coach",
    branchIds: [],
    groupIds: []
  };
  await setUserPassword(user, password);
  db.users.push(user);
  audit("Добавлена учетная запись", login);
  saveData(`Создан логин ${login}, пароль ${password}`);
  render();
}

function deleteUserAccount(userId) {
  if (!isOwner()) return toast("Удалять сотрудников может только владелец");
  const user = byId(db.users, userId);
  if (!user || user.deletedAt) return;
  if (user.id === currentUser().id) return toast("Нельзя удалить свою учетную запись");
  const activeOwners = db.users.filter((item) => !item.deletedAt && item.role === "owner");
  if (user.role === "owner" && activeOwners.length <= 1) return toast("Должен остаться хотя бы один владелец");
  if (!confirm(`Удалить сотрудника ${user.name}?`)) return;

  user.deletedAt = nowText();
  user.branchIds = [];
  user.groupIds = [];
  db.security ||= { loginFailures: {}, sessions: {} };
  db.security.sessions ||= {};
  for (const [token, session] of Object.entries(db.security.sessions)) {
    if (session.userId === user.id) delete db.security.sessions[token];
  }
  audit("Удален сотрудник", user.login || user.name);
  saveData("Сотрудник удален");
  render();
}

function restoreDeleted(deletedId) {
  const item = byId(db.deleted, deletedId);
  if (!item) return;
  const map = { student: db.students, branch: db.branches, training: db.trainings, charge: db.charges };
  const entity = byId(map[item.type], item.itemId);
  if (entity) entity.deletedAt = null;
  db.deleted = db.deleted.filter((deleted) => deleted.id !== deletedId);
  audit("Восстановлена удаленная запись", item.title);
  saveData("Запись восстановлена");
  render();
}

function purgeDeleted(deletedId) {
  const item = byId(db.deleted, deletedId);
  if (!item || !confirm(`Удалить навсегда: ${item.title}?`)) return;
  db.deleted = db.deleted.filter((deleted) => deleted.id !== deletedId);
  audit("Окончательно удалена запись", item.title);
  saveData("Запись удалена окончательно");
  render();
}

function purgeAllDeleted() {
  if (!db.deleted.length) return toast("Список удаленных уже пуст");
  if (!confirm(`Удалить навсегда все удаленные записи (${db.deleted.length})?`)) return;
  const count = db.deleted.length;
  db.deleted = [];
  audit("Окончательно удалены все записи", `удалено ${count}`);
  saveData("Все удаленные записи очищены");
  render();
}

navList.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.dataset.view) {
    setView(button.dataset.view);
    setMobileNav(false);
    return;
  }
  if (button.dataset.action) {
    runAction(button.dataset.action, button.dataset.id);
    setMobileNav(false);
  }
});

mobileMenuButton?.addEventListener("click", () => {
  setMobileNav(!document.body.classList.contains("mobile-nav-open"));
});

mobileNavBackdrop?.addEventListener("click", () => setMobileNav(false));
mobileNavCloseButton?.addEventListener("click", () => setMobileNav(false));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMobileNav(false);
});

globalSearch?.addEventListener("input", (event) => {
  db.query = event.target.value;
  if (!["students", "branches", "groups", "trainings"].includes(db.activeView)) db.activeView = "students";
  saveData();
  render();
});

document.getElementById("quickAddBtn")?.addEventListener("click", () => openStudentDialog());
document.getElementById("exportBtn")?.addEventListener("click", () => downloadExcelWorkbook());
studentForm.querySelectorAll("[data-student-cancel]").forEach((button) => {
  button.addEventListener("click", closeStudentDialog);
});
studentForm.addEventListener("submit", addStudentFromForm);
assistantForm.addEventListener("submit", saveAssistantFromForm);
extraTrainingForm?.addEventListener("submit", saveExtraTrainingFromForm);

initializeApp();


