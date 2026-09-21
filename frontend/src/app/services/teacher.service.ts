import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import type { Teacher } from '../models';
import { getApiBaseUrl } from '../config/api';

@Injectable({ providedIn: 'root' })
export class TeacherService {
  private readonly apiBaseUrl = getApiBaseUrl();

  constructor(private readonly http: HttpClient) {}

  private readonly fallbackTeachers: Teacher[] = [
    {
      id: 'teacher-1',
      firstName: 'Asha',
      middleName: 'Ali',
      lastName: 'Mohamed',
      email: 'teacher@jangombe.ac.tz',
      phone: '+255 712 345 678',
      gender: 'Female',
      username: 'asha.ali',
      password: 'teacher123',
      teacherType: 'Class & Subject Teacher',
      status: 'Active',
      assignedClasses: ['class-2a', 'class-3b'],
      assignedSubjects: ['math', 'physics', 'computer-science'],
    },
    {
      id: 'teacher-2',
      firstName: 'Khamis',
      middleName: 'Juma',
      lastName: 'Mbezi',
      email: 'khamis.mbezi@jangombe.ac.tz',
      phone: '+255 713 222 333',
      gender: 'Male',
      username: 'khamis.mbezi',
      password: 'teacher123',
      teacherType: 'Class Teacher',
      status: 'Active',
      assignedClasses: ['class-1a', 'class-2b'],
      assignedSubjects: ['english'],
    },
    {
      id: 'teacher-3',
      firstName: 'Fatma',
      middleName: 'Abdallah',
      lastName: 'Mroso',
      email: 'fatma.mroso@jangombe.ac.tz',
      phone: '+255 766 784 125',
      gender: 'Female',
      username: 'fatma.mroso',
      password: 'teacher123',
      teacherType: 'Subject Teacher',
      status: 'Active',
      assignedClasses: ['class-3a'],
      assignedSubjects: ['biology', 'chemistry'],
    },
    {
      id: 'teacher-4',
      firstName: 'Juma',
      middleName: 'Hassan',
      lastName: 'Mneni',
      email: 'juma.mneni@jangombe.ac.tz',
      phone: '+255 765 555 111',
      gender: 'Male',
      username: 'juma.mneni',
      password: 'teacher123',
      teacherType: 'Class Teacher',
      status: 'On Leave',
      assignedClasses: ['class-4a'],
      assignedSubjects: ['history'],
    },
  ];

  getTeachers() {
    return this.http.get<{ items: Teacher[] }>(`${this.apiBaseUrl}/teachers`).pipe(
      map((response) => response.items),
      catchError(() => of(this.fallbackTeachers)),
    );
  }

  getTeacherById(id: string) {
    return this.http.get<{ item: Teacher }>(`${this.apiBaseUrl}/teachers/${id}`).pipe(
      map((response) => response.item),
      catchError(() => of(this.fallbackTeachers.find((teacher) => teacher.id === id))),
    );
  }

  addTeacher(teacher: Teacher) {
    return this.http.post<{ item: Teacher }>(`${this.apiBaseUrl}/teachers`, teacher).pipe(
      map((response) => response.item),
      catchError(() => of(teacher)),
    );
  }

  updateTeacher(id: string, teacher: Teacher) {
    return this.http.put<{ item: Teacher }>(`${this.apiBaseUrl}/teachers/${id}`, teacher).pipe(
      map((response) => response.item),
      catchError(() => of(teacher)),
    );
  }

  deleteTeacher(id: string) {
    return this.http.delete(`${this.apiBaseUrl}/teachers/${id}`).pipe(
      catchError(() => of(null)),
    );
  }
}
