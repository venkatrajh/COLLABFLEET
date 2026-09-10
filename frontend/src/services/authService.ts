import { UserProfile, UserRole } from '../types';
import { ApiClient } from './apiClient';
import { INITIAL_USER_PROFILE } from './mockData';

export class AuthService {
  private static currentUser: UserProfile = { ...INITIAL_USER_PROFILE };

  public static isAuthenticated(): boolean {
    try {
      return localStorage.getItem('collabfleet_auth') === 'true';
    } catch {
      return false;
    }
  }

  public static getCurrentUser(): UserProfile {
    try {
      const savedUser = localStorage.getItem('collabfleet_user');
      if (savedUser) {
        return JSON.parse(savedUser);
      }
    } catch {}
    return { ...this.currentUser };
  }

  public static setRole(role: UserRole): UserProfile {
    this.currentUser = {
      ...this.currentUser,
      role
    };
    try {
      localStorage.setItem('collabfleet_user', JSON.stringify(this.currentUser));
      localStorage.setItem('collabfleet_role', role);
    } catch {}
    return { ...this.currentUser };
  }

  public static async login(emailOrPhone: string, role: UserRole): Promise<UserProfile> {
    return ApiClient.executeWithFallback<UserProfile>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ emailOrPhone, role })
      },
      () => {
        this.currentUser = {
          ...this.currentUser,
          email: emailOrPhone.includes('@') ? emailOrPhone : this.currentUser.email,
          phone: !emailOrPhone.includes('@') ? emailOrPhone : this.currentUser.phone,
          name: emailOrPhone.includes('@') ? emailOrPhone.split('@')[0] : this.currentUser.name,
          role
        };
        try {
          localStorage.setItem('collabfleet_auth', 'true');
          localStorage.setItem('collabfleet_user', JSON.stringify(this.currentUser));
          localStorage.setItem('collabfleet_role', role);
        } catch {}
        return { ...this.currentUser };
      }
    );
  }

  public static logout(): void {
    try {
      localStorage.removeItem('collabfleet_auth');
      localStorage.removeItem('collabfleet_user');
    } catch {}
  }

  public static updateProfile(data: Partial<UserProfile>): UserProfile {
    this.currentUser = {
      ...this.currentUser,
      ...data
    };
    try {
      localStorage.setItem('collabfleet_user', JSON.stringify(this.currentUser));
    } catch {}
    return { ...this.currentUser };
  }
}
