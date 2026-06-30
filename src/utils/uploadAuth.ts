const STORAGE_KEY = "wixted-family-upload-key";

export function getStoredUploadKey(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredUploadKey(key: string): void {
  sessionStorage.setItem(STORAGE_KEY, key.trim());
}

export function clearStoredUploadKey(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}

export function uploadAuthHeaders(): Record<string, string> {
  const key = getStoredUploadKey();
  if (!key) return {};
  return { Authorization: `Bearer ${key}` };
}

export interface AuthStatus {
  authRequired: boolean;
  blobAvailable: boolean;
  authenticated: boolean;
}

export async function fetchAuthStatus(): Promise<AuthStatus> {
  try {
    const res = await fetch("/api/auth-check", { headers: uploadAuthHeaders() });
    if (!res.ok) {
      return { authRequired: false, blobAvailable: false, authenticated: false };
    }
    return (await res.json()) as AuthStatus;
  } catch {
    return { authRequired: false, blobAvailable: false, authenticated: false };
  }
}

export async function validateUploadKey(key: string): Promise<boolean> {
  setStoredUploadKey(key);
  const status = await fetchAuthStatus();
  if (!status.authenticated) {
    clearStoredUploadKey();
    return false;
  }
  return true;
}
