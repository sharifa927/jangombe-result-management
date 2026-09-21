import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import type { ClassItem } from '../models';
import { getApiBaseUrl } from '../config/api';

@Injectable({ providedIn: 'root' })
export class ClassService {
  private readonly apiBaseUrl = getApiBaseUrl();

  constructor(private readonly http: HttpClient) {}

  private readonly fallbackClasses: ClassItem[] = [
    { id: 'class-1a', name: 'Form 1A', numberOfStudents: 41, classTeacherId: 'teacher-2', status: 'Active' },
    { id: 'class-1b', name: 'Form 1B', numberOfStudents: 39, classTeacherId: 'teacher-3', status: 'Active' },
    { id: 'class-2a', name: 'Form 2A', numberOfStudents: 42, classTeacherId: 'teacher-1', status: 'Active' },
    { id: 'class-2b', name: 'Form 2B', numberOfStudents: 40, classTeacherId: 'teacher-2', status: 'Active' },
    { id: 'class-3a', name: 'Form 3A', numberOfStudents: 45, classTeacherId: 'teacher-3', status: 'Active' },
    { id: 'class-3b', name: 'Form 3B', numberOfStudents: 44, classTeacherId: 'teacher-1', status: 'Active' },
    { id: 'class-4a', name: 'Form 4A', numberOfStudents: 38, classTeacherId: 'teacher-4', status: 'Active' },
    { id: 'class-4b', name: 'Form 4B', numberOfStudents: 37, classTeacherId: 'teacher-2', status: 'Active' },
  ];

  getClasses() {
    return this.http.get<{ items: ClassItem[] }>(`${this.apiBaseUrl}/classes`).pipe(
      map((response) => response.items),
      catchError(() => of(this.fallbackClasses)),
    );
  }

  getClassById(id: string) {
    return this.http.get<{ item: ClassItem }>(`${this.apiBaseUrl}/classes/${id}`).pipe(
      map((response) => response.item),
      catchError(() => of(this.fallbackClasses.find((cls) => cls.id === id))),
    );
  }

  addClass(cls: ClassItem) {
    return this.http.post<{ item: ClassItem }>(`${this.apiBaseUrl}/classes`, cls).pipe(
      map((response) => response.item),
      catchError(() => of(cls)),
    );
  }

  updateClass(id: string, cls: ClassItem) {
    return this.http.put<{ item: ClassItem }>(`${this.apiBaseUrl}/classes/${id}`, cls).pipe(
      map((response) => response.item),
      catchError(() => of(cls)),
    );
  }

  deleteClass(id: string) {
    return this.http.delete(`${this.apiBaseUrl}/classes/${id}`).pipe(
      catchError(() => of(null)),
    );
  }
}
