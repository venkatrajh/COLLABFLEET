/**
 * COLLABFLEET Admin API Gateway Configuration
 * Pre-configured for FastAPI backend integration at http://localhost:8000
 */

export const ADMIN_API_BASE_URL = 
  (typeof window !== 'undefined' && (window as any).__COLLABFLEET_API_URL__) || 
  'http://localhost:8000/api/v1';

export const USER_APP_URL = 'http://localhost:5173';

export class AdminApiClient {
  private static tokenKey = 'collabfleet_admin_token';

  public static getToken(): string | null {
    try {
      return localStorage.getItem(this.tokenKey);
    } catch {
      return null;
    }
  }

  public static setToken(token: string): void {
    try {
      localStorage.setItem(this.tokenKey, token);
    } catch {}
  }

  public static clearToken(): void {
    try {
      localStorage.removeItem(this.tokenKey);
    } catch {}
  }

  public static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string> || {})
    };

    const response = await fetch(`${ADMIN_API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      throw new Error(`Admin API Error (${response.status}): ${response.statusText}`);
    }

    return response.json();
  }
}
