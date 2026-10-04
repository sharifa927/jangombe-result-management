import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import type { User, UserRole } from '../models';
import { getApiBaseUrl } from '../config/api';

interface BackendLoginResponse {
  id: number;
  username: string;
  role: UserRole;
  teacherId?: number;
  firstName?: string;
  lastName?: string;
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

  login(username: string, password: string) {
    return this.http
      .post<BackendLoginResponse>(
        `${this.apiBaseUrl}/auth/login`,
        { username, password }
      )
      .pipe(
        map((response) => {
          const safeUser: User = {
            ...response,
            id: response.id,
            username: response.username,
            email: response.username,
            firstName: response.firstName ?? response.username,
            lastName: response.lastName ?? '',
            password: '',
            role: response.role,
            teacherId: response.teacherId,
          };

          localStorage.setItem(
            'jangombe-current-user',
            JSON.stringify(safeUser)
          );

          this.currentUserSignal.set(safeUser);
          return true;
        }),
        catchError(() => of(false)),
      );
  }

  registerTeacher(details: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }) {
    return this.http.post<BackendLoginResponse>(
      `${this.apiBaseUrl}/auth/register`,
      details,
    );
  }

  logout(): void {
    this.http.post<void>(`${this.apiBaseUrl}/auth/logout`, null).subscribe({
      complete: () => this.clearCurrentUser(),
      error: () => this.clearCurrentUser(),
    });
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSignal();
  }

  hasRole(role: UserRole): boolean {
    return this.currentUserSignal()?.role === role;
  }

  updateCurrentUserProfile(profile: { email: string; firstName: string; lastName: string }): void {
    const currentUser = this.currentUserSignal();
    if (!currentUser) return;

    const updatedUser: User = {
      ...currentUser,
      email: profile.email,
      username: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
    };
    localStorage.setItem('jangombe-current-user', JSON.stringify(updatedUser));
    this.currentUserSignal.set(updatedUser);
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

  private clearCurrentUser(): void {
    localStorage.removeItem('jangombe-current-user');
    this.currentUserSignal.set(null);
    this.router.navigateByUrl('/login');
  }
}
