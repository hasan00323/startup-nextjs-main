"use client";

let isRefreshing = false;
let refreshWaiters: Array<(ok: boolean) => void> = [];
let refreshIntervalId: number | null = null;

function notifyRefreshWaiters(ok: boolean) {
  refreshWaiters.forEach((cb) => cb(ok));
  refreshWaiters = [];
}

async function waitForRefresh(): Promise<boolean> {
  return new Promise((resolve) => refreshWaiters.push(resolve));
}

function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

function setAccessToken(token: string) {
  localStorage.setItem("token", token);
}

function getRefreshToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refreshToken");
}

async function refreshAccessToken(): Promise<string | null> {
  const rt = getRefreshToken();
  if (!rt) return null;

  const res = await fetch("https://localhost:7145/api/Auth/RefreshToken", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: rt }),
  });

  if (!res.ok) return null;

  const data: any = await res.json().catch(() => null);

  const newToken =
    data?.accessToken ||
    data?.AccessToken ||
    data?.token ||
    data?.Token ||
    data?.data?.accessToken ||
    data?.data?.AccessToken ||
    data?.result?.accessToken ||
    data?.result?.AccessToken;

  return newToken ? String(newToken) : null;
}

/** ✅ أبسط تايمر: كل 10 دقائق يحاول يعمل Refresh */
export function startRefreshTokenTimer() {
  if (typeof window === "undefined") return;
  if (refreshIntervalId) return; // لا تشغله مرتين

  refreshIntervalId = window.setInterval(async () => {
    // إذا في refresh شغال أو ما في refresh token ما تسوي شيء
    if (isRefreshing) return;
    if (!getRefreshToken()) return;

    isRefreshing = true;

    const newToken = await refreshAccessToken();

    if (newToken) {
      setAccessToken(newToken);
      notifyRefreshWaiters(true);
    } else {
      notifyRefreshWaiters(false);
      // إذا فشل الريفرش غالباً انتهت الجلسة، وقف التايمر
      stopRefreshTokenTimer();
    }

    isRefreshing = false;
  }, 10 * 60 * 1000); // 10 دقائق
}

export function stopRefreshTokenTimer() {
  if (refreshIntervalId) {
    clearInterval(refreshIntervalId);
    refreshIntervalId = null;
  }
}

export async function apiFetch(
  input: string,
  init: RequestInit = {},
  router?: { push: (path: string) => void }
) {
  const accessToken = getAccessToken();

  const headers = new Headers(init.headers || {});

  if (!headers.has("Content-Type") && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  const doRequest = () =>
    fetch(input, {
      ...init,
      headers,
      credentials: init.credentials ?? "include",
    });

  let res = await doRequest();

  if (res.status !== 401) return res;

  // لو في refresh شغال، استنى
  if (isRefreshing) {
    const ok = await waitForRefresh();
    if (!ok) {
      router?.push?.("/signin");
      return res;
    }

    const newToken = getAccessToken();
    if (newToken) headers.set("Authorization", `Bearer ${newToken}`);
    return doRequest();
  }

  // ابدأ refresh جديد
  isRefreshing = true;

  const newToken = await refreshAccessToken();

  if (newToken) {
    setAccessToken(newToken);
    notifyRefreshWaiters(true);
  } else {
    notifyRefreshWaiters(false);
  }

  isRefreshing = false;

  if (!newToken) {
    router?.push?.("/signin");
    return res;
  }

  headers.set("Authorization", `Bearer ${newToken}`);
  return doRequest();
}
