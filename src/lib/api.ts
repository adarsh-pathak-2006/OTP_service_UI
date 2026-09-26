// Central API client — all backend communication goes through here

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

/* ---------- Token helpers ---------- */
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refresh_token');
}

export function setTokens(access: string, refresh: string) {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
}

export function clearTokens() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

/* ---------- Core fetcher ---------- */
async function refreshAccessToken(): Promise<string | null> {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  try {
    const res = await fetch(`${API_BASE}/authentication/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });

    if (!res.ok) {
      clearTokens();
      return null;
    }

    const data = await res.json();
    localStorage.setItem('access_token', data.access);
    return data.access;
  } catch {
    clearTokens();
    return null;
  }
}

interface FetchOptions {
  method?: string;
  body?: unknown;
  auth?: boolean;
  params?: Record<string, string>;
}

export async function apiFetch<T = unknown>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { method = 'GET', body, auth = true, params } = options;

  let url = `${API_BASE}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (auth) {
    let token = getAccessToken();
    if (!token) throw new Error('Not authenticated');
    headers['Authorization'] = `Bearer ${token}`;

    // Make the request
    let res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    // If 401, try refreshing the token
    if (res.status === 401) {
      token = await refreshAccessToken();
      if (!token) {
        clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        throw new Error('Session expired');
      }
      headers['Authorization'] = `Bearer ${token}`;
      res = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new ApiError(res.status, errorData);
    }

    return res.json();
  }

  // Non-auth request
  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new ApiError(res.status, errorData);
  }

  return res.json();
}

/* ---------- Error class ---------- */
export class ApiError extends Error {
  status: number;
  data: Record<string, unknown>;

  constructor(status: number, data: Record<string, unknown>) {
    const msg = (data.message as string) || (data.detail as string) || `Request failed (${status})`;
    super(typeof msg === 'string' ? msg : JSON.stringify(msg));
    this.status = status;
    this.data = data;
  }
}

/* ---------- Auth endpoints ---------- */
export async function register(username: string, email: string, password: string) {
  return apiFetch<{ message: string }>('/authentication/register/', {
    method: 'POST',
    body: { username, email, password },
    auth: false,
  });
}

export async function login(username: string, password: string) {
  const data = await apiFetch<{ access: string; refresh: string }>(
    '/authentication/token/',
    {
      method: 'POST',
      body: { username, password },
      auth: false,
    }
  );
  setTokens(data.access, data.refresh);
  return data;
}

export function logout() {
  clearTokens();
}

/* ---------- Type definitions ---------- */
export interface User {
  username: string;
  email: string;
}

export interface Project {
  id: number;
  user: User;
  reference_id: string;
  project_name: string;
  description: string | null;
  created_on: string;
}

export interface OTPRecord {
  id: number;
  project: Project;
  email: string;
  otp: string;
  sent_on: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/* ---------- Project endpoints ---------- */
export async function getProjects(page = 1) {
  return apiFetch<PaginatedResponse<Project>>('/core/projects/', {
    params: { page: page.toString() },
  });
}

export async function createProject(project_name: string, description: string) {
  return apiFetch<Project>('/core/projects/', {
    method: 'POST',
    body: { project_name, description },
  });
}

/* ---------- OTP endpoints ---------- */
export async function getOTPHistory(projectId: number, page = 1) {
  return apiFetch<PaginatedResponse<OTPRecord>>(`/core/projects/${projectId}/`, {
    params: { page: page.toString() },
  });
}

export async function sendOTP(referenceId: string, email: string) {
  return apiFetch<{ data: OTPRecord; message: string }>(
    `/getotp/${referenceId}/`,
    {
      method: 'POST',
      body: { email },
      auth: false,
    }
  );
}
