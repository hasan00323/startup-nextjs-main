declare global {
  interface Window {
    __refreshTokenTimer?: {
      started: boolean;
      timeoutId: number | null;
      ticking: boolean;
    };
  }
}

let isRefreshing = false;
let refreshWaiters: Array<(ok: boolean) => void> = [];

function isBrowser() {
  return typeof window !== "undefined";
}

function getTimerState() {
  if (!isBrowser()) return null;
  window.__refreshTokenTimer ??= { started: false, timeoutId: null, ticking: false };
  return window.__refreshTokenTimer;
}

function notifyRefreshWaiters(ok: boolean) {
  refreshWaiters.forEach((cb) => cb(ok));
  refreshWaiters = [];
}

function waitForRefresh(): Promise<boolean> {
  return new Promise((resolve) => refreshWaiters.push(resolve));
}

function getAccessToken() {
  if (!isBrowser()) return null;
  return localStorage.getItem("token");
}

function setAccessToken(token: string) {
  if (!isBrowser()) return;
  localStorage.setItem("token", token);
}

async function refreshAccessToken(): Promise<string | null> {
  const res = await fetch("https://localhost:7145/api/Auth/RefreshToken", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!res.ok) return null;

  const data: any = await res.json().catch(() => null);
  const root = data?.value ?? data?.data ?? data?.result ?? data;

  const newAccessToken =
    root?.accessToken ??
    root?.AccessToken ??
    root?.token ??
    root?.Token ??
    null;

  return newAccessToken ? String(newAccessToken) : null;
}

async function runRefreshOnce(): Promise<boolean> {
  if (isRefreshing) return await waitForRefresh();

  isRefreshing = true;
  try {
    const accessToken = await refreshAccessToken();

    if (accessToken) {
      setAccessToken(accessToken);
      notifyRefreshWaiters(true);
      return true;
    }

    notifyRefreshWaiters(false);
    return false;
  } finally {
    isRefreshing = false;
  }
}

export function startRefreshTokenTimer() {
  if (!isBrowser()) return;

  const st = getTimerState();
  if (!st || st.started) return;

  st.started = true;

  const loop = async () => {
    const s = getTimerState();
    if (!s || !s.started) return;

    if (s.ticking || isRefreshing) {
      s.timeoutId = window.setTimeout(loop, 10 * 1000);
      return;
    }

    s.ticking = true;
    try {
      await runRefreshOnce();
    } catch {
    } finally {
      s.ticking = false;
      s.timeoutId = window.setTimeout(loop, 1 *1000);
    }
  };

  void loop();
}

export function stopRefreshTokenTimer() {
  if (!isBrowser()) return;

  const st = getTimerState();
  if (!st) return;

  st.started = false;

  if (st.timeoutId) {
    clearTimeout(st.timeoutId);
    st.timeoutId = null;
  }
}

export async function apiFetch(
  input: string,
  init: RequestInit = {},
  router?: { push: (path: string) => void }
) {
  const headers = new Headers(init.headers || {});

  if (!headers.has("Content-Type") && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const accessToken = getAccessToken();
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  const doRequest = () =>
    fetch(input, {
      ...init,
      headers,
      credentials: init.credentials ?? "include",
    });

  let res = await doRequest();

  if (res.status !== 401) return res;

  const ok = await runRefreshOnce();

  if (!ok) {
    router?.push?.("/signin");
    return res;
  }

  const newToken = getAccessToken();
  if (newToken) headers.set("Authorization", `Bearer ${newToken}`);
  return doRequest();
}