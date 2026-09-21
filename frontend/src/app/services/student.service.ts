import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import type { Student } from '../models';
import { getApiBaseUrl } from '../config/api';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private readonly apiBaseUrl = getApiBaseUrl();

  constructor(private readonly http: HttpClient) {}

  private readonly fallbackStudents: Student[] = [
    { id: 'std-1', admissionNumber: 'JG001', firstName: 'Amina', middleName: 'Ali', lastName: 'Hassan', gender: 'Female', dateOfBirth: '2011-04-12', classId: 'class-2a', status: 'Active' },
    { id: 'std-2', admissionNumber: 'JG002', firstName: 'Juma', middleName: 'Omar', lastName: 'Kibwana', gender: 'Male', dateOfBirth: '2010-08-28', classId: 'class-2a', status: 'Active' },
    { id: 'std-3', admissionNumber: 'JG003', firstName: 'Fatma', middleName: 'Said', lastName: 'Mselem', gender: 'Female', dateOfBirth: '2011-11-20', classId: 'class-2a', status: 'Active' },
    { id: 'std-4', admissionNumber: 'JG004', firstName: 'Mohamed', middleName: 'Abdallah', lastName: 'Kisusi', gender: 'Male', dateOfBirth: '2010-06-26', classId: 'class-2a', status: 'Active' },
    { id: 'std-5', admissionNumber: 'JG005', firstName: 'Salma', middleName: 'Khamis', lastName: 'Mosha', gender: 'Female', dateOfBirth: '2011-01-13', classId: 'class-2a', status: 'Active' },
    { id: 'std-6', admissionNumber: 'JG006', firstName: 'Yusuf', middleName: 'Mussa', lastName: 'Haji', gender: 'Male', dateOfBirth: '2010-09-15', classId: 'class-3b', status: 'Active' },
    { id: 'std-7', admissionNumber: 'JG007', firstName: 'Grace', middleName: 'John', lastName: 'Mwanga', gender: 'Female', dateOfBirth: '2011-03-18', classId: 'class-3b', status: 'Active' },
    { id: 'std-8', admissionNumber: 'JG008', firstName: 'Amani', middleName: 'Suleiman', lastName: 'Amani', gender: 'Female', dateOfBirth: '2010-12-09', classId: 'class-3b', status: 'Active' },
    { id: 'std-9', admissionNumber: 'JG009', firstName: 'Ibrahim', middleName: 'Bakari', lastName: 'Mikidadi', gender: 'Male', dateOfBirth: '2011-07-05', classId: 'class-1a', status: 'Active' },
    { id: 'std-10', admissionNumber: 'JG010', firstName: 'Mariam', middleName: 'Mshindo', lastName: 'Said', gender: 'Female', dateOfBirth: '2012-02-23', classId: 'class-1a', status: 'Active' },
  ];

  getStudents() {
    return this.http.get<{ items: Student[] }>(`${this.apiBaseUrl}/students`).pipe(
      map((response) => response.items),
      catchError(() => of(this.fallbackStudents)),
    );
  }

  getStudentsByClass(classId: string) {
    return this.http.get<{ items: Student[] }>(`${this.apiBaseUrl}/students?classId=${classId}`).pipe(
      map((response) => response.items),
      catchError(() => of(this.fallbackStudents.filter((student) => student.classId === classId))),
    );
  }

  getStudentById(id: string) {
    return this.http.get<{ item: Student }>(`${this.apiBaseUrl}/students/${id}`).pipe(
      map((response) => response.item),
      catchError(() => of(this.fallbackStudents.find((student) => student.id === id))),
    );
  }

  addStudent(student: Student) {
    return this.http.post<{ item: Student }>(`${this.apiBaseUrl}/students`, student).pipe(
      map((response) => response.item),
      catchError(() => of(student)),
    );
  }

  updateStudent(id: string, student: Student) {
    return this.http.put<{ item: Student }>(`${this.apiBaseUrl}/students/${id}`, student).pipe(
      map((response) => response.item),
      catchError(() => of(student)),
    );
  }

  deleteStudent(id: string) {
    return this.http.delete(`${this.apiBaseUrl}/students/${id}`).pipe(
      catchError(() => of(null)),
    );
  }
}
