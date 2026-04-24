declare global {
  interface Window {
    __refreshTokenTimer?: {
      started: boolean;
      timeoutId: number | null;
      ticking: boolean;
    };
  }
}

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://localhost:7145/api";

export type RouterLike = { push: (path: string) => void };

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

const TOKEN_EXPIRY_BUFFER_MS = 60 * 1000;
const DEFAULT_REFRESH_RETRY_MS = 60 * 1000;
const MIN_REFRESH_DELAY_MS = 5 * 1000;

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

function clearStoredAuth() {
  if (!isBrowser()) return;
  ["token", "roleId", "fullName", "userId", "refreshToken"].forEach((key) =>
    localStorage.removeItem(key)
  );
}

function redirectToSignin(router?: RouterLike) {
  clearStoredAuth();
  stopRefreshTokenTimer();
  if (router) {
    router.push("/signin?session=expired");
    return;
  }

  if (isBrowser()) {
    window.location.assign("/signin?session=expired");
  }
}

export function getStoredAccessToken() {
  return getAccessToken();
}

export function buildApiUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

async function refreshAccessToken(): Promise<string | null> {
  const res = await fetch(buildApiUrl("/Auth/RefreshToken"), {
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
    root?.access_token ??
    root?.jwtToken ??
    root?.JwtToken ??
    root?.jwt ??
    root?.Jwt ??
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

function decodeJwtPayload(token: string): { exp?: number } | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "="));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function isTokenExpiring(token: string) {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return false;

  return payload.exp * 1000 <= Date.now() + TOKEN_EXPIRY_BUFFER_MS;
}

function getRefreshDelay(token: string | null) {
  if (!token) return DEFAULT_REFRESH_RETRY_MS;

  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return DEFAULT_REFRESH_RETRY_MS;

  return Math.max(payload.exp * 1000 - Date.now() - TOKEN_EXPIRY_BUFFER_MS, MIN_REFRESH_DELAY_MS);
}

async function ensureFreshAccessToken() {
  const token = getAccessToken();
  if (!token || !isTokenExpiring(token)) return true;

  return runRefreshOnce();
}

export function startRefreshTokenTimer() {
  if (!isBrowser()) return;

  const st = getTimerState();
  if (!st || st.started) return;

  st.started = true;

  const loop = async () => {
    const s = getTimerState();
    if (!s || !s.started) return;

    const token = getAccessToken();
    if (!token) {
      s.started = false;
      s.timeoutId = null;
      return;
    }

    if (s.ticking || isRefreshing) {
      s.timeoutId = window.setTimeout(loop, MIN_REFRESH_DELAY_MS);
      return;
    }

    if (!isTokenExpiring(token)) {
      s.timeoutId = window.setTimeout(loop, getRefreshDelay(token));
      return;
    }

    s.ticking = true;
    try {
      await runRefreshOnce();
    } catch {
    } finally {
      s.ticking = false;
      s.timeoutId = window.setTimeout(loop, getRefreshDelay(getAccessToken()));
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
  router?: RouterLike
) {
  const hasFreshToken = await ensureFreshAccessToken();
  if (!hasFreshToken && getAccessToken()) {
    redirectToSignin(router);
  }

  const headers = new Headers(init.headers || {});

  if (!headers.has("Content-Type") && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const accessToken = getAccessToken();
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  const doRequest = () =>
    fetch(buildApiUrl(input), {
      ...init,
      headers,
      credentials: init.credentials ?? "include",
    });

  let res = await doRequest();

  if (res.status !== 401) return res;

  const ok = await runRefreshOnce();

  if (!ok) {
    redirectToSignin(router);
    return res;
  }

  const newToken = getAccessToken();
  if (newToken) headers.set("Authorization", `Bearer ${newToken}`);
  res = await doRequest();

  if (res.status === 401) {
    redirectToSignin(router);
  }

  return res;
}

export async function parseApiError(res: Response): Promise<ApiError> {
  const fallbackMessage =
    res.status === 401
      ? "Your session expired. Please sign in again."
      : `Request failed (${res.status})`;
  const contentType = res.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const body = await res.json().catch(() => null);
    const validationError = body?.errors
      ? Object.values(body.errors).flat().find(Boolean)
      : null;
    const message =
      validationError ??
      body?.message ??
      body?.error ??
      body?.title ??
      fallbackMessage;

    return new ApiError(String(message), res.status, body);
  }

  const message = await res.text().catch(() => fallbackMessage);
  return new ApiError(message || fallbackMessage, res.status);
}

export async function requestJson<T>(
  input: string,
  init: RequestInit = {},
  router?: RouterLike
): Promise<T> {
  const res = await apiFetch(input, init, router);

  if (!res.ok) {
    throw await parseApiError(res);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json().catch(() => undefined)) as T;
}
