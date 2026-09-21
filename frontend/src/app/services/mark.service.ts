import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import type { Mark, Submission } from '../models';
import { getApiBaseUrl } from '../config/api';

export interface SubmissionReviewItem {
  id: string;
  teacher: string;
  className: string;
  subject: string;
  students: number;
  date: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Resubmitted';
  rejectionReason?: string;
  studentRows: Array<{
    name: string;
    marks: number;
    grade: string;
    remarks: string;
  }>;
}

@Injectable({ providedIn: 'root' })
export class MarkService {
  private readonly apiBaseUrl = getApiBaseUrl();

  constructor(private readonly http: HttpClient) {}

  private readonly teacherNameMap: Record<string, string> = {
    'teacher-1': 'Asha Ali',
    'teacher-2': 'Khamis Mbezi',
    'admin-1': 'Admin User',
  };

  private readonly marks: Mark[] = [
    {
      id: 'mark-1',
      studentId: 'std-1',
      subjectId: 'math',
      classId: 'class-2a',
      teacherId: 'teacher-1',
      marks: 78,
      grade: 'A',
      remarks: 'Good',
      term: 'Term 1',
      academicYear: '2026',
      status: 'Submitted',
    },
    {
      id: 'mark-2',
      studentId: 'std-2',
      subjectId: 'math',
      classId: 'class-2a',
      teacherId: 'teacher-1',
      marks: 65,
      grade: 'B',
      remarks: 'Good',
      term: 'Term 1',
      academicYear: '2026',
      status: 'Submitted',
    },
    {
      id: 'mark-3',
      studentId: 'std-3',
      subjectId: 'math',
      classId: 'class-2a',
      teacherId: 'teacher-1',
      marks: 42,
      grade: 'D',
      remarks: 'Fair',
      term: 'Term 1',
      academicYear: '2026',
      status: 'Submitted',
    },
  ];

  private readonly submissions: Submission[] = [
    {
      id: 'sub-1',
      teacherId: 'teacher-1',
      classId: 'class-2a',
      subjectId: 'math',
      term: 'Term 1',
      academicYear: '2026',
      students: 42,
      submittedDate: '2026-09-05',
      status: 'Accepted',
    },
    {
      id: 'sub-2',
      teacherId: 'teacher-1',
      classId: 'class-2a',
      subjectId: 'physics',
      term: 'Term 1',
      academicYear: '2026',
      students: 42,
      submittedDate: '2026-09-06',
      status: 'Pending',
    },
  ];

  private readonly reviewItems: SubmissionReviewItem[] = [
    {
      id: 'sub-1',
      teacher: 'Asha Ali',
      className: 'Form 2A',
      subject: 'Mathematics',
      students: 42,
      date: '2026-09-05',
      status: 'Accepted',
      studentRows: [
        { name: 'Amina Ali', marks: 78, grade: 'A', remarks: 'Good' },
        { name: 'Juma Omar', marks: 65, grade: 'B', remarks: 'Good' },
        { name: 'Fatma Said', marks: 42, grade: 'D', remarks: 'Fair' },
      ],
    },
    {
      id: 'sub-2',
      teacher: 'Khamis Mbezi',
      className: 'Form 1A',
      subject: 'English',
      students: 41,
      date: '2026-09-04',
      status: 'Pending',
      studentRows: [
        { name: 'Ibrahim Salim', marks: 72, grade: 'B', remarks: 'Good' },
        { name: 'Hawa Juma', marks: 60, grade: 'C', remarks: 'Satisfactory' },
        { name: 'Abdallah Msuya', marks: 48, grade: 'D', remarks: 'Needs support' },
      ],
    },
    {
      id: 'sub-3',
      teacher: 'Fatma Mroso',
      className: 'Form 3A',
      subject: 'Biology',
      students: 45,
      date: '2026-09-03',
      status: 'Rejected',
      rejectionReason: 'Several marks are missing or out of range.',
      studentRows: [
        { name: 'Mwanahamisi H.', marks: 88, grade: 'A', remarks: 'Excellent' },
        { name: 'Salum Chikomo', marks: 35, grade: 'E', remarks: 'Needs support' },
        { name: 'Ruth Komba', marks: 92, grade: 'A', remarks: 'Excellent' },
      ],
    },
    {
      id: 'sub-4',
      teacher: 'Asha Ali',
      className: 'Form 2B',
      subject: 'Physics',
      students: 40,
      date: '2026-09-08',
      status: 'Resubmitted',
      studentRows: [
        { name: 'Mariam Kitwana', marks: 84, grade: 'A', remarks: 'Excellent' },
        { name: 'Said Mwarabu', marks: 67, grade: 'B', remarks: 'Good' },
        { name: 'Nuru Makame', marks: 53, grade: 'C', remarks: 'Fair' },
      ],
    },
  ];

  getMarks(): Mark[] {
    return [...this.marks];
  }

  getSubmissionByTeacher(teacherId: string): Submission[] {
    return this.submissions.filter((submission) => submission.teacherId === teacherId);
  }

  getAllSubmissions(): Submission[] {
    return [...this.submissions];
  }

  getReviewItems(): SubmissionReviewItem[] {
    return this.reviewItems.map((item) => ({ ...item, studentRows: [...item.studentRows] }));
  }

  loadReviewItemsFromApi() {
    return this.http.get<{ items: Array<{ id: string; teacherId: string; className: string; subject: string; status: string; students: number; submittedDate: string }> }>(`${this.apiBaseUrl}/submissions`).pipe(
      map((response) =>
        response.items.map((item) => ({
          id: item.id,
          teacher: this.teacherNameMap[item.teacherId] ?? item.teacherId,
          className: item.className,
          subject: item.subject,
          students: item.students,
          date: item.submittedDate,
          status: item.status as 'Pending' | 'Accepted' | 'Rejected' | 'Resubmitted',
          studentRows: [],
        })),
      ),
      catchError(() => of(this.getReviewItems())),
    );
  }

  getTeacherSubmissions(teacherId: string) {
    return this.http.get<{ items: Submission[] }>(`${this.apiBaseUrl}/teachers/${teacherId}/submissions`).pipe(
      map((response) => response.items),
      catchError(() => of(this.getSubmissionByTeacher(teacherId))),
    );
  }

  getReviewItemById(id: string): SubmissionReviewItem | undefined {
    const item = this.reviewItems.find((submission) => submission.id === id);
    return item ? { ...item, studentRows: [...item.studentRows] } : undefined;
  }

  updateReviewStatus(id: string, status: 'Accepted' | 'Rejected', reason?: string): void {
    const item = this.reviewItems.find((submission) => submission.id === id);
    if (!item) {
      return;
    }

    item.status = status;
    item.rejectionReason = status === 'Rejected' ? reason ?? item.rejectionReason ?? 'Submission did not meet the minimum review standard.' : undefined;

    const submissionIndex = this.submissions.findIndex((record) => record.id === id);
    if (submissionIndex >= 0) {
      this.submissions[submissionIndex] = {
        ...this.submissions[submissionIndex],
        status,
        rejectionReason: reason,
      };
    }
  }

  setSubmissionStatus(
    teacher: string,
    className: string,
    subject: string,
    status: 'Pending' | 'Accepted' | 'Rejected' | 'Resubmitted' | 'Submitted',
  ): void {
    const item = this.reviewItems.find(
      (submission) =>
        submission.teacher === teacher &&
        submission.className === className &&
        submission.subject === subject,
    );

    if (!item) {
      const newItem: SubmissionReviewItem = {
        id: `sub-${Date.now()}`,
        teacher,
        className,
        subject,
        students: 42,
        date: new Date().toISOString().slice(0, 10),
        status: status === 'Accepted' || status === 'Rejected' || status === 'Pending' || status === 'Resubmitted' ? status : 'Pending',
        studentRows: [],
      };
      this.reviewItems.push(newItem);
      return;
    }

    item.status = status === 'Accepted' || status === 'Rejected' || status === 'Pending' || status === 'Resubmitted' ? status : 'Pending';
  }

  submitMarksForClass(classId: string, subjectId: string, studentMarks: Mark[]): void {
    this.marks.push(...studentMarks);
    const index = this.submissions.findIndex(
      (submission) => submission.classId === classId && submission.subjectId === subjectId,
    );
    if (index >= 0) {
      this.submissions[index] = { ...this.submissions[index], status: 'Submitted' };
    }
  }

  updateSubmissionStatus(id: string, status: 'Accepted' | 'Rejected', reason?: string): void {
    const index = this.submissions.findIndex((submission) => submission.id === id);
    if (index >= 0) {
      this.submissions[index] = {
        ...this.submissions[index],
        status,
        rejectionReason: reason,
      };
    }

    const reviewItem = this.reviewItems.find((submission) => submission.id === id);
    if (reviewItem) {
      reviewItem.status = status;
      reviewItem.rejectionReason = status === 'Rejected' ? reason ?? 'Submission did not meet the minimum review standard.' : undefined;
    }
  }

  calculateGrade(marks: number): string {
    if (marks >= 75) return 'A';
    if (marks >= 65) return 'B';
    if (marks >= 45) return 'C';
    if (marks >= 30) return 'D';
    return 'F';
  }

  gradeRemarks(marks: number): string {
    if (marks >= 75) return 'Excellent';
    if (marks >= 65) return 'Good';
    if (marks >= 45) return 'Fair';
    if (marks >= 30) return 'Needs Improvement';
    return 'Poor';
  }
}
