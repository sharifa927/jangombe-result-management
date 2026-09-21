import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import type { User, UserRole } from '../models';
import { getApiBaseUrl } from '../config/api';

interface BackendLoginResponse {
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentUserSignal = signal<User | null>(this.getStoredUser());
  private readonly apiBaseUrl = getApiBaseUrl();

  constructor(
    private readonly router: Router,
    private readonly http: HttpClient,
  ) {}

  get currentUser() {
    return this.currentUserSignal();
  }

  login(email: string, password: string) {
    return this.http
      .post<BackendLoginResponse>(`${this.apiBaseUrl}/auth/login`, { email, password })
      .pipe(
        map((response) => {
          const safeUser: User = { ...response.user, password: '' };
          localStorage.setItem('jangombe-current-user', JSON.stringify(safeUser));
          this.currentUserSignal.set(safeUser);
          return true;
        }),
        catchError(() => of(false)),
      );
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
