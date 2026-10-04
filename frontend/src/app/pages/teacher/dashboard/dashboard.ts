import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardCardComponent } from '../../../components/dashboard-card/dashboard-card';
import { AuthService } from '../../../services/auth.service';
import { AssignmentService, type AssignmentRecord } from '../../../services/assignment.service';
import { StudentService } from '../../../services/student.service';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, DashboardCardComponent],
  template: `
    <section class="dashboard-shell">
      <div class="stats-grid">
        <app-dashboard-card label="Assigned Classes" [value]="classes.length.toString()" icon="🏫" trend="Current assignments" tone="info"></app-dashboard-card>
        <app-dashboard-card label="Assigned Subjects" [value]="subjects.length.toString()" icon="📚" trend="Current assignments" tone="success"></app-dashboard-card>
        <app-dashboard-card label="Students in My Classes" [value]="totalStudents.toString()" icon="👨‍🎓" trend="Assigned classes" tone="warning"></app-dashboard-card>
      </div>

      <div class="content-grid">
        <div class="panel">
          <div class="panel-header">
            <h3>My Classes</h3>
            <button type="button" class="refresh-btn" [disabled]="loadingAssignments" (click)="refreshAssignments()">
              {{ loadingAssignments ? 'Refreshing...' : 'Refresh assignments' }}
            </button>
          </div>
          <p class="account-context">Signed in as {{ signedInAccount }} · Teacher ID {{ signedInTeacherId }}</p>

          <div class="class-list">
            <div class="class-card" *ngFor="let item of classes">
              <div>
                <h4>{{ item.name }}</h4>
                <p>{{ item.students }} Students</p>
              </div>
              <span>{{ item.role }}</span>
              <button type="button" (click)="goTo('/teacher/students?classId=' + item.id)">View Class</button>
            </div>
          </div>
          <p class="load-error" role="alert" *ngIf="assignmentError">{{ assignmentError }}</p>
          <p *ngIf="!loadingAssignments && !classes.length && !assignmentError">No classes assigned yet.</p>
        </div>

        <div class="panel">
          <div class="panel-header">
            <h3>My Subjects</h3>
          </div>
          <div class="subject-list">
            <div class="subject-item" *ngFor="let subject of subjects">
              <strong>{{ subject.name }}</strong>
              <button type="button" (click)="goTo('/teacher/marks')">Open</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .dashboard-shell {
        display: flex;
        flex-direction: column;
        gap: 1.2rem;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
        gap: 1rem;
      }

      .content-grid {
        display: grid;
        grid-template-columns: 1.3fr 0.7fr;
        gap: 1.2rem;
      }

      .panel {
        background: linear-gradient(145deg, rgba(255,255,255,.98) 0%, rgba(239,247,246,.98) 100%);
        border: 1px solid var(--teacher-border, #d6e6e3);
        border-radius: 14px;
        box-shadow: var(--shadow-soft);
        padding: 1.2rem;
      }

      .panel-header h3 {
        margin-top: 0;
      }

      .panel-header { display: flex; align-items: center; justify-content: space-between; gap: .75rem; }
      .refresh-btn { border: 1px solid var(--teacher-border, #d6e6e3); border-radius: 8px; padding: .45rem .65rem; background: white; color: var(--teacher-green-deep, #1b6e5b); cursor: pointer; font-weight: 700; }
      .refresh-btn:disabled { opacity: .65; cursor: wait; }
      .account-context { margin: -.45rem 0 .9rem; color: var(--teacher-muted, #60777c); font-size: .85rem; overflow-wrap: anywhere; }

      .class-list, .subject-list {
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
      }

      .load-error { padding: .75rem; border: 1px solid #fecaca; background: #fef2f2; color: #b91c1c; border-radius: 8px; }

      .class-card {
        display: grid;
        grid-template-columns: 1.3fr 0.7fr auto;
        align-items: center;
        gap: 0.7rem;
        border: 1px solid var(--teacher-border, #d6e6e3);
        border-radius: 10px;
        padding: 0.9rem;
        background: linear-gradient(115deg, #f4f9fc, #eff8f4);
      }

      .class-card h4 {
        margin: 0;
      }

      .class-card p {
        margin: 0.25rem 0 0;
        color: #64748b;
      }

      .class-card span {
        background: var(--teacher-mint, #e9f6f0);
        color: var(--teacher-green-deep, #0f6d58);
        padding: 0.35rem 0.6rem;
        border-radius: 999px;
        font-size: 0.75rem;
        font-weight: 700;
      }

      .class-card button, .subject-item button {
        border: none;
        background: var(--teacher-action, linear-gradient(120deg, #21845f, #25856b));
        color: white;
        border-radius: 8px;
        padding: 0.55rem 0.8rem;
        cursor: pointer;
        font-weight: 700;
      }

      .class-card button:hover, .subject-item button:hover { filter: brightness(.94); }
      .class-card button:focus-visible, .subject-item button:focus-visible, .refresh-btn:focus-visible { outline: 3px solid rgba(22, 133, 107, .24); outline-offset: 2px; }

      .subject-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid var(--teacher-border, #d6e6e3);
        border-radius: 10px;
        padding: 0.8rem;
        background: linear-gradient(115deg, #f4f9fc, #eff8f4);
      }

      @media (max-width: 980px) {
        .stats-grid {
          grid-template-columns: repeat(2, minmax(150px, 1fr));
        }

        .content-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class TeacherDashboardComponent {
  assignmentError = '';
  loadingAssignments = false;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly assignmentService: AssignmentService,
    private readonly studentService: StudentService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {
    this.refreshAssignments();
  }

  get signedInAccount(): string {
    const user = this.authService.currentUser;
    return user?.email ?? user?.username ?? 'Unknown account';
  }

  get signedInTeacherId(): string {
    return String(this.authService.currentUser?.teacherId ?? 'not linked');
  }

  refreshAssignments(): void {
    this.loadingAssignments = true;
    this.assignmentError = '';
    this.assignmentService.getMyAssignments().subscribe({
      next: (assignments) => {
        this.loadingAssignments = false;
        this.applyAssignments(assignments);
        this.changeDetectorRef.markForCheck();
      },
      error: (error: { status?: number }) => {
        this.loadingAssignments = false;
        this.classes = [];
        this.subjects = [];
        this.assignmentError = error.status
          ? `Could not load your assignments (HTTP ${error.status}). Sign out and sign in again.`
          : 'Could not connect to the assignments service.';
        this.changeDetectorRef.markForCheck();
      },
    });
  }

  goTo(route: string): void {
    this.router.navigateByUrl(route);
  }

  classes: Array<{ id: number; name: string; students: number; role: string }> = [];
  subjects: Array<{ id: number; name: string }> = [];

  get totalStudents(): number {
    return this.classes.reduce((total, classRecord) => total + classRecord.students, 0);
  }

  private applyAssignments(assignments: AssignmentRecord[]): void {
    const classMap = new Map<number, { id: number; name: string; students: number; role: string }>();
    const subjectMap = new Map<number, { id: number; name: string }>();
    assignments.forEach((assignment) => {
      const classRecord = classMap.get(assignment.classEntity.id) ?? {
        id: assignment.classEntity.id,
        name: assignment.classEntity.name,
        students: 0,
        role: assignment.classTeacher ? 'Class Teacher' : 'Subject Teacher',
      };
      if (assignment.classTeacher) classRecord.role = 'Class Teacher';
      classMap.set(classRecord.id, classRecord);
      subjectMap.set(assignment.subject.id, assignment.subject);
    });
    this.classes = [...classMap.values()];
    this.subjects = [...subjectMap.values()];
    this.classes.forEach((classRecord) => {
      this.studentService.getStudentsByClass(classRecord.id.toString()).subscribe({
        next: (students) => {
          classRecord.students = students.length;
          this.changeDetectorRef.markForCheck();
        },
      });
    });
  }
}
