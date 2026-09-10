import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { MarkService } from '../../../services/mark.service';

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
      </div>

      <div class="assignment-grid">
        <div class="assignment-card card">
          <h3>Assigned Classes</h3>
          <div class="chip-list">
            <button
              *ngFor="let myClass of assignedClasses"
              type="button"
              class="chip"
              [class.active]="myClass === selectedClass"
              (click)="selectedClass = myClass"
            >
              {{ myClass }}
            </button>
          </div>
        </div>

        <div class="assignment-card card">
          <h3>Assigned Subjects</h3>
          <div class="chip-list">
            <button
              *ngFor="let subject of assignedSubjects"
              type="button"
              class="chip"
              [class.active]="subject === selectedSubject"
              (click)="selectedSubject = subject"
            >
              {{ subject }}
            </button>
          </div>
        </div>
      </div>

      <div class="meta-panel card">
        <div><span>Class</span><strong>{{ selectedClass }}</strong></div>
        <div><span>Subject</span><strong>{{ selectedSubject }}</strong></div>
        <div><span>Term</span><strong>Term 1</strong></div>
        <div><span>Academic Year</span><strong>2026</strong></div>
      </div>

      <div class="summary card">
        <div><span>Students</span><strong>{{ students.length }}</strong></div>
        <div><span>Completed</span><strong>{{ completedCount }}</strong></div>
        <div><span>Missing</span><strong>{{ students.length - completedCount }}</strong></div>
        <div><span>Average</span><strong>{{ averageMarks }}</strong></div>
      </div>

      <div class="table-wrap card">
        <table>
          <thead>
            <tr>
              <th>Student No.</th>
              <th>Admission No.</th>
              <th>Student Name</th>
              <th>Marks</th>
              <th>Grade</th>
              <th>Remarks</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let row of students">
              <td>{{ row.no }}</td>
              <td>{{ row.admission }}</td>
              <td>{{ row.name }}</td>
              <td><input type="number" [(ngModel)]="row.marks" min="0" max="100" (ngModelChange)="updateRow(row)" /></td>
              <td>{{ row.status === 'Draft' ? row.grade : 'Hidden' }}</td>
              <td>{{ row.remarks }}</td>
              <td><span class="status-pill" [class.draft]="row.status === 'Draft'" [class.resubmitted]="row.status === 'Resubmitted'">{{ row.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="actions-row">
        <button type="button" class="primary-btn" (click)="submitMarks()">{{ submitButtonLabel }}</button>
      </div>
    </section>
  `,
  styles: [
    `
      .page-shell { display: flex; flex-direction: column; gap: 1.2rem; }
      .page-header { margin-bottom: .4rem; }
      .eyebrow { margin: 0; text-transform: uppercase; letter-spacing: .12em; font-size: .7rem; color: #64748b; }
      h2 { margin: .25rem 0 0; }
      .card { background: white; border: 1px solid rgba(148,163,184,.15); border-radius: 18px; box-shadow: 0 8px 22px rgba(15,23,42,.04); }
      .assignment-grid { display: grid; grid-template-columns: repeat(2, minmax(220px, 1fr)); gap: 1rem; }
      .assignment-card { padding: 1rem; }
      .assignment-card h3 { margin: 0 0 .75rem; font-size: 1rem; }
      .chip-list { display: flex; flex-wrap: wrap; gap: .5rem; }
      .chip { border: 1px solid #dbeafe; background: #eff6ff; color: #1d4ed8; border-radius: 999px; padding: .5rem .75rem; cursor: pointer; }
      .chip.active { background: #1d4ed8; color: white; border-color: #1d4ed8; }
      .meta-panel, .summary { display: grid; grid-template-columns: repeat(4, minmax(120px, 1fr)); gap: .8rem; padding: 1rem; }
      .meta-panel span, .summary span { display: block; color: #64748b; }
      .meta-panel strong, .summary strong { display: block; margin-top: .2rem; font-size: 1.2rem; }
      table { width: 100%; border-collapse: collapse; min-width: 760px; }
      th, td { text-align: left; padding: .85rem .7rem; border-bottom: 1px solid #e2e8f0; }
      th { color: #64748b; font-size: .75rem; letter-spacing: .06em; text-transform: uppercase; }
      input { width: 80px; border: 1px solid #d7e1ef; border-radius: 10px; padding: .55rem .6rem; }
      .status-pill { display: inline-flex; padding: .35rem .7rem; background: #dcfce7; color: #166534; border-radius: 999px; font-size: .7rem; font-weight: 700; }
      .status-pill.draft { background: #fef3c7; color: #92400e; }
      .status-pill.resubmitted { background: #dbeafe; color: #1d4ed8; }
      .actions-row { display: flex; justify-content: flex-end; }
      .primary-btn { border: none; background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%); color: white; padding: .8rem 1.2rem; border-radius: 12px; cursor: pointer; font-weight: 700; }
      @media (max-width: 760px) { .assignment-grid, .meta-panel, .summary { grid-template-columns: 1fr; } }
    `,
  ],
})
export class TeacherMarksComponent {
  assignedClasses: string[] = [];
  assignedSubjects: string[] = [];
  selectedClass = '';
  selectedSubject = '';

  students = [
    { no: '01', admission: 'JG001', name: 'Amina Ali', marks: 78, grade: 'A', remarks: 'Good', status: 'Draft' as 'Draft' | 'Submitted' | 'Resubmitted' },
    { no: '02', admission: 'JG002', name: 'Juma Omar', marks: 65, grade: 'B', remarks: 'Good', status: 'Draft' as 'Draft' | 'Submitted' | 'Resubmitted' },
    { no: '03', admission: 'JG003', name: 'Fatma Said', marks: 42, grade: 'D', remarks: 'Fair', status: 'Draft' as 'Draft' | 'Submitted' | 'Resubmitted' },
  ];

  constructor(
    private readonly markService: MarkService,
    private readonly authService: AuthService,
    private readonly http: HttpClient,
  ) {
    const user = this.authService.currentUser;
    this.assignedClasses = user?.assignedClasses ?? ['Form 2A', 'Form 2B'];
    this.assignedSubjects = user?.assignedSubjects ?? ['Mathematics', 'Physics'];
    this.selectedClass = this.assignedClasses[0] ?? 'Form 2A';
    this.selectedSubject = this.assignedSubjects[0] ?? 'Mathematics';
    this.loadTeacherSubmissionStatus();
  }

  get completedCount(): number {
    return this.students.filter((row) => Number(row.marks) >= 0 && Number(row.marks) <= 100).length;
  }

  get averageMarks(): string {
    const total = this.students.reduce((sum, row) => sum + Number(row.marks || 0), 0);
    return (total / (this.students.length || 1)).toFixed(1);
  }

  private getClassId(className: string): string {
    const classMap: Record<string, string> = {
      'Form 1A': 'class-1a',
      'Form 2A': 'class-2a',
      'Form 2B': 'class-2b',
      'Form 3A': 'class-3a',
    };

    return classMap[className] ?? className;
  }

  private getSubjectId(subject: string): string {
    const subjectMap: Record<string, string> = {
      Mathematics: 'math',
      Physics: 'physics',
      English: 'english',
      Biology: 'biology',
    };

    return subjectMap[subject] ?? subject.toLowerCase().replace(/\s+/g, '-');
  }

  private loadTeacherSubmissionStatus(): void {
    const teacherId = this.authService.currentUser?.id ?? 'teacher-1';
    this.markService.getTeacherSubmissions(teacherId).subscribe((items) => {
      const matching = items.some(
        (submission) =>
          this.getClassId(this.selectedClass) === submission.classId &&
          this.getSubjectId(this.selectedSubject) === submission.subjectId &&
          (submission.status === 'Submitted' || submission.status === 'Resubmitted'),
      );
      if (matching) {
        this.students.forEach((row) => {
          row.status = 'Resubmitted';
        });
      }
    });
  }

  get hasPreviousSubmission(): boolean {
    const teacherId = this.authService.currentUser?.id ?? 'teacher-1';
    return this.markService
      .getSubmissionByTeacher(teacherId)
      .some(
        (submission) =>
          this.getClassId(this.selectedClass) === submission.classId &&
          this.getSubjectId(this.selectedSubject) === submission.subjectId &&
          (submission.status === 'Submitted' || submission.status === 'Resubmitted'),
      );
  }

  get submitButtonLabel(): string {
    return this.hasPreviousSubmission ? 'Resubmit Marks' : 'Submit Marks';
  }

  updateRow(row: typeof this.students[number]): void {
    const value = Number(row.marks || 0);
    if (row.status === 'Submitted' || row.status === 'Resubmitted') {
      row.status = 'Resubmitted';
    } else {
      row.status = 'Draft';
    }

    if (value >= 80) { row.grade = 'A'; row.remarks = 'Excellent'; }
    else if (value >= 70) { row.grade = 'B'; row.remarks = 'Good'; }
    else if (value >= 60) { row.grade = 'C'; row.remarks = 'Satisfactory'; }
    else if (value >= 50) { row.grade = 'D'; row.remarks = 'Fair'; }
    else if (value >= 40) { row.grade = 'E'; row.remarks = 'Needs support'; }
    else { row.grade = 'F'; row.remarks = 'Poor'; }
  }

  submitMarks(): void {
    const hasPreviousSubmission = this.hasPreviousSubmission;
    const nextStatus = hasPreviousSubmission ? 'Resubmitted' : 'Submitted';

    this.students.forEach((row) => {
      row.status = nextStatus;
    });

    const teacher = this.authService.currentUser;
    const teacherId = teacher?.id ?? 'teacher-1';
    const teacherName = teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Asha Ali';
    const payload = {
      teacherId,
      className: this.selectedClass,
      subject: this.selectedSubject,
      status: nextStatus,
    };

    this.http.post('http://localhost:3001/api/submissions', payload).subscribe();
    this.markService.setSubmissionStatus(teacherName, this.selectedClass, this.selectedSubject, nextStatus === 'Submitted' ? 'Submitted' : 'Resubmitted');
  }
}
