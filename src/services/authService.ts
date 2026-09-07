import { User } from '../types';
import { storageService } from './storageService';
import { DEMO_USER, ADMIN_USER, INITIAL_USERS } from '../data/demoData';

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

const AUTH_USER_KEY = 'auth_user';
const AUTH_TOKEN_KEY = 'auth_token';
const USERS_LIST_KEY = 'mamanest_users_registry';
const ONBOARDING_COMPLETED_KEY = 'onboarding_completed';

class AuthService {
  getUsers(): User[] {
    const list = storageService.get<User[]>(USERS_LIST_KEY, INITIAL_USERS) || [];
    if (!list.length) return INITIAL_USERS;
    return list;
  }

  saveUsers(users: User[]): void {
    storageService.set(USERS_LIST_KEY, users);
  }

  getUserById(id: string): User | undefined {
    return this.getUsers().find((u) => u.id === id);
  }

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
    await new Promise((r) => setTimeout(r, 350));

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    const allUsers = this.getUsers();
    let user = allUsers.find((u) => u.email.toLowerCase() === normalizedEmail);

    if (user) {
      if (user.status === 'suspended') {
        return {
          success: false,
          error: 'This account is suspended. Please contact clinical administrator support.',
        };
      }
      // Update last login
      user = { ...user, lastLoginAt: new Date().toISOString() };
      const updatedList = allUsers.map((u) => (u.id === user!.id ? user! : u));
      this.saveUsers(updatedList);
    } else {
      // Check if trying admin credentials
      if (normalizedEmail === 'admin@mamanest.com') {
        user = { ...ADMIN_USER, lastLoginAt: new Date().toISOString() };
      } else {
        // Create standard user account
        user = {
          id: `user_${Date.now()}`,
          name: normalizedEmail.split('@')[0].replace('.', ' ').replace(/^\w/, (c) => c.toUpperCase()),
          email: normalizedEmail,
          role: 'mom',
          status: 'active',
          setupWizardCompleted: false,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
          settings: {
            notificationsEnabled: true,
            units: 'metric',
            theme: 'soft-warm',
            soundEnabled: true,
          },
        };
        this.saveUsers([...allUsers, user]);
      }
    }

    const token = `jwt_token_${Date.now()}`;
    storageService.set(AUTH_USER_KEY, user);
    storageService.set(AUTH_TOKEN_KEY, token);

    return { success: true, user };
  }

  async register(name: string, email: string, _password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    await new Promise((r) => setTimeout(r, 400));

    if (!name.trim()) return { success: false, error: 'Please enter your name.' };
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !normalizedEmail.includes('@')) return { success: false, error: 'Please enter a valid email address.' };

    const allUsers = this.getUsers();
    const existing = allUsers.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      return { success: false, error: 'An account with this email already exists. Please log in.' };
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      role: 'mom',
      status: 'active',
      setupWizardCompleted: false,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      settings: {
        notificationsEnabled: true,
        units: 'metric',
        theme: 'soft-warm',
        soundEnabled: true,
      },
    };

    this.saveUsers([...allUsers, newUser]);

    const token = `jwt_token_${Date.now()}`;
    storageService.set(AUTH_USER_KEY, newUser);
    storageService.set(AUTH_TOKEN_KEY, token);

    return { success: true, user: newUser };
  }

  createUser(userData: Omit<User, 'id' | 'createdAt'>): User {
    const allUsers = this.getUsers();
    const newUser: User = {
      ...userData,
      id: `user_${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: userData.status || 'active',
      role: userData.role || 'mom',
      setupWizardCompleted: userData.setupWizardCompleted ?? true,
      avatarUrl:
        userData.avatarUrl ||
        (userData.role === 'admin'
          ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
    };
    this.saveUsers([newUser, ...allUsers]);
    storageService.enqueueSync('user', 'CREATE', newUser);
    return newUser;
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    const allUsers = this.getUsers();
    const index = allUsers.findIndex((u) => u.id === id);
    if (index === -1) return null;

    const updated = { ...allUsers[index], ...updates };
    allUsers[index] = updated;
    this.saveUsers(allUsers);

    // If current logged-in user is updated, refresh active session
    const current = storageService.get<User | null>(AUTH_USER_KEY, null);
    if (current && current.id === id) {
      storageService.set(AUTH_USER_KEY, updated);
    }

    storageService.enqueueSync('user', 'UPDATE', updated);
    return updated;
  }

  deleteUser(id: string): boolean {
    const allUsers = this.getUsers();
    const filtered = allUsers.filter((u) => u.id !== id);
    this.saveUsers(filtered);
    storageService.enqueueSync('user', 'DELETE', { id });
    return true;
  }

  toggleUserStatus(id: string): User | null {
    const user = this.getUserById(id);
    if (!user) return null;
    const nextStatus = user.status === 'suspended' ? 'active' : 'suspended';
    return this.updateUser(id, { status: nextStatus });
  }

  resetUserPassword(id: string): { success: boolean; message: string; tempPass: string } {
    const user = this.getUserById(id);
    if (!user) {
      return { success: false, message: 'User not found', tempPass: '' };
    }
    const tempPass = `MamaPass!${Math.floor(1000 + Math.random() * 9000)}`;
    return {
      success: true,
      message: `Password reset email dispatched to ${user.email}. Temporary token: ${tempPass}`,
      tempPass,
    };
  }

  switchActiveUser(user: User): void {
    storageService.set(AUTH_USER_KEY, user);
    storageService.set(AUTH_TOKEN_KEY, `jwt_impersonate_${Date.now()}`);
  }

  completeSetupWizard(): void {
    const current = storageService.get<User | null>(AUTH_USER_KEY, null);
    if (current) {
      const updated: User = { ...current, setupWizardCompleted: true };
      storageService.set(AUTH_USER_KEY, updated);
      this.updateUser(current.id, { setupWizardCompleted: true });
    }
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
