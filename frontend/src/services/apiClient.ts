/**
 * Central API Client for CollabFleet AI
 * Supports backend connection via VITE_API_BASE_URL (FastAPI)
 * Gracefully and seamlessly falls back to mock logic when backend is offline
 */

const API_BASE_URL = (import.meta as { env?: { VITE_API_BASE_URL?: string } }).env?.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export class ApiClient {
  private static baseUrl = API_BASE_URL;

  public static getBaseUrl(): string {
    return this.baseUrl;
  }

  public static async executeWithFallback<T>(
    endpoint: string,
    options: RequestInit = {},
    fallbackFn: () => Promise<T> | T
  ): Promise<T> {
    try {
      const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500); // 2.5s fast timeout

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        }
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        return data as T;
      }
      // If backend responded with 404/500, fallback cleanly
      console.warn(`[CollabFleet API] Backend responded with ${response.status} for ${endpoint}. Using intelligent mock engine.`);
      return await fallbackFn();
    } catch (err) {
      // Offline / Network Error / Aborted: Seamlessly execute fallback
      return await fallbackFn();
    }
  }
}
