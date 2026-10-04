import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import type { Student } from '../models';
import { getApiBaseUrl } from '../config/api';

interface BackendStudent extends Omit<Student, 'id' | 'classId' | 'gender' | 'status'> {
  id: number;
  classEntity: { id: number };
  gender: string;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class StudentService {
  private readonly apiBaseUrl = getApiBaseUrl();

  constructor(private readonly http: HttpClient) {}

  getStudents() {
    return this.http.get<BackendStudent[]>(`${this.apiBaseUrl}/students`).pipe(
      map((students) => students.map((student) => this.toFrontendStudent(student))),
    );
  }

  getStudentsByClass(classId: string) {
    return this.http.get<BackendStudent[]>(`${this.apiBaseUrl}/students/class/${classId}`).pipe(
      map((students) => students.map((student) => this.toFrontendStudent(student))),
    );
  }

  getStudentById(id: string) {
    return this.http.get<BackendStudent>(`${this.apiBaseUrl}/students/${id}`).pipe(
      map((student) => this.toFrontendStudent(student)),
    );
  }

  addStudent(student: Student) {
    return this.http.post<BackendStudent>(`${this.apiBaseUrl}/students`, this.toBackendStudent(student)).pipe(
      map((response) => this.toFrontendStudent(response)),
    );
  }

  updateStudent(id: string, student: Student) {
    return this.http.put<BackendStudent>(`${this.apiBaseUrl}/students/${id}`, this.toBackendStudent(student)).pipe(
      map((response) => this.toFrontendStudent(response)),
    );
  }

  deleteStudent(id: string) {
    return this.http.delete<void>(`${this.apiBaseUrl}/students/${id}`);
  }

  private toFrontendStudent(student: BackendStudent): Student {
    return {
      ...student,
      id: String(student.id),
      classId: String(student.classEntity.id),
      gender: student.gender.toUpperCase() === 'MALE' ? 'Male' : 'Female',
      status: student.status.toUpperCase() === 'ACTIVE' ? 'Active' : 'Inactive',
    };
  }

  private toBackendStudent(student: Student): Omit<BackendStudent, 'id'> {
    const { id, classId, gender, status, ...fields } = student;
    return {
      ...fields,
      gender: gender.toUpperCase(),
      status: status.toUpperCase(),
      classEntity: { id: Number(classId) },
    };
  }
}
