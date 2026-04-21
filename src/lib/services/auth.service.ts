export interface SendOtpResponse {
  status: boolean;
}

export interface VerifyOtpUser {
  id: number;
  userTypeId: number;
  userName: string | null;
  firstName: string;
  active: boolean;
}

export interface VerifyOtpResponse {
  status: boolean;
  token?: string;
  user?: VerifyOtpUser;
}

function getAuthBaseUrl(): string {
  const url = process.env.AUTH_API_URL;
  if (!url) throw new Error('AUTH_API_URL must be set in .env.local');
  return url;
}

async function authPost<T>(path: string, body: unknown, token?: string): Promise<T> {
  const base = getAuthBaseUrl();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${base}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.message || `Auth API error: ${res.status}`);
  }
  return json as T;
}

async function authGet<T>(path: string, token?: string): Promise<T> {
  const base = getAuthBaseUrl();
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${base}${path}`, {
    method: 'GET',
    headers,
    cache: 'no-store',
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json?.message || `Auth API error: ${res.status}`);
  }
  return json as T;
}

export const AuthService = {
  sendOtp(mobile: string): Promise<SendOtpResponse> {
    return authPost<SendOtpResponse>('/auth/sendotp', { mobile });
  },

  verifyOtp(mobile: string, otp: number, deviceId: string): Promise<VerifyOtpResponse> {
    return authPost<VerifyOtpResponse>('/auth/verifyotp', { mobile, otp, deviceId });
  },

  resendOtp(mobile: string): Promise<SendOtpResponse> {
    return authPost<SendOtpResponse>('/auth/resendotp', { mobile });
  },

  logout(token?: string): Promise<unknown> {
    return authGet('/auth/logout', token);
  },
};
