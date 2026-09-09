import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import type { User, UserRole } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentUserSignal = signal<User | null>(this.getStoredUser());
  private readonly users: User[] = [
    {
      id: 'admin-1',
      email: 'admin@jangombe.ac.tz',
      username: 'admin',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      phone: '+255 712 000 001',
    },
    {
      id: 'teacher-1',
      email: 'teacher@jangombe.ac.tz',
      username: 'teacher',
      password: 'teacher123',
      firstName: 'Asha',
      lastName: 'Ali',
      role: 'TEACHER',
      phone: '+255 712 123 456',
      assignedClasses: ['class-2a'],
      assignedSubjects: ['math', 'physics'],
    },
  ];

  constructor(private readonly router: Router) {}

  get currentUser() {
    return this.currentUserSignal();
  }

  login(email: string, password: string): boolean {
    const user = this.users.find(
      (item) => (item.email === email || item.username === email) && item.password === password,
    );

    if (!user) {
      return false;
    }

    const safeUser: User = { ...user, password: '' };
    localStorage.setItem('jangombe-current-user', JSON.stringify(safeUser));
    this.currentUserSignal.set(safeUser);
    return true;
  }

  logout(): void {
    localStorage.removeItem('jangombe-current-user');
    this.currentUserSignal.set(null);
    this.router.navigateByUrl('/login');
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSignal();
  }

  hasRole(role: UserRole): boolean {
    return this.currentUserSignal()?.role === role;
  }

  private getStoredUser(): User | null {
    const raw = localStorage.getItem('jangombe-current-user');
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }
}
