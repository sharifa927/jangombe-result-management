import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import type { DashboardStats, ResultItem } from '../models';

@Injectable({ providedIn: 'root' })
export class ResultService {
  private readonly apiBaseUrl = 'http://localhost:3001/api';

  constructor(private readonly http: HttpClient) {}

  private readonly fallbackResults: ResultItem[] = [
    {
      id: 'result-1',
      studentId: 'std-1',
      classId: 'class-2a',
      academicYear: '2026',
      term: 'Term 1',
      subjectResults: [
        { subjectId: 'math', subjectName: 'Mathematics', marks: 78, grade: 'A' },
        { subjectId: 'english', subjectName: 'English', marks: 68, grade: 'B' },
        { subjectId: 'physics', subjectName: 'Physics', marks: 72, grade: 'B' },
        { subjectId: 'chemistry', subjectName: 'Chemistry', marks: 61, grade: 'C' },
      ],
      totalMarks: 279,
      average: 69.75,
      overallGrade: 'B',
      position: 4,
    },
    {
      id: 'result-2',
      studentId: 'std-2',
      classId: 'class-2a',
      academicYear: '2026',
      term: 'Term 1',
      subjectResults: [
        { subjectId: 'math', subjectName: 'Mathematics', marks: 65, grade: 'B' },
        { subjectId: 'english', subjectName: 'English', marks: 58, grade: 'C' },
        { subjectId: 'physics', subjectName: 'Physics', marks: 70, grade: 'B' },
        { subjectId: 'chemistry', subjectName: 'Chemistry', marks: 55, grade: 'C' },
      ],
      totalMarks: 248,
      average: 62,
      overallGrade: 'C',
      position: 7,
    },
  ];

  getResults() {
    return this.http.get<{ items: ResultItem[] }>(`${this.apiBaseUrl}/results`).pipe(
      map((response) => response.items),
      catchError(() => of(this.fallbackResults)),
    );
  }

  getStudentResults(studentId: string) {
    return this.http.get<{ items: ResultItem[] }>(`${this.apiBaseUrl}/results?studentId=${studentId}`).pipe(
      map((response) => response.items),
      catchError(() => of(this.fallbackResults.filter((result) => result.studentId === studentId))),
    );
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

    return this.http.get<{ stats: DashboardStats; recentSubmissions: DashboardSubmission[] }>(`${this.apiBaseUrl}/dashboard`).pipe(
      map((response) => ({
        stats: response.stats,
        recentSubmissions: response.recentSubmissions.map((item) => ({
          ...item,
          status: item.status as DashboardSubmissionStatus,
        })),
      })),
      catchError(() => of({
        stats: {
          totalTeachers: 28,
          totalStudents: 642,
          totalClasses: 18,
          totalSubjects: 14,
          pendingSubmissions: 7,
          completedResults: 11,
        },
        recentSubmissions: [
          { teacher: 'Asha Ali', className: 'Form 2A', subject: 'Mathematics', term: 'Term 1', date: '2026-09-05', status: 'Pending' },
          { teacher: 'Khamis Mbezi', className: 'Form 1A', subject: 'English', term: 'Term 1', date: '2026-09-04', status: 'Accepted' },
          { teacher: 'Fatma Mroso', className: 'Form 3A', subject: 'Biology', term: 'Term 1', date: '2026-09-03', status: 'Rejected' },
        ] as DashboardSubmission[],
      })),
    );
  }
}
