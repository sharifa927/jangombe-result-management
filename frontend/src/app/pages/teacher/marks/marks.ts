import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { MarkService, type TeacherSubmissionRow } from '../../../services/mark.service';
import { AssignmentService, type AssignmentRecord } from '../../../services/assignment.service';
import { StudentService } from '../../../services/student.service';
import { ACADEMIC_TERM_OPTIONS, ACADEMIC_YEAR_OPTIONS, formatAcademicTerm, normalizeAcademicTerm } from '../../../services/academic-period';

@Component({
  selector: 'app-teacher-marks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="page-shell">
      <div class="page-header">
        <div>
          <p class="eyebrow">Academic Entry</p>
          <h2>Enter Marks</h2>
        </div>
        <button type="button" class="refresh-button" [disabled]="loadingAssignments || saving" (click)="refreshAssignments()">
          {{ loadingAssignments ? 'Refreshing...' : 'Refresh assignments' }}
        </button>
      </div>

      <p class="message error-message" role="alert" *ngIf="errorMessage">{{ errorMessage }}</p>
      <p class="message success-message" role="status" *ngIf="successMessage">{{ successMessage }}</p>
      <div class="review-note card" *ngIf="currentSubmission?.rejectionReason">
        <strong>Admin review note</strong>
        <p>{{ currentSubmission?.rejectionReason }}</p>
      </div>
      <p class="message" *ngIf="loadingAssignments">Loading your class and subject assignments...</p>
      <p class="empty-note" *ngIf="!loadingAssignments && !assignments.length && !errorMessage">No classes or subjects have been assigned to your account yet.</p>

      <div class="assignment-grid">
        <div class="assignment-card card">
          <h3>Assigned Classes</h3>
          <div class="chip-list">
            <button
              *ngFor="let myClass of assignedClasses"
              type="button"
              class="chip"
              [class.active]="myClass.id.toString() === selectedClassId"
              (click)="selectClass(myClass.id.toString())"
            >
              {{ myClass.name }}
            </button>
          </div>
          <p class="empty-note" *ngIf="!loadingAssignments && !assignedClasses.length">No classes are assigned to your teacher account.</p>
        </div>

        <div class="assignment-card card">
          <h3>Assigned Subjects</h3>
          <div class="chip-list">
            <button
              *ngFor="let subject of assignedSubjects"
              type="button"
              class="chip"
              [class.active]="subject.id.toString() === selectedSubjectId"
              (click)="selectSubject(subject.id.toString())"
            >
              {{ subject.name }}
            </button>
          </div>
          <p class="empty-note" *ngIf="selectedClassId && !assignedSubjects.length">No subjects are assigned to this class.</p>
        </div>
      </div>

      <div class="meta-panel card">
        <div><span>Class</span><strong>{{ selectedClass?.name ?? 'No assignment' }}</strong></div>
        <div><span>Subject</span><strong>{{ selectedSubject?.name ?? 'No assignment' }}</strong></div>
        <label>
          <span>Term</span>
          <input type="text" list="teacher-term-options" [(ngModel)]="termInput" placeholder="Term 1" (change)="onPeriodChange()" />
          <datalist id="teacher-term-options"><option *ngFor="let option of termOptions" [value]="option"></option></datalist>
        </label>
        <label><span>Academic Year</span><input type="text" list="teacher-year-options" [(ngModel)]="academicYear" placeholder="2026/2027" (change)="onPeriodChange()" /></label>
        <datalist id="teacher-year-options"><option *ngFor="let year of academicYearOptions" [value]="year"></option></datalist>
      </div>

      <p class="message" *ngIf="loadingStudents">Loading students and saved marks...</p>

      <div class="summary card">
        <div><span>Students</span><strong>{{ students.length }}</strong></div>
        <div><span>Completed</span><strong>{{ completedCount }}</strong></div>
        <div><span>Missing</span><strong>{{ students.length - completedCount }}</strong></div>
      </div>

      <div class="table-wrap card">
        <table>
          <thead>
            <tr>
              <th>Student No.</th>
              <th>Admission No.</th>
              <th>Student Name</th>
              <th>Marks</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let row of students">
              <td>{{ row.id }}</td>
              <td>{{ row.admission }}</td>
              <td>{{ row.name }}</td>
              <td><input type="number" [(ngModel)]="row.marks" min="0" max="100" (ngModelChange)="updateRow(row)" /></td>
              <td><span class="status-pill" [class.draft]="row.status === 'Draft'" [class.resubmitted]="row.status === 'Resubmitted'" [class.rejected]="row.status === 'Rejected'">{{ row.status }}</span></td>
            </tr>
          </tbody>
        </table>
        <p class="empty-note" *ngIf="!loadingStudents && !students.length && !errorMessage">No students are available for this class.</p>
      </div>

      <div class="actions-row">
        <button type="button" class="primary-btn submit-marks-btn" [disabled]="saving || loadingStudents || !students.length || !selectedSubjectId" (click)="submitMarks()">{{ saving ? 'Saving marks...' : submitButtonLabel }}</button>
      </div>
    </section>
  `,
  styles: [
    `
      .page-shell { display: flex; flex-direction: column; gap: 1.2rem; }
      .page-header { margin-bottom: .3rem; }
      .page-header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
      .refresh-button { flex: 0 0 auto; border: 1px solid var(--teacher-border, #d6e6e3); border-radius: 8px; padding: .6rem .8rem; background: white; color: var(--teacher-green-deep, #1b6e5b); cursor: pointer; font-weight: 700; }
      .refresh-button:disabled { opacity: .6; cursor: wait; }
      .eyebrow { margin: 0; text-transform: uppercase; letter-spacing: .12em; font-size: .7rem; color: #64748b; }
      h2 { margin: .25rem 0 0; font-size: clamp(1.5rem, 2vw, 2rem); }
      .card { background: linear-gradient(155deg, rgba(255,255,255,.99) 0%, rgba(241,248,246,.98) 100%); border: 1px solid var(--teacher-border, #d6e6e3); border-radius: 12px; box-shadow: 0 12px 30px rgba(21,85,115,.055); }
      .assignment-grid { display: grid; grid-template-columns: repeat(2, minmax(220px, 1fr)); gap: 1rem; }
      .assignment-card { padding: 1rem 1.1rem; }
      .review-note { padding: 1rem 1.1rem; border-color: #f3d28b; background: #fffbeb; color: #713f12; }
      .review-note p { margin: .35rem 0 0; white-space: pre-wrap; }
      .assignment-card h3 { margin: 0 0 .75rem; font-size: 1.05rem; }
      .chip-list { display: flex; flex-wrap: wrap; gap: .6rem; }
      .chip { border: 1px solid var(--teacher-border, #d6e6e3); background: linear-gradient(110deg, #edf5fa, #edf7f1); color: #315f70; border-radius: 8px; padding: .55rem .8rem; cursor: pointer; font-weight: 600; }
      .chip.active { background: var(--teacher-action, linear-gradient(120deg, #21845f, #25856b)); color: white; border-color: var(--teacher-green, #25856b); }
      .meta-panel, .summary { display: grid; grid-template-columns: repeat(4, minmax(120px, 1fr)); gap: .8rem; padding: 1rem 1.1rem; }
      .meta-panel label { display: flex; flex-direction: column; gap: .35rem; }
      .meta-panel input { width: 100%; box-sizing: border-box; }
      .meta-panel span, .summary span { display: block; color: #64748b; }
      .meta-panel strong, .summary strong { display: block; margin-top: .2rem; font-size: 1.2rem; }
      .table-wrap { padding: .4rem; overflow-x: auto; }
      table { width: 100%; border-collapse: collapse; min-width: 760px; }
      th, td { text-align: left; padding: .85rem .7rem; border-bottom: 1px solid #e2e8f0; }
      th { color: #64748b; font-size: .75rem; letter-spacing: .06em; text-transform: uppercase; }
      tbody tr:hover { background: rgba(224, 242, 235, .62); }
      input { width: 80px; border: 1px solid var(--teacher-border, #d6e6e3); border-radius: 8px; padding: .55rem .6rem; background: white; }
      input:focus { outline: none; border-color: var(--teacher-green, #16856b); box-shadow: 0 0 0 3px rgba(22, 133, 107, .14); }
      .status-pill { display: inline-flex; padding: .35rem .7rem; background: #dcfce7; color: #166534; border-radius: 999px; font-size: .7rem; font-weight: 700; }
      .status-pill.draft { background: #fef3c7; color: #92400e; }
      .status-pill.resubmitted { background: #e4f1f2; color: #246d78; }
      .status-pill.rejected { background: #fee2e2; color: #991b1b; }
      .message, .empty-note { margin: 0; padding: .75rem 1rem; color: var(--teacher-muted, #60777c); background: linear-gradient(110deg, #edf5fa, #eef7f2); border: 1px solid var(--teacher-border, #d6e6e3); border-radius: 8px; }
      .error-message { color: #a12d2d; border-color: #efc8c4; background: #fff5f3; }
      .success-message { color: #176b58; border-color: #bfdfd0; background: #f0faf5; }
      .actions-row { display: flex; justify-content: flex-end; }
      .primary-btn:focus-visible, .refresh-button:focus-visible { outline: 3px solid rgba(22, 133, 107, .24); outline-offset: 2px; }
      .primary-btn:disabled { opacity: .6; cursor: wait; }
      @media (max-width: 760px) { .assignment-grid, .meta-panel, .summary { grid-template-columns: 1fr; } }
    `,
  ],
})
export class TeacherMarksComponent {
  assignments: AssignmentRecord[] = [];
  selectedClassId = '';
  selectedSubjectId = '';
  academicYear = '';
  term = '';
  termInput = '';
  readonly termOptions = ACADEMIC_TERM_OPTIONS;
  readonly academicYearOptions = ACADEMIC_YEAR_OPTIONS;
  teacherId = 0;
  hasPreviousSubmission = false;
  loadingAssignments = true;
  loadingStudents = false;
  saving = false;
  errorMessage = '';
  successMessage = '';
  students: Array<{ id: number; admission: string; name: string; marks: number | null; markId?: number; status: 'Draft' | 'Submitted' | 'Resubmitted' | 'Rejected' | 'Accepted' }> = [];
  currentSubmission: TeacherSubmissionRow | null = null;

  constructor(
    private readonly markService: MarkService,
    private readonly authService: AuthService,
    private readonly assignmentService: AssignmentService,
    private readonly studentService: StudentService,
    private readonly route: ActivatedRoute,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {
    this.refreshAssignments();
  }

  refreshAssignments(): void {
    const user = this.authService.currentUser;
    if (!user) {
      this.errorMessage = 'Sign in again to load your teacher assignments.';
      this.changeDetectorRef.markForCheck();
      return;
    }
    this.loadingAssignments = true;
    this.errorMessage = '';
    this.assignmentService.getMyAssignments().subscribe({
      next: (assignments) => {
        this.assignments = assignments;
        this.teacherId = Number(user.teacherId ?? assignments[0]?.teacher.id ?? 0);
        const requestedClassId = this.route.snapshot.queryParamMap.get('classId');
        this.selectedClassId = this.assignedClasses.some((item) => item.id.toString() === requestedClassId)
          ? requestedClassId!
          : this.assignedClasses[0]?.id.toString() ?? '';
        this.academicYear = this.route.snapshot.queryParamMap.get('academicYear')
          ?? this.selectedClass?.academicYear
          ?? '';
        const requestedSubjectId = this.route.snapshot.queryParamMap.get('subjectId');
        this.selectedSubjectId = this.assignedSubjects.some((item) => item.id.toString() === requestedSubjectId)
          ? requestedSubjectId!
          : this.assignedSubjects[0]?.id.toString() ?? '';
        this.term = normalizeAcademicTerm(this.route.snapshot.queryParamMap.get('term') ?? '');
        this.termInput = formatAcademicTerm(this.term);
        this.loadingAssignments = false;
        if (this.selectedClassId && this.selectedSubjectId) this.loadStudentsAndMarks();
        else this.students = [];
        this.changeDetectorRef.markForCheck();
      },
      error: (error: { status?: number }) => {
        this.loadingAssignments = false;
        this.errorMessage = error.status
          ? `Could not load your assignments (HTTP ${error.status}). Sign out and sign in again.`
          : 'Could not connect to the assignments service.';
        this.changeDetectorRef.markForCheck();
      },
    });
  }

  get assignedClasses(): AssignmentRecord['classEntity'][] {
    return [...new Map(this.assignments.map((item) => [item.classEntity.id, item.classEntity])).values()];
  }

  get assignedSubjects(): AssignmentRecord['subject'][] {
    return [...new Map(this.assignments
      .filter((item) => item.classEntity.id.toString() === this.selectedClassId)
      .map((item) => [item.subject.id, item.subject])).values()];
  }

  get selectedClass() { return this.assignedClasses.find((item) => item.id.toString() === this.selectedClassId); }
  get selectedSubject() { return this.assignedSubjects.find((item) => item.id.toString() === this.selectedSubjectId); }

  selectClass(id: string): void {
    this.selectedClassId = id;
    this.academicYear = this.selectedClass?.academicYear ?? '';
    this.selectedSubjectId = this.assignedSubjects[0]?.id.toString() ?? '';
    this.loadStudentsAndMarks();
  }
  selectSubject(id: string): void { this.selectedSubjectId = id; this.loadStudentsAndMarks(); }

  onPeriodChange(): void {
    this.term = normalizeAcademicTerm(this.termInput);
    this.loadStudentsAndMarks();
  }

  get completedCount(): number {
    return this.students.filter((row) => row.marks !== null).length;
  }

  private loadStudentsAndMarks(): void {
    this.errorMessage = '';
    this.successMessage = '';
    if (!this.selectedClassId || !this.selectedSubjectId) {
      this.students = [];
      return;
    }
    this.loadingStudents = true;
    forkJoin({
      students: this.studentService.getStudentsByClass(this.selectedClassId),
      marks: this.markService.getMarksByClass(this.selectedClassId),
      submissions: this.markService.getMySubmissions(),
    }).subscribe({
      next: ({ students, marks, submissions }) => {
        const relevant = marks.filter((mark) => mark.subject.id === Number(this.selectedSubjectId) && mark.teacher.id === this.teacherId && mark.academicYear === String(this.academicYear) && mark.term === this.term);
        this.currentSubmission = submissions.find((submission) => submission.classId === this.selectedClassId
          && submission.subjectId === this.selectedSubjectId
          && submission.term === this.term
          && submission.year === String(this.academicYear)) ?? null;
        this.students = students.map((student) => {
          const mark = relevant.find((item) => item.student.id === Number(student.id));
          const value = mark ? Number(mark.marks) : null;
          return {
            id: Number(student.id),
            admission: student.admissionNumber,
            name: `${student.firstName} ${student.lastName}`,
            marks: value,
            markId: mark?.id,
            status: mark?.status === 'REJECTED'
              ? 'Rejected' as const
              : mark?.status === 'APPROVED'
                ? 'Accepted' as const
                : mark
                  ? 'Submitted' as const
                  : 'Draft' as const,
          };
        });
        this.hasPreviousSubmission = submissions.some((submission) => submission.classId === this.selectedClassId && submission.subjectId === this.selectedSubjectId && submission.term === this.term && submission.year === String(this.academicYear));
        this.loadingStudents = false;
        this.changeDetectorRef.markForCheck();
      },
      error: (error: { status?: number }) => {
        this.students = [];
        this.loadingStudents = false;
        this.errorMessage = error.status
          ? `Could not load students or saved marks (HTTP ${error.status}). Verify your class and subject assignments.`
          : 'Could not connect to the marks service.';
        this.changeDetectorRef.markForCheck();
      },
    });
  }

  get submitButtonLabel(): string {
    return this.hasPreviousSubmission ? 'Resubmit Marks' : 'Submit Marks';
  }

  updateRow(row: typeof this.students[number]): void {
    if (row.status === 'Submitted' || row.status === 'Resubmitted' || row.status === 'Rejected' || row.status === 'Accepted') {
      row.status = 'Resubmitted';
    } else {
      row.status = 'Draft';
    }
  }

  submitMarks(): void {
    if (!this.teacherId || !this.selectedClassId || !this.selectedSubjectId || !this.academicYear.trim() || !this.term.trim()) {
      this.errorMessage = 'Choose an assigned class and subject, and enter the academic year and term.';
      return;
    }
    const invalidRow = this.students.find((row) => row.marks === null || Number(row.marks) < 0 || Number(row.marks) > 100);
    if (invalidRow) {
      this.errorMessage = 'Enter a mark from 0 to 100 for every student before submitting.';
      return;
    }
    const marks = this.students.map((row) => ({ id: row.markId, studentId: row.id, marks: Number(row.marks) }));
    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.markService.submitMarksAndSubmission({
      teacherId: this.teacherId,
      classId: Number(this.selectedClassId),
      subjectId: Number(this.selectedSubjectId),
      academicYear: String(this.academicYear),
      term: this.term,
    }, marks).subscribe({
      next: () => {
        this.saving = false;
        this.successMessage = 'Marks were saved and submitted for review.';
        this.loadStudentsAndMarks();
        this.changeDetectorRef.markForCheck();
      },
      error: (error: { status?: number }) => {
        this.saving = false;
        this.errorMessage = error.status
          ? `Marks could not be saved (HTTP ${error.status}). Check the assignment and try again.`
          : 'Could not connect to save marks. Your entered values are still on this page.';
        this.changeDetectorRef.markForCheck();
      },
    });
  }
}
