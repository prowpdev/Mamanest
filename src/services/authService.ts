import { User } from '../types';
import { storageService } from './storageService';
import { DEMO_USER } from '../data/demoData';

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

const AUTH_USER_KEY = 'auth_user';
const AUTH_TOKEN_KEY = 'auth_token';
const ONBOARDING_COMPLETED_KEY = 'onboarding_completed';

class AuthService {
  getAuthState(): AuthState {
    const user = storageService.get<User | null>(AUTH_USER_KEY, DEMO_USER);
    const token = storageService.get<string | null>(AUTH_TOKEN_KEY, 'demo-session-token');
    return {
      isAuthenticated: !!user,
      user,
      token,
    };
  }

  async login(email: string, _password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    // Simulate brief network latency for realistic feel
    await new Promise((r) => setTimeout(r, 400));

    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    const user: User = {
      ...DEMO_USER,
      email: email.toLowerCase().trim(),
      name: email.split('@')[0].replace('.', ' ').replace(/^\w/, (c) => c.toUpperCase()),
    };

    const token = `jwt_token_${Date.now()}`;
    storageService.set(AUTH_USER_KEY, user);
    storageService.set(AUTH_TOKEN_KEY, token);

    return { success: true, user };
  }

  async register(name: string, email: string, _password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    await new Promise((r) => setTimeout(r, 450));

    if (!name.trim()) return { success: false, error: 'Please enter your name.' };
    if (!email || !email.includes('@')) return { success: false, error: 'Please enter a valid email address.' };

    const newUser: User = {
      id: `user_${Date.now()}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      createdAt: new Date().toISOString(),
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      settings: {
        notificationsEnabled: true,
        units: 'metric',
        theme: 'soft-warm',
        soundEnabled: true,
      },
    };

    const token = `jwt_token_${Date.now()}`;
    storageService.set(AUTH_USER_KEY, newUser);
    storageService.set(AUTH_TOKEN_KEY, token);

    return { success: true, user: newUser };
  }

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    await new Promise((r) => setTimeout(r, 350));
    return {
      success: true,
      message: `Password reset instructions sent to ${email}. Check your inbox or spam folder.`,
    };
  }

  logout(): void {
    storageService.remove(AUTH_USER_KEY);
    storageService.remove(AUTH_TOKEN_KEY);
  }

  isOnboardingCompleted(): boolean {
    return storageService.get<boolean>(ONBOARDING_COMPLETED_KEY, false);
  }

  setOnboardingCompleted(completed: boolean): void {
    storageService.set(ONBOARDING_COMPLETED_KEY, completed);
  }
}

export const authService = new AuthService();
