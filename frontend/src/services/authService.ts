import { UserProfile, UserRole } from '../types';
import { ApiClient } from './apiClient';
import { INITIAL_USER_PROFILE } from './mockData';

export class AuthService {
  private static currentUser: UserProfile = { ...INITIAL_USER_PROFILE };

  public static getCurrentUser(): UserProfile {
    return { ...this.currentUser };
  }

  public static setRole(role: UserRole): UserProfile {
    this.currentUser = {
      ...this.currentUser,
      role
    };
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
          role
        };
        return { ...this.currentUser };
      }
    );
  }

  public static updateProfile(data: Partial<UserProfile>): UserProfile {
    this.currentUser = {
      ...this.currentUser,
      ...data
    };
    return { ...this.currentUser };
  }
}
