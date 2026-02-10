import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

const AUTH_KEY = 'session_manager_auth';

@Injectable({ providedIn: 'root' })
export class AuthService {

  login(email: string, password: string): boolean {
    if (!email || !password) {
      return false;
    }

    // Mock authentication: any email/password combo works
    // Admin role: email ends with @sdi.es
    // User role: any other email
    const role: 'admin' | 'user' = email.endsWith('@sdi.es') ? 'admin' : 'user';
    const name = email.split('@')[0];
    const token = btoa(`${email}:${Date.now()}`);
    const city = role === 'admin' ? 'Madrid' : '';

    const user: User = { email, name, role, token, city };
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return true;
  }

  logout(): void {
    localStorage.removeItem(AUTH_KEY);
  }

  getUser(): User | null {
    const data = localStorage.getItem(AUTH_KEY);
    if (!data) {
      return null;
    }
    try {
      return JSON.parse(data) as User;
    } catch {
      return null;
    }
  }

  isAdmin(): boolean {
    return this.getUser()?.role === 'admin';
  }

  isAuthenticated(): boolean {
    return !!this.getUser()?.token;
  }
}
