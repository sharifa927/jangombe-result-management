import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, of, switchMap } from 'rxjs';
import type { Mark } from '../models';
import { getApiBaseUrl } from '../config/api';
import { formatAcademicTerm } from './academic-period';

export interface SubmissionReviewItem {
  id: string;
  teacher: string;
  className: string;
  subject: string;
  students: number;
  date: string;
  term: string;
  status: 'Draft' | 'Pending' | 'Submitted' | 'Accepted' | 'Rejected' | 'Resubmitted';
  rejectionReason?: string;
  studentRows: Array<{
    name: string;
    marks: number;
  }>;
}

export interface TeacherSubmissionRow {
  id: string;
  classId: string;
  subjectId: string;
  className: string;
  subject: string;
  term: string;
  year: string;
  students: number;
  date: string;
  status: SubmissionReviewItem['status'];
  rejectionReason?: string;
}

@Injectable({ providedIn: 'root' })
export class MarkService {
  private readonly apiBaseUrl = getApiBaseUrl();

  constructor(private readonly http: HttpClient) {}

  loadReviewItemsFromApi() {
    return this.http.get<BackendSubmission[]>(`${this.apiBaseUrl}/submissions`).pipe(
      switchMap((items) => items.length ? forkJoin(items.map((item) => this.toReviewItem(item))) : of([])),
    );
  }

  getMySubmissions() {
    return forkJoin({
      submissions: this.http.get<BackendSubmission[]>(`${this.apiBaseUrl}/submissions/mine`),
      marks: this.http.get<BackendMark[]>(`${this.apiBaseUrl}/marks/mine`),
    }).pipe(
      map(({ submissions, marks }) => submissions.map((item) => {
        const studentIds = new Set(marks
          .filter((mark) => mark.classEntity.id === item.classEntity.id
            && mark.subject.id === item.subject.id
            && mark.academicYear === item.academicYear
            && mark.term === item.term)
          .map((mark) => mark.student.id));
        return {
          id: String(item.id),
          classId: String(item.classEntity.id),
          subjectId: String(item.subject.id),
          className: item.classEntity.name,
          subject: item.subject.name,
          term: item.term,
          year: item.academicYear,
          students: studentIds.size,
          date: item.submittedAt?.slice(0, 10) ?? '',
          status: this.toUiStatus(item.status),
          rejectionReason: item.rejectionReason ?? undefined,
        };
      })),
    );
  }

  getMarksByClass(classId: string) {
    return this.http.get<BackendMark[]>(`${this.apiBaseUrl}/marks/class/${classId}`);
  }

  submitMarksAndSubmission(
    submission: { teacherId: number; classId: number; subjectId: number; academicYear: string; term: string },
    marks: Array<{ id?: number; studentId: number; marks: number }>,
  ) {
    const savedMarks = marks.length
      ? forkJoin(marks.map((item) => {
          const payload = {
            student: { id: item.studentId },
            subject: { id: submission.subjectId },
            teacher: { id: submission.teacherId },
            classEntity: { id: submission.classId },
            academicYear: submission.academicYear,
            term: submission.term,
            marks: item.marks,
            status: 'SUBMITTED',
          };
          return item.id
            ? this.http.put(`${this.apiBaseUrl}/marks/${item.id}`, payload)
            : this.http.post(`${this.apiBaseUrl}/marks`, payload);
        }))
      : of([]);
    return savedMarks.pipe(switchMap(() => this.http.post(`${this.apiBaseUrl}/submissions`, {
      teacher: { id: submission.teacherId },
      classEntity: { id: submission.classId },
      subject: { id: submission.subjectId },
      academicYear: submission.academicYear,
      term: submission.term,
      status: 'PENDING',
    })));
  }

  getReviewItemById(id: string) {
    return this.http.get<BackendSubmission>(`${this.apiBaseUrl}/submissions/${id}`).pipe(
      switchMap((item) => this.toReviewItem(item)),
    );
  }

  updateReviewStatus(id: string, status: 'Accepted' | 'Rejected', reason?: string) {
    const backendStatus = status === 'Accepted' ? 'APPROVED' : 'REJECTED';
    const params: Record<string, string> = { status: backendStatus };
    if (reason) params['rejectionReason'] = reason;
    return this.http.put<BackendSubmission>(`${this.apiBaseUrl}/submissions/${id}/status`, null, { params });
  }

  private toReviewItem(item: BackendSubmission) {
    return this.http.get<BackendMark[]>(`${this.apiBaseUrl}/marks/class/${item.classEntity.id}`).pipe(
      map((marks) => {
        const studentRows = marks
          .filter((mark) => mark.subject.id === item.subject.id
            && mark.teacher.id === item.teacher.id
            && mark.academicYear === item.academicYear
            && mark.term === item.term)
          .map((mark) => ({
            name: `${mark.student.firstName} ${mark.student.lastName}`.trim(),
            marks: Number(mark.marks),
          }));
        return {
          id: String(item.id),
          teacher: `${item.teacher.firstName} ${item.teacher.lastName}`.trim(),
          className: item.classEntity.name,
          subject: item.subject.name,
          term: formatAcademicTerm(item.term),
          students: studentRows.length,
          date: item.submittedAt?.slice(0, 10) ?? '',
          status: this.toUiStatus(item.status),
          rejectionReason: item.rejectionReason ?? undefined,
          studentRows,
        } satisfies SubmissionReviewItem;
      }),
    );
  }

  private toUiStatus(status: string): SubmissionReviewItem['status'] {
    const normalized = status.toUpperCase();
    if (normalized === 'APPROVED' || normalized === 'ACCEPTED') return 'Accepted';
    if (normalized === 'REJECTED') return 'Rejected';
    if (normalized === 'RESUBMITTED') return 'Resubmitted';
    if (normalized === 'DRAFT') return 'Draft';
    if (normalized === 'SUBMITTED') return 'Submitted';
    return 'Pending';
  }

}

interface BackendSubmission {
  id: number;
  teacher: { id: number; firstName: string; lastName: string };
  classEntity: { id: number; name: string };
  subject: { id: number; name: string };
  academicYear: string;
  term: string;
  status: string;
  submittedAt: string | null;
  rejectionReason: string | null;
}

interface BackendMark {
  id: number;
  student: { id: number; firstName: string; lastName: string };
  classEntity: { id: number };
  subject: { id: number };
  teacher: { id: number };
  marks: number | string;
  status: string;
  academicYear: string;
  term: string;
}
