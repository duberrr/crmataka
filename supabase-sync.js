(function () {
  const CONFIG = window.ATAKA_SUPABASE || {};
  const TOKEN_KEY = "ataka-crm-supabase-token";
  const REFRESH_KEY = "ataka-crm-supabase-refresh";
  const LAST_REMOTE_KEY = "ataka-crm-last-remote-at";
  const PART_PREFIX = "part:";
  const META_PART = "meta";
  const STATE_PARTS = [
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
    META_PART
  ];
  const ARRAY_PARTS = new Set([
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
    "auditLog"
  ]);
  const META_KEYS = ["scheduleVersion", "realRosterVersion", "assistantRuleVersion", "historyResetVersion"];
  let saving = false;
  let pendingState = null;
  let saveTimer = null;
  let lastSavedParts = {};
  let needsPartMigration = false;

  function cleanUrl() {
    return String(CONFIG.url || "").replace(/\/+$/, "");
  }

  function isReady() {
    return Boolean(cleanUrl() && CONFIG.anonKey);
  }

  function token() {
    return localStorage.getItem(TOKEN_KEY) || "";
  }

  function authHeaders() {
    return {
      "apikey": CONFIG.anonKey,
      "Authorization": `Bearer ${token() || CONFIG.anonKey}`,
      "Content-Type": "application/json"
    };
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value ?? null));
  }

  function stable(value) {
    return JSON.stringify(value ?? null);
  }

  function partRowId(part) {
    return `${PART_PREFIX}${part}`;
  }

  function partFromRowId(rowId) {
    return String(rowId || "").startsWith(PART_PREFIX) ? String(rowId).slice(PART_PREFIX.length) : "";
  }

  async function request(path, options = {}) {
    if (!isReady()) throw new Error("Supabase не настроен");
    const response = await fetch(`${cleanUrl()}${path}`, {
      ...options,
      headers: { ...authHeaders(), ...(options.headers || {}) }
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `Supabase error ${response.status}`);
    }
    if (response.status === 204) return null;
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }

  async function signIn(login, password) {
    if (!isReady()) return null;
    const response = await fetch(`${cleanUrl()}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: {
        "apikey": CONFIG.anonKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email: login, password })
    });
    if (!response.ok) return null;
    const data = await response.json();
    localStorage.setItem(TOKEN_KEY, data.access_token);
    if (data.refresh_token) localStorage.setItem(REFRESH_KEY, data.refresh_token);
    return data.user;
  }

  async function signOut() {
    if (isReady() && token()) {
      try {
        await fetch(`${cleanUrl()}/auth/v1/logout`, {
          method: "POST",
          headers: authHeaders()
        });
      } catch {}
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
  }

  function isSignedIn() {
    return Boolean(token());
  }

  function splitState(state) {
    const parts = {};
    STATE_PARTS.forEach((part) => {
      if (part === META_PART) {
        const meta = {};
        META_KEYS.forEach((key) => {
          if (Object.prototype.hasOwnProperty.call(state, key)) meta[key] = state[key];
        });
        parts[part] = meta;
        return;
      }
      parts[part] = clone(state?.[part]);
    });
    return parts;
  }

  function joinParts(parts) {
    const state = {};
    Object.entries(parts).forEach(([part, data]) => {
      if (part === META_PART) {
        Object.assign(state, data || {});
        return;
      }
      state[part] = clone(data);
    });
    return state;
  }

  function rememberParts(parts) {
    lastSavedParts = {};
    Object.entries(parts).forEach(([part, data]) => {
      lastSavedParts[part] = clone(data);
    });
  }

  async function loadState() {
    if (!isReady() || !isSignedIn()) return null;
    const rows = await request("/rest/v1/app_state?select=id,data,updated_at", {
      headers: { "Accept": "application/json" }
    });
    if (!Array.isArray(rows) || !rows.length) return null;

    const partRows = rows.filter((row) => partFromRowId(row.id));
    if (partRows.length) {
      const parts = {};
      partRows.forEach((row) => {
        const part = partFromRowId(row.id);
        if (STATE_PARTS.includes(part)) parts[part] = row.data;
      });
      const newest = rows
        .map((row) => row.updated_at || "")
        .sort()
        .pop() || "";
      localStorage.setItem(LAST_REMOTE_KEY, newest);
      rememberParts(parts);
      needsPartMigration = false;
      return joinParts(parts);
    }

    const main = rows.find((row) => row.id === "main");
    if (!main?.data || !Object.keys(main.data).length) return null;
    localStorage.setItem(LAST_REMOTE_KEY, main.updated_at || "");
    const parts = splitState(main.data);
    rememberParts(parts);
    needsPartMigration = false;
    try {
      for (const part of STATE_PARTS) {
        await upsertPart(part, parts[part]);
        lastSavedParts[part] = clone(parts[part]);
      }
    } catch (error) {
      console.error("Не удалось перенести CRM на раздельное хранение", error);
      needsPartMigration = true;
    }
    return main.data;
  }

  async function loadPart(part) {
    const rows = await request(`/rest/v1/app_state?id=eq.${encodeURIComponent(partRowId(part))}&select=data`, {
      headers: { "Accept": "application/json" }
    });
    return Array.isArray(rows) && rows[0] ? rows[0].data : undefined;
  }

  function mergeArrayPart(baseValue, currentValue, remoteValue) {
    const base = Array.isArray(baseValue) ? baseValue : [];
    const current = Array.isArray(currentValue) ? currentValue : [];
    const remote = Array.isArray(remoteValue) ? remoteValue : [];
    const baseById = new Map(base.filter((item) => item?.id).map((item) => [item.id, item]));
    const currentById = new Map(current.filter((item) => item?.id).map((item) => [item.id, item]));
    const mergedById = new Map(remote.filter((item) => item?.id).map((item) => [item.id, item]));

    currentById.forEach((item, itemId) => {
      const baseItem = baseById.get(itemId);
      if (!baseItem || stable(baseItem) !== stable(item)) {
        mergedById.set(itemId, item);
      }
    });

    baseById.forEach((_, itemId) => {
      if (!currentById.has(itemId)) mergedById.delete(itemId);
    });

    return Array.from(mergedById.values());
  }

  async function upsertPart(part, data) {
    await request("/rest/v1/app_state?on_conflict=id", {
      method: "POST",
      headers: { "Prefer": "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({
        id: partRowId(part),
        data,
        updated_at: new Date().toISOString()
      })
    });
  }

  async function saveStateNow(state) {
    if (!isReady() || !isSignedIn() || saving) {
      pendingState = state;
      return;
    }
    saving = true;
    try {
      const parts = splitState(state);
      const changedParts = STATE_PARTS.filter((part) => needsPartMigration || stable(parts[part]) !== stable(lastSavedParts[part]));

      for (const part of changedParts) {
        let data = parts[part];
        if (!needsPartMigration && ARRAY_PARTS.has(part)) {
          const remoteData = await loadPart(part);
          if (remoteData !== undefined) {
            data = mergeArrayPart(lastSavedParts[part], parts[part], remoteData);
          }
        }
        await upsertPart(part, data);
        lastSavedParts[part] = clone(data);
      }

      needsPartMigration = false;
      localStorage.setItem(LAST_REMOTE_KEY, new Date().toISOString());
    } finally {
      saving = false;
      if (pendingState) {
        const next = pendingState;
        pendingState = null;
        saveState(next);
      }
    }
  }

  function saveState(state) {
    if (!isReady() || !isSignedIn()) return;
    clearTimeout(saveTimer);
    const copy = clone(state);
    saveTimer = setTimeout(() => saveStateNow(copy), 500);
  }

  window.AtakaRemote = {
    isReady,
    isSignedIn,
    signIn,
    signOut,
    loadState,
    saveState
  };
})();
