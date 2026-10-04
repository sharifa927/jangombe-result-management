import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../../components/page-header/page-header';
import { AssignmentService } from '../../../services/assignment.service';
import { StudentService } from '../../../services/student.service';

@Component({
  selector: 'app-teacher-classes',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <section class="page-shell">
      <app-page-header eyebrow="Academic overview" title="My classes" [actionLabel]="loadingAssignments ? 'Refreshing...' : 'Refresh'" [actionDisabled]="loadingAssignments" (action)="refreshAssignments()"></app-page-header>
      <p class="class-count" *ngIf="!loadingAssignments">{{ classes.length }} assigned {{ classes.length === 1 ? 'class' : 'classes' }}</p>

      <div class="overview-band">
        <div class="student-total">
          <span class="label">STUDENTS ACROSS YOUR CLASSES</span>
          <div class="metric-line">
            <strong>{{ totalStudents }}</strong>
            <span>students</span>
          </div>
        </div>
      </div>

      <p class="loading-state" *ngIf="loadingAssignments">Loading your assigned classes...</p>

      <div class="class-grid">
        <article class="class-card" *ngFor="let item of classes">
          <div class="card-head">
            <div class="class-identity">
              <span class="class-tag">{{ item.role }}</span>
              <h3>{{ item.name }}</h3>
            </div>
            <span class="class-mark" aria-hidden="true">{{ item.name.slice(0, 1) }}</span>
          </div>

          <div class="meta-row">
            <span><strong>{{ item.students }}</strong> students enrolled</span>
            <span class="active-status"><span></span>Active</span>
          </div>

          <div class="subject-list">
            <span class="subject-label">SUBJECTS</span>
            <span class="subject-chip" *ngFor="let subject of item.subjects">{{ subject }}</span>
          </div>
          <button class="open-button" type="button" (click)="openClass(item.id)">
            View class <span aria-hidden="true">↗</span>
          </button>
        </article>
      </div>
      <p class="error-message" role="alert" *ngIf="errorMessage">{{ errorMessage }}</p>
      <p class="empty-state" *ngIf="!loadingAssignments && !classes.length && !errorMessage">You do not have any class or subject assignments yet.</p>
    </section>
  `,
  styles: [
    `
      :host { --class-ink: var(--teacher-ink, #183744); --class-muted: var(--teacher-muted, #60777c); --class-teal: var(--teacher-green, #16856b); --class-lime: var(--teacher-blue, #1d5f91); display: block; }
      .page-shell { display: flex; flex-direction: column; gap: 1.25rem; }
      .class-count { margin: .35rem 0 0; color: var(--class-muted); font-size: .9rem; }
      .overview-band { display: flex; align-items: stretch; justify-content: space-between; min-height: 128px; overflow: hidden; border: 1px solid var(--teacher-border, #d6e6e3); border-radius: 12px; background: linear-gradient(110deg, #e6f1f8 0%, #edf7f2 62%, #e1f2ec 100%); color: var(--class-ink); }
      .student-total { display: flex; flex-direction: column; justify-content: center; padding: 1.35rem 1.6rem; }
      .label { color: #4c6383; font-size: .68rem; font-weight: 700; }
      .metric-line { display: flex; align-items: baseline; gap: .65rem; margin-top: .25rem; }
      .metric-line strong { color: var(--teacher-blue, #1d5f91); font-size: 2.2rem; line-height: 1; }
      .metric-line span { color: #526d8a; font-size: .9rem; }
      .class-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
      .class-card { display: flex; flex-direction: column; min-height: 260px; padding: 1.2rem; border: 1px solid var(--teacher-border, #d6e6e3); border-top: 3px solid var(--class-teal); border-radius: 10px; background: linear-gradient(155deg, #fff 0%, #f4faf7 100%); box-shadow: 0 8px 22px rgba(21, 85, 115, .07); transition: transform .18s ease, box-shadow .18s ease; }
      .class-card:hover { transform: translateY(-2px); box-shadow: 0 14px 28px rgba(30, 64, 112, .12); }
      .card-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }
      .class-identity { display: flex; flex-direction: column; align-items: flex-start; gap: .55rem; }
      .class-tag { display: inline-flex; width: fit-content; padding: .32rem .55rem; border-radius: 5px; background: var(--teacher-mint, #e9f6f0); color: var(--teacher-green-deep, #0f6d58); font-size: .68rem; font-weight: 800; }
      .class-card h3 { margin: 0; color: var(--class-ink); font-size: 1.35rem; }
      .class-mark { display: grid; width: 42px; height: 42px; flex: 0 0 auto; place-items: center; border-radius: 50%; background: linear-gradient(135deg, #e3f0f8, #daf1e8); color: var(--teacher-blue, #1d5f91); font-size: 1rem; font-weight: 800; }
      .meta-row { display: flex; align-items: center; justify-content: space-between; gap: .8rem; margin: 1rem 0; padding: .8rem 0; border-top: 1px solid #edf1ef; border-bottom: 1px solid #edf1ef; color: var(--class-muted); font-size: .82rem; }
      .meta-row strong { margin-right: .25rem; color: var(--class-ink); font-size: 1.12rem; }
      .active-status { display: inline-flex; align-items: center; gap: .4rem; color: #39715c; font-size: .75rem; font-weight: 700; }
      .active-status span { width: 7px; height: 7px; border-radius: 50%; background: #49a879; }
      .subject-list { display: flex; align-content: flex-start; flex-wrap: wrap; gap: .4rem; margin-bottom: 1rem; }
      .subject-label { flex-basis: 100%; margin-bottom: .15rem; color: var(--class-muted); font-size: .64rem; font-weight: 800; }
      .subject-chip { padding: .32rem .55rem; border-radius: 5px; background: linear-gradient(110deg, #eaf3fa, #e8f5ef); color: #315f70; font-size: .78rem; }
      .open-button { display: flex; align-items: center; justify-content: space-between; width: 100%; margin-top: auto; border: 1px solid var(--teacher-green, #25856b); border-radius: 7px; padding: .72rem .85rem; background: var(--teacher-action, linear-gradient(120deg, #21845f, #25856b)); color: #fff; cursor: pointer; font-weight: 700; text-align: left; transition: filter .16s ease, border-color .16s ease; }
      .open-button:hover { filter: brightness(.93); }
      .open-button:focus-visible { outline: 3px solid rgba(22, 133, 107, .24); outline-offset: 2px; }
      .open-button span { color: #d9f4e8; font-size: 1.05rem; }
      .error-message { color: #b91c1c; background: #fef2f2; border: 1px solid #fecaca; padding: .8rem 1rem; }
      .loading-state { margin: 0; padding: .85rem 1rem; border: 1px solid #dbe4ee; border-radius: 8px; background: #f8fafc; color: #52657d; }
      .empty-state { padding: 1.4rem 1rem; border: 1px dashed #c6d4e8; border-radius: 10px; color: var(--class-muted); text-align: center; }
      @media (max-width: 760px) { .class-grid { grid-template-columns: 1fr; } .overview-band { min-height: 112px; } }
      @media (max-width: 480px) { .class-card { padding: 1rem; } }
    `,
  ],
})
export class TeacherClassesComponent implements OnInit {
  errorMessage = '';
  loadingAssignments = true;

  constructor(
    private readonly router: Router,
    private readonly assignmentService: AssignmentService,
    private readonly studentService: StudentService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {}

  classes: Array<{ id: number; name: string; students: number; role: string; subjects: string[] }> = [];

  ngOnInit(): void {
    this.refreshAssignments();
  }

  refreshAssignments(): void {
    this.loadingAssignments = true;
    this.errorMessage = '';
    this.assignmentService.getMyAssignments().subscribe({
      next: (assignments) => {
        const classes = new Map<number, { id: number; name: string; students: number; role: string; subjects: string[] }>();
        assignments.forEach((assignment) => {
          const classRecord = classes.get(assignment.classEntity.id) ?? {
            id: assignment.classEntity.id,
            name: assignment.classEntity.name,
            students: 0,
            role: assignment.classTeacher ? 'Class Teacher' : 'Subject Teacher',
            subjects: [],
          };
          if (assignment.classTeacher) classRecord.role = 'Class Teacher';
          if (!classRecord.subjects.includes(assignment.subject.name)) classRecord.subjects.push(assignment.subject.name);
          classes.set(classRecord.id, classRecord);
        });
        this.classes = [...classes.values()];
        this.loadingAssignments = false;
        this.changeDetectorRef.markForCheck();
        this.classes.forEach((classRecord) => {
          this.studentService.getStudentsByClass(classRecord.id.toString()).subscribe({
            next: (students) => {
              classRecord.students = students.length;
              this.changeDetectorRef.markForCheck();
            },
          });
        });
      },
      error: (error: { status?: number }) => {
        this.classes = [];
        this.loadingAssignments = false;
        this.errorMessage = error.status
          ? `Could not load your assignments (HTTP ${error.status}). Sign out and sign in again.`
          : 'Could not connect to the assignments service.';
        this.changeDetectorRef.markForCheck();
      },
    });
  }

  get totalStudents(): number {
    return this.classes.reduce((sum, item) => sum + item.students, 0);
  }

  openClass(classId: number): void {
    this.router.navigateByUrl(`/teacher/students?classId=${classId}`);
  }
}
