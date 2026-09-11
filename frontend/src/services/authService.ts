import { UserProfile, UserRole } from '../types';
import { ApiClient } from './apiClient';
import { INITIAL_USER_PROFILE } from './mockData';

const DEMO_USER_KEY = 'collabfleet_demo_user';
const DEMO_AUTH_KEY = 'collabfleet_auth';
const DEMO_ROLE_KEY = 'collabfleet_demo_role';

export class AuthService {
  private static currentUser: UserProfile = { ...INITIAL_USER_PROFILE };

  public static isAuthenticated(): boolean {
    try {
      return localStorage.getItem(DEMO_AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  }

  public static getCurrentUser(): UserProfile {
    try {
      const savedUser = localStorage.getItem(DEMO_USER_KEY);
      if (savedUser) {
        return JSON.parse(savedUser);
      }
    } catch {}
    return { ...this.currentUser };
  }

  public static setRole(role: UserRole): UserProfile {
    this.currentUser = {
      ...this.getCurrentUser(),
      role
    };
    try {
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(this.currentUser));
      localStorage.setItem(DEMO_ROLE_KEY, role);
    } catch {}
    return { ...this.currentUser };
  }

  /**
   * DEMO SIGN IN
   * Accepts any valid-looking email + password in demo mode.
   * Centralized so it can easily bridge to FastAPI + JWT later.
   */
  public static async signIn(email: string, _password?: string, role?: UserRole): Promise<UserProfile> {
    // Simulated network latency for realism
    await new Promise((r) => setTimeout(r, 450));

    return ApiClient.executeWithFallback<UserProfile>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password: _password, role })
      },
      () => {
        const existing = this.getCurrentUser();
        const detectedName = email.includes('@')
          ? email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
          : 'Demo Shipper';

        const chosenRole: UserRole = role || (localStorage.getItem(DEMO_ROLE_KEY) as UserRole) || existing.role || 'shipper';

        this.currentUser = {
          ...existing,
          email: email.trim(),
          name: existing.email === email ? existing.name : detectedName,
          role: chosenRole
        };

        try {
          localStorage.setItem(DEMO_AUTH_KEY, 'true');
          localStorage.setItem(DEMO_USER_KEY, JSON.stringify(this.currentUser));
          localStorage.setItem(DEMO_ROLE_KEY, chosenRole);
        } catch {}

        return { ...this.currentUser };
      }
    );
  }

  /**
   * DEMO SIGN UP (Create Account)
   * Validates and registers a new demo user.
   */
  public static async signUp(fullName: string, email: string, _password?: string): Promise<UserProfile> {
    await new Promise((r) => setTimeout(r, 550));

    return ApiClient.executeWithFallback<UserProfile>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify({ fullName, email, password: _password })
      },
      () => {
        const newUser: UserProfile = {
          ...INITIAL_USER_PROFILE,
          id: `usr-${Date.now()}`,
          name: fullName.trim(),
          email: email.trim(),
          company: `${fullName.split(' ')[0]} Logistics`,
          role: 'shipper' // default until role selection
        };

        this.currentUser = newUser;
        try {
          localStorage.setItem(DEMO_AUTH_KEY, 'true');
          localStorage.setItem(DEMO_USER_KEY, JSON.stringify(newUser));
        } catch {}

        return newUser;
      }
    );
  }

  /**
   * DEMO GOOGLE SIGN-IN
   * Shows a realistic demo login state without real OAuth or API keys.
   */
  public static async signInWithGoogle(): Promise<{ user: UserProfile; isNewAccount: boolean }> {
    // Realistic connection latency
    await new Promise((r) => setTimeout(r, 650));

    return ApiClient.executeWithFallback<{ user: UserProfile; isNewAccount: boolean }>(
      '/auth/google/demo',
      { method: 'POST' },
      () => {
        const googleUser: UserProfile = {
          ...INITIAL_USER_PROFILE,
          id: 'usr-google-demo',
          name: 'Nakul Venkatesh',
          email: 'nakul@collabfleet.ai',
          company: 'Apex Technologies Freight Co.'
        };

        this.currentUser = googleUser;
        const storedRole = localStorage.getItem(DEMO_ROLE_KEY);
        const isNew = !storedRole;

        try {
          localStorage.setItem(DEMO_AUTH_KEY, 'true');
          localStorage.setItem(DEMO_USER_KEY, JSON.stringify(googleUser));
        } catch {}

        return {
          user: googleUser,
          isNewAccount: isNew
        };
      }
    );
  }

  /**
   * Legacy login method alias for backward compatibility with existing tests
   */
  public static async login(emailOrPhone: string, role: UserRole): Promise<UserProfile> {
    return this.signIn(emailOrPhone, 'demo-password', role);
  }

  public static logout(): void {
    try {
      localStorage.removeItem(DEMO_AUTH_KEY);
      localStorage.removeItem(DEMO_USER_KEY);
      localStorage.removeItem(DEMO_ROLE_KEY);
    } catch {}
    this.currentUser = { ...INITIAL_USER_PROFILE };
  }

  public static updateProfile(data: Partial<UserProfile>): UserProfile {
    this.currentUser = {
      ...this.getCurrentUser(),
      ...data
    };
    try {
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(this.currentUser));
    } catch {}
    return { ...this.currentUser };
  }
}
