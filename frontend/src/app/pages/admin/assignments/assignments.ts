import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize, timeout } from 'rxjs';
import { PageHeaderComponent } from '../../../components/page-header/page-header';
import { AssignmentService, type AssignmentRecord } from '../../../services/assignment.service';
import { ClassService, type ClassRecord } from '../../../services/class.service';
import { SubjectService, type SubjectRecord } from '../../../services/subject.service';
import { TeacherService } from '../../../services/teacher.service';

@Component({
  selector: 'app-assignment-management',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent],
  template: `
    <section class="page-shell">
      <app-page-header eyebrow="Teacher Allocation" title="Teacher Assignment" actionLabel="Add Assignment" (action)="toggleAddForm()"></app-page-header>

      <p class="success-message" role="status" *ngIf="successMessage">{{ successMessage }}</p>
      <p class="error-message" role="alert" *ngIf="errorMessage">{{ errorMessage }}</p>

      <div class="assignment-grid">
        <div class="card form-panel" *ngIf="showForm">
          <h3>Assign Teacher</h3>
          <div class="field-grid">
            <label>
              <span>Teacher</span>
              <select [(ngModel)]="form.teacherId">
                <option value="">Select teacher</option>
                <option *ngFor="let teacher of teachers" [value]="teacher.id">ID {{ teacher.id }} · {{ teacher.firstName }} {{ teacher.lastName }} · {{ teacher.email }}</option>
              </select>
            </label>
            <label>
              <span>Class</span>
              <select [(ngModel)]="form.classId">
                <option value="">Select class</option>
                <option *ngFor="let classRecord of classes" [value]="classRecord.id">{{ classRecord.name }}</option>
              </select>
            </label>
            <label>
              <span>Subject</span>
              <select [(ngModel)]="form.subjectId">
                <option value="">Select subject</option>
                <option *ngFor="let subject of subjects" [value]="subject.id">{{ subject.name }}</option>
              </select>
            </label>
            <label class="checkbox-field"><span>Assign class-teacher role</span><input type="checkbox" [(ngModel)]="form.classTeacher" /></label>
          </div>
          <div class="form-actions">
            <button type="button" class="primary-btn" [disabled]="saving" (click)="saveAssignment()">{{ saving ? 'Saving...' : 'Save Assignment' }}</button>
            <button type="button" class="secondary-btn" (click)="cancelForm()">Cancel</button>
          </div>
        </div>

        <div class="card list-panel" *ngIf="!showForm">
          <div class="list-header">
            <h3>Current Assignments</h3>
            <button
              *ngIf="assignments.length > 3"
              type="button"
              class="view-all-btn"
              [attr.aria-expanded]="showAllAssignments"
              (click)="showAllAssignments = !showAllAssignments">
              {{ showAllAssignments ? 'Show less' : 'View all assignments' }}
            </button>
          </div>
          <div class="assignment-list" *ngFor="let item of visibleAssignments">
            <div class="assignment-item">
              <strong>{{ item.teacher.firstName }} {{ item.teacher.lastName }}</strong>
              <small>Teacher ID {{ item.teacher.id }}</small>
              <small>{{ item.teacher.email }}</small>
              <span>{{ item.classEntity.name }}</span>
              <small>{{ item.subject.name }}</small>
              <div class="item-actions">
                <button type="button" class="danger-btn" (click)="deleteAssignment(item)">Remove</button>
              </div>
            </div>
          </div>
          <p *ngIf="!loadingAssignments && assignments.length === 0">No assignments found.</p>
          <p class="loading-message" *ngIf="loadingAssignments">Loading assignments...</p>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .page-shell { display: flex; flex-direction: column; gap: 1.2rem; }
      .assignment-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 1.2rem; }
      .card { background: linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%); border-radius: 22px; border: 1px solid rgba(148,163,184,.15); box-shadow: 0 12px 30px rgba(15,23,42,.04); padding: 1.2rem; }
      h3 { margin-top: 0; }
      .field-grid { display: grid; gap: 1rem; }
      label { display: flex; flex-direction: column; gap: .45rem; font-weight: 600; color: #334155; }
      select { border: 1px solid #d7e1ef; border-radius: 12px; padding: .8rem 1rem; background: white; }
      .form-actions { display: flex; gap: .75rem; margin-top: 1rem; }
      .primary-btn, .secondary-btn, .item-actions button { border: none; border-radius: 10px; padding: .55rem .8rem; cursor: pointer; }
      .primary-btn { background: var(--teacher-action, linear-gradient(120deg, #21845f, #25856b)); color: white; }
      .secondary-btn { background: #e2e8f0; color: #334155; }
      .assignment-list { display: flex; flex-direction: column; gap: .8rem; }
      .list-header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
      .list-header h3 { margin-bottom: 1rem; }
      .view-all-btn { border: 0; padding: .45rem .6rem; background: transparent; color: var(--teacher-green-deep, #1b6e5b); font: inherit; font-weight: 700; cursor: pointer; }
      .view-all-btn:hover { color: #145844; text-decoration: underline; }
      .assignment-item { border: 1px solid #e2e8f0; border-radius: 14px; padding: .9rem; display: flex; flex-direction: column; gap: .2rem; background: rgba(248,250,252,0.7); }
      .item-actions { display: flex; gap: .5rem; margin-top: .5rem; }
      .item-actions button:not(.danger-btn) { background: #e6f4ec; color: var(--teacher-green-deep, #1b6e5b); }
      .item-actions .danger-btn { border: 1px solid #fecaca; border-radius: 10px; padding: .55rem .8rem; background: #fff1f0; color: #b91c1c; font-weight: 700; transition: background .16s ease, border-color .16s ease; }
      .item-actions .danger-btn:hover { border-color: #fca5a5; background: #fee2e2; }
      .item-actions .danger-btn:focus-visible { outline-color: rgba(185, 28, 28, .3); }
      .primary-btn:focus-visible, .secondary-btn:focus-visible, .item-actions button:focus-visible, .view-all-btn:focus-visible { outline: 3px solid rgba(37, 133, 107, .25); outline-offset: 2px; }
      .success-message, .error-message, .loading-message { margin: 0; padding: .75rem 1rem; border-radius: 8px; }
      .success-message { color: #166534; background: #f0fdf4; border: 1px solid #bbf7d0; }
      .error-message { color: #b91c1c; background: #fef2f2; border: 1px solid #fecaca; }
      .primary-btn:disabled { opacity: .65; cursor: wait; }
      @media (max-width: 860px) { .assignment-grid { grid-template-columns: 1fr; } }
    `,
  ],
})
export class AssignmentManagementComponent implements OnInit {
  showForm = false;
  saving = false;
  loadingAssignments = false;
  showAllAssignments = false;
  errorMessage = '';
  successMessage = '';
  form = { teacherId: '', classId: '', subjectId: '', classTeacher: false };
  assignments: AssignmentRecord[] = [];
  teachers: Array<{ id?: string | number; firstName: string; lastName: string; email: string }> = [];
  classes: ClassRecord[] = [];
  subjects: SubjectRecord[] = [];

  get visibleAssignments(): AssignmentRecord[] {
    return this.showAllAssignments ? this.assignments : this.assignments.slice(0, 3);
  }

  constructor(
    private readonly assignmentService: AssignmentService,
    private readonly teacherService: TeacherService,
    private readonly classService: ClassService,
    private readonly subjectService: SubjectService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.teacherService.getTeachers().subscribe({
      next: (items) => {
        this.teachers = items;
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Unable to load teachers from the server.';
        this.changeDetectorRef.markForCheck();
      },
    });
    this.classService.getClasses().subscribe({
      next: (items) => {
        this.classes = items;
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Unable to load classes from the server.';
        this.changeDetectorRef.markForCheck();
      },
    });
    this.subjectService.getSubjects().subscribe({
      next: (items) => {
        this.subjects = items;
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Unable to load subjects from the server.';
        this.changeDetectorRef.markForCheck();
      },
    });
    this.loadAssignments();
  }

  private loadAssignments(): void {
    this.loadingAssignments = true;
    this.assignmentService.getAssignments().subscribe({
      next: (items) => {
        this.assignments = items;
        this.loadingAssignments = false;
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.loadingAssignments = false;
        this.errorMessage = 'Unable to load assignments from the server.';
        this.changeDetectorRef.markForCheck();
      },
    });
  }

  openAddForm(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.form = { teacherId: '', classId: '', subjectId: '', classTeacher: false };
    this.showForm = true;
  }

  toggleAddForm(): void {
    if (this.showForm) {
      this.cancelForm();
      return;
    }
    this.openAddForm();
  }

  cancelForm(): void {
    this.form = { teacherId: '', classId: '', subjectId: '', classTeacher: false };
    this.showForm = false;
  }

  saveAssignment(): void {
    if (!this.form.teacherId || !this.form.classId || !this.form.subjectId) {
      this.errorMessage = 'Select a teacher, class, and subject before saving.';
      return;
    }

    const selectedTeacher = this.teachers.find((teacher) => Number(teacher.id) === Number(this.form.teacherId));
    if (!selectedTeacher) {
      this.errorMessage = 'The selected teacher is no longer available. Reload the page and choose them again.';
      return;
    }
    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.assignmentService.addAssignment({
      teacher: { id: Number(this.form.teacherId) },
      classEntity: { id: Number(this.form.classId) },
      subject: { id: Number(this.form.subjectId) },
      classTeacher: this.form.classTeacher,
    }).pipe(
      timeout({ first: 15000 }),
      finalize(() => this.saving = false),
    ).subscribe({
      next: (created) => {
        if (Number(created.teacherId) !== Number(selectedTeacher.id)) {
          this.errorMessage = `The server saved teacher ID ${created.teacherId}, but you selected ID ${selectedTeacher.id}.`;
          return;
        }
        const className = this.classes.find((item) => item.id === created.classId)?.name ?? `class ${created.classId}`;
        const subjectName = this.subjects.find((item) => item.id === created.subjectId)?.name ?? `subject ${created.subjectId}`;
        this.successMessage = `Saved for teacher ID ${created.teacherId} (${selectedTeacher.email}): ${className}, ${subjectName}${created.classTeacher ? ', class teacher' : ''}.`;
        this.loadAssignments();
        this.cancelForm();
        this.showForm = false;
        this.changeDetectorRef.markForCheck();
      },
      error: (error: { error?: unknown; status?: number }) => {
        const responseMessage = typeof error.error === 'string' ? error.error : '';
        const detail = error.status === 0
          ? 'Cannot reach the backend. Check that the Spring Boot server is running.'
          : error.status
            ? `Server returned HTTP ${error.status}.`
            : 'The server did not respond within 15 seconds.';
        this.errorMessage = responseMessage || `Assignment was not saved. ${detail}`;
        this.changeDetectorRef.markForCheck();
      },
    });
  }

  deleteAssignment(assignment: AssignmentRecord): void {
    this.errorMessage = '';
    this.assignmentService.deleteAssignment(assignment.id).subscribe({
      next: () => this.loadAssignments(),
      error: (error: { status?: number }) => {
        this.errorMessage = `Assignment could not be removed${error.status ? ` (HTTP ${error.status})` : ''}.`;
        this.changeDetectorRef.markForCheck();
      },
    });
  }
}
