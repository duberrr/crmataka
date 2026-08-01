(function () {
  const CONFIG = window.ATAKA_SUPABASE || {};
  const TOKEN_KEY = "ataka-crm-supabase-token";
  const REFRESH_KEY = "ataka-crm-supabase-refresh";
  const LAST_REMOTE_KEY = "ataka-crm-last-remote-at";
  let saving = false;
  let pendingState = null;
  let saveTimer = null;

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

  async function loadState() {
    if (!isReady() || !isSignedIn()) return null;
    const rows = await request("/rest/v1/app_state?id=eq.main&select=data,updated_at", {
      headers: { "Accept": "application/json" }
    });
    const row = Array.isArray(rows) ? rows[0] : null;
    if (!row?.data || !Object.keys(row.data).length) return null;
    localStorage.setItem(LAST_REMOTE_KEY, row.updated_at || "");
    return row.data;
  }

  async function saveStateNow(state) {
    if (!isReady() || !isSignedIn() || saving) {
      pendingState = state;
      return;
    }
    saving = true;
    try {
      await request("/rest/v1/app_state?id=eq.main", {
        method: "PATCH",
        headers: { "Prefer": "return=minimal" },
        body: JSON.stringify({ data: state, updated_at: new Date().toISOString() })
      });
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
    const copy = JSON.parse(JSON.stringify(state));
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
