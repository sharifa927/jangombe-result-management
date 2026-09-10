import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import type { SubjectItem } from '../models';

@Injectable({ providedIn: 'root' })
export class SubjectService {
  private readonly apiBaseUrl = 'http://localhost:3001/api';

  constructor(private readonly http: HttpClient) {}

  private readonly fallbackSubjects: SubjectItem[] = [
    { id: 'math', code: 'MTH101', name: 'Mathematics', numberOfTeachers: 3, status: 'Active' },
    { id: 'english', code: 'ENG101', name: 'English', numberOfTeachers: 2, status: 'Active' },
    { id: 'kiswahili', code: 'KIS101', name: 'Kiswahili', numberOfTeachers: 2, status: 'Active' },
    { id: 'physics', code: 'PHY101', name: 'Physics', numberOfTeachers: 2, status: 'Active' },
    { id: 'chemistry', code: 'CHE101', name: 'Chemistry', numberOfTeachers: 2, status: 'Active' },
    { id: 'biology', code: 'BIO101', name: 'Biology', numberOfTeachers: 2, status: 'Active' },
    { id: 'geography', code: 'GEO101', name: 'Geography', numberOfTeachers: 1, status: 'Active' },
    { id: 'history', code: 'HIS101', name: 'History', numberOfTeachers: 1, status: 'Active' },
    { id: 'computer-science', code: 'ICT101', name: 'Computer Science', numberOfTeachers: 2, status: 'Active' },
    { id: 'civics', code: 'CIV101', name: 'Civics', numberOfTeachers: 1, status: 'Active' },
  ];

  getSubjects() {
    return this.http.get<{ items: SubjectItem[] }>(`${this.apiBaseUrl}/subjects`).pipe(
      map((response) => response.items),
      catchError(() => of(this.fallbackSubjects)),
    );
  }

  getSubjectById(id: string) {
    return this.http.get<{ item: SubjectItem }>(`${this.apiBaseUrl}/subjects/${id}`).pipe(
      map((response) => response.item),
      catchError(() => of(this.fallbackSubjects.find((subject) => subject.id === id))),
    );
  }

  addSubject(subject: SubjectItem) {
    return this.http.post<{ item: SubjectItem }>(`${this.apiBaseUrl}/subjects`, subject).pipe(
      map((response) => response.item),
      catchError(() => of(subject)),
    );
  }

  updateSubject(id: string, subject: SubjectItem) {
    return this.http.put<{ item: SubjectItem }>(`${this.apiBaseUrl}/subjects/${id}`, subject).pipe(
      map((response) => response.item),
      catchError(() => of(subject)),
    );
  }

  deleteSubject(id: string) {
    return this.http.delete(`${this.apiBaseUrl}/subjects/${id}`).pipe(
      catchError(() => of(null)),
    );
  }
}
