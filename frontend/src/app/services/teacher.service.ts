import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import type { Teacher } from '../models';
import { getApiBaseUrl } from '../config/api';

export interface TeacherProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class TeacherService {
  private readonly apiBaseUrl = getApiBaseUrl();

  constructor(private readonly http: HttpClient) {}

  getTeachers() {
    return this.http.get<Teacher[]>(`${this.apiBaseUrl}/teachers`);
  }

  getTeacherById(id: string | number) {
    return this.http.get<Teacher>(`${this.apiBaseUrl}/teachers/${id}`);
  }

  getMyProfile() {
    return this.http.get<TeacherProfile>(`${this.apiBaseUrl}/teachers/me`);
  }

  updateMyProfile(profile: Pick<TeacherProfile, 'firstName' | 'lastName' | 'email' | 'phone'>) {
    return this.http.put<TeacherProfile>(`${this.apiBaseUrl}/teachers/me`, profile);
  }

  addTeacher(teacher: Teacher) {
    const { id, ...payload } = teacher;
    return this.http.post<Teacher>(`${this.apiBaseUrl}/teachers`, payload);
  }

  updateTeacher(id: string | number, teacher: Teacher) {
    return this.http.put<Teacher>(`${this.apiBaseUrl}/teachers/${id}`, teacher);
  }

  deleteTeacher(id: string | number) {
    return this.http.delete<void>(`${this.apiBaseUrl}/teachers/${id}`);
  }
}
