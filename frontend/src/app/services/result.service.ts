import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import type { DashboardStats, ResultItem } from '../models';
import { getApiBaseUrl } from '../config/api';
import { formatAcademicTerm, normalizeAcademicTerm } from './academic-period';

export interface CalculatedStudentResult {
  studentId: number;
  studentName: string;
  admissionNumber: string;
  totalMarks: number;
  average: number;
  overallGrade: string;
  position: number;
  subjects: Array<{ subjectId: number; subjectName: string; marks: number; grade: string }>;
}

@Injectable({ providedIn: 'root' })
export class ResultService {
  private readonly apiBaseUrl = getApiBaseUrl();

  constructor(private readonly http: HttpClient) {}

  getResults() {
    return this.http.get<BackendResult[]>(`${this.apiBaseUrl}/results`).pipe(
      map((results) => results.map((result) => this.toResultItem(result))),
    );
  }

  calculateResults(classId: number, academicYear: string, term: string) {
    return this.http.post<CalculatedStudentResult[]>(`${this.apiBaseUrl}/results/calculate`, null, {
      params: { classId, academicYear, term: normalizeAcademicTerm(term) },
    });
  }

  getStudentResults(studentId: string) {
    return this.getResults().pipe(map((results) => results.filter((result) => result.studentId === studentId)));
  }

  getDashboardStats() {
    type DashboardSubmissionStatus = 'Pending' | 'Accepted' | 'Rejected' | 'Resubmitted';
    type DashboardSubmission = {
      teacher: string;
      className: string;
      subject: string;
      term: string;
      date: string;
      status: DashboardSubmissionStatus;
    };

    return this.http.get<{ stats: DashboardStats; recentSubmissions: DashboardSubmission[] }>(`${this.apiBaseUrl}/submissions/dashboard`).pipe(
      map((response) => ({
        stats: response.stats,
        recentSubmissions: response.recentSubmissions.map((item) => ({
          ...item,
          term: formatAcademicTerm(item.term),
          status: item.status as DashboardSubmissionStatus,
        })),
      })),
    );
  }

  private toResultItem(result: BackendResult): ResultItem {
    return {
      id: String(result.id),
      studentId: String(result.student.id),
      classId: String(result.classEntity.id),
      academicYear: result.academicYear,
      term: result.term,
      subjectResults: [],
      totalMarks: Number(result.totalMarks ?? 0),
      average: Number(result.average ?? 0),
      overallGrade: result.overallGrade ?? '',
      position: result.position ?? 0,
    };
  }
}

interface BackendResult {
  id: number;
  student: { id: number };
  classEntity: { id: number };
  academicYear: string;
  term: string;
  totalMarks: number | string | null;
  average: number | string | null;
  overallGrade: string | null;
  position: number | null;
}
