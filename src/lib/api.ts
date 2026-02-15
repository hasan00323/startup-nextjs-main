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

function setRefreshToken(token: string) {
  localStorage.setItem("refreshToken", token);
}

async function refreshAccessToken(): Promise<{ accessToken: string | null; refreshToken: string | null }> {
  const rt = getRefreshToken();
  if (!rt) return { accessToken: null, refreshToken: null };

  const res = await fetch("https://localhost:7145/api/Auth/RefreshToken", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", 
    body: JSON.stringify({ refreshToken: rt }),
  });

  if (!res.ok) return { accessToken: null, refreshToken: null };

  const data: any = await res.json().catch(() => null);

  const newAccessToken =
    data?.accessToken ||
    data?.AccessToken ||
    data?.token ||
    data?.Token ||
    data?.data?.accessToken ||
    data?.data?.AccessToken ||
    data?.result?.accessToken ||
    data?.result?.AccessToken;

  const newRefreshToken =
    data?.refreshToken ||
    data?.RefreshToken ||
    data?.data?.refreshToken ||
    data?.data?.RefreshToken ||
    data?.result?.refreshToken ||
    data?.result?.RefreshToken;

  return {
    accessToken: newAccessToken ? String(newAccessToken) : null,
    refreshToken: newRefreshToken ? String(newRefreshToken) : null,
  };
}

async function runRefreshOnce(): Promise<boolean> {
  if (isRefreshing) return false;

  if (!getRefreshToken()) return false;

  isRefreshing = true;

  const { accessToken, refreshToken } = await refreshAccessToken();

  if (accessToken) {
    setAccessToken(accessToken);
    if (refreshToken) setRefreshToken(refreshToken); // ✅ لو السيرفر بيرجع ريفرش جديد
    notifyRefreshWaiters(true);
    isRefreshing = false;
    return true;
  }

  notifyRefreshWaiters(false);
  isRefreshing = false;
  return false;
}

/** ✅ تايمر: يشغل Refresh فوراً + كل 10 دقائق */
export function startRefreshTokenTimer() {
  if (typeof window === "undefined") return;
  if (refreshIntervalId) return;

  // ✅ جرّب مرة فوراً (عشان ما تستنى 10 دقايق وتفكر "مش شغال")
  runRefreshOnce().then((ok) => {
    if (!ok) {
      // ما بنعمل redirect هون، بس منوقف التايمر إذا فشل
      stopRefreshTokenTimer();
    }
  });

  refreshIntervalId = window.setInterval(async () => {
    if (isRefreshing) return;
    if (!getRefreshToken()) return;

    const ok = await runRefreshOnce();
    if (!ok) stopRefreshTokenTimer();
  }, 10 * 60 * 1000);
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

  const ok = await runRefreshOnce();

  if (!ok) {
    router?.push?.("/signin");
    return res;
  }

  const newToken = getAccessToken();
  if (newToken) headers.set("Authorization", `Bearer ${newToken}`);
  return doRequest();
}
