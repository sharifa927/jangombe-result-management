import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getApiBaseUrl } from '../config/api';

export interface AssignmentRecord {
  id: number;
  teacher: { id: number; firstName: string; lastName: string; email: string };
  classEntity: { id: number; name: string; academicYear?: string };
  subject: { id: number; name: string };
  classTeacher: boolean;
}

export interface AssignmentSavedResponse {
  id: number;
  teacherId: number;
  classId: number;
  subjectId: number;
  classTeacher: boolean;
}

@Injectable({ providedIn: 'root' })
export class AssignmentService {
  private readonly apiBaseUrl = getApiBaseUrl();

  constructor(private readonly http: HttpClient) {}

  getAssignments() {
    return this.http.get<AssignmentRecord[]>(`${this.apiBaseUrl}/assignments`);
  }

  getMyAssignments() {
    return this.http.get<AssignmentRecord[]>(`${this.apiBaseUrl}/assignments/mine`);
  }

  addAssignment(assignment: { teacher: { id: number }; classEntity: { id: number }; subject: { id: number }; classTeacher: boolean }) {
    return this.http.post<AssignmentSavedResponse>(`${this.apiBaseUrl}/assignments`, assignment);
  }

  setClassTeacherRole(teacherId: number, classId: number, classTeacher: boolean) {
    return this.http.put<void>(`${this.apiBaseUrl}/assignments/class-teacher`, {
      teacherId,
      classId,
      classTeacher,
    });
  }

  deleteAssignment(id: number) {
    return this.http.delete<void>(`${this.apiBaseUrl}/assignments/${id}`);
  }
}
