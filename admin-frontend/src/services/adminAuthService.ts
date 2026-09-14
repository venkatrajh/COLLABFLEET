import { AdminUser } from '../types/adminTypes';
import { AdminApiClient } from './adminApiConfig';

export interface AdminLoginCredentials {
  email: string;
  password?: string;
  rememberMe?: boolean;
}

const DEFAULT_ADMIN_USER: AdminUser = {
  id: 'admin-001',
  name: 'Nakul Venkatesh',
  email: 'admin@collabfleet.in',
  role: 'super_admin',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  token: 'mock_jwt_admin_collabfleet_99214'
};

export class AdminAuthService {
  private static storageKey = 'collabfleet_admin_session';

  public static getCurrentAdmin(): AdminUser | null {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    return null;
  }

  public static isAuthenticated(): boolean {
    return !!this.getCurrentAdmin();
  }

  public static async signInWithEmail(credentials: AdminLoginCredentials): Promise<AdminUser> {
    await new Promise(resolve => setTimeout(resolve, 600));

    const user: AdminUser = {
      ...DEFAULT_ADMIN_USER,
      email: credentials.email || DEFAULT_ADMIN_USER.email,
      name: credentials.email.includes('@') 
        ? credentials.email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase())
        : DEFAULT_ADMIN_USER.name
    };

    localStorage.setItem(this.storageKey, JSON.stringify(user));
    AdminApiClient.setToken(user.token || 'mock_admin_token');
    return user;
  }

  public static async signInWithGoogle(): Promise<AdminUser> {
    await new Promise(resolve => setTimeout(resolve, 750));

    const user: AdminUser = {
      id: 'admin-google-002',
      name: 'Nakul Venkatesh (Google Admin)',
      email: 'admin@collabfleet.in',
      role: 'super_admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      token: 'mock_google_oauth_collabfleet_jwt'
    };

    localStorage.setItem(this.storageKey, JSON.stringify(user));
    AdminApiClient.setToken(user.token || 'mock_google_admin_token');
    return user;
  }

  public static signOut(): void {
    localStorage.removeItem(this.storageKey);
    AdminApiClient.clearToken();
  }
}
