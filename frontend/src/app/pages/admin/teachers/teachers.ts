import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize, timeout } from 'rxjs';
import type { Teacher } from '../../../models';
import { TeacherService } from '../../../services/teacher.service';
import { AssignmentService, type AssignmentRecord } from '../../../services/assignment.service';
import { PageHeaderComponent } from '../../../components/page-header/page-header';
import { StatusBadgeComponent } from '../../../components/status-badge/status-badge';

@Component({
  selector: 'app-teacher-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageHeaderComponent,
    StatusBadgeComponent,
  ],
  template: `
    <section class="page-shell">
      <app-page-header
        eyebrow="Administration"
        title="Teacher Management"
        actionLabel="Add Teacher"
        (action)="toggleAddForm()">
      </app-page-header>

      <div class="card form-panel" *ngIf="showForm">
        <h3>{{ isEditing ? 'Edit Teacher' : 'Add New Teacher' }}</h3>

        <div class="field-grid">
          <label>
            <span>Teacher ID</span>
            <input type="text" [(ngModel)]="form.id" />
          </label>

          <label>
            <span>First Name</span>
            <input type="text" [(ngModel)]="form.firstName" required />
          </label>

          <label>
            <span>Last Name</span>
            <input type="text" [(ngModel)]="form.lastName" required />
          </label>

          <label>
            <span>Email</span>
            <input type="email" [(ngModel)]="form.email" required pattern="^[A-Z0-9._%+-]+@gmail\.com$" placeholder="name@gmail.com" />
          </label>

          <label>
            <span>Phone</span>
            <input type="text" [(ngModel)]="form.phone" [value]="''" autocomplete="off" placeholder="" />
          </label>

          <label>
            <span>Password</span>
            <div class="password-input-wrap">
              <input [type]="showTeacherPassword ? 'text' : 'password'" [(ngModel)]="form.password" [value]="''" [required]="!isEditing" minlength="8" maxlength="72" pattern="(?=.*[A-Z]).*" autocomplete="new-password" placeholder="8+ characters, one capital letter" />
              <button type="button" class="password-toggle" [attr.aria-label]="showTeacherPassword ? 'Hide password' : 'Show password'" [title]="showTeacherPassword ? 'Hide password' : 'Show password'" (click)="showTeacherPassword = !showTeacherPassword">
                <span class="eye-icon" [class.visible]="showTeacherPassword" aria-hidden="true"></span>
              </button>
            </div>
          </label>

          <label>
            <span>Status</span>
            <select [(ngModel)]="form.status">
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </label>
        </div>

        <div class="form-actions">
          <button
            type="button"
            class="primary-btn"
            (click)="saveTeacher()"
            [disabled]="saving">
            {{
              saving
                ? 'Saving...'
                : (isEditing ? 'Update Teacher' : 'Save Teacher')
            }}
          </button>

          <button
            type="button"
            class="secondary-btn"
            (click)="cancelForm()">
            Cancel
          </button>
        </div>

        <div class="error-box" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>
        <div class="success-box" *ngIf="successMessage">{{ successMessage }}</div>
      </div>

      <ng-container *ngIf="!showForm">
        <div class="summary-row">
          <div class="metric-card">
            <span>All Teachers</span>
            <strong>{{ teachers.length }}</strong>
          </div>
          <div class="metric-card">
            <span>Class Teachers</span>
            <strong>{{ classTeacherCount }}</strong>
          </div>
        </div>

        <div class="toolbar card">
          <div class="teacher-view-toggle" role="tablist" aria-label="Teacher list view">
            <button type="button" role="tab" [attr.aria-selected]="teacherView === 'all'" [class.active]="teacherView === 'all'" (click)="teacherView = 'all'">
              All Teachers <span>{{ teachers.length }}</span>
            </button>
            <button type="button" role="tab" [attr.aria-selected]="teacherView === 'class'" [class.active]="teacherView === 'class'" (click)="teacherView = 'class'">
              Class Teachers <span>{{ classTeacherCount }}</span>
            </button>
          </div>
          <input
            type="search"
            [(ngModel)]="searchTerm"
            [placeholder]="teacherView === 'class' ? 'Search class teachers...' : 'Search teachers...'" />
        </div>

        <div class="card table-panel">
          <div
            class="loading-row"
            *ngIf="loading && teachers.length === 0">
            Loading teachers...
          </div>

          <div
            class="error-box"
            *ngIf="errorMessage && teachers.length === 0">
            {{ errorMessage }}
          </div>

          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Teacher ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                <tr *ngFor="let teacher of filteredTeachers">
                  <td>{{ teacher.id }}</td>

                  <td>
                    {{ getTeacherFullName(teacher) }}
                  </td>

                  <td>{{ teacher.email }}</td>

                  <td>{{ teacher.phone }}</td>

                  <td>{{ classTeacherLabel(teacher) }}</td>

                  <td>
                    <app-status-badge
                      [status]="teacher.status">
                    </app-status-badge>
                  </td>

                  <td class="actions">
                    <button
                      type="button"
                      class="edit-btn"
                      (click)="editTeacher(teacher)">
                      Edit
                    </button>

                    <button
                      type="button"
                      class="danger-btn"
                      (click)="deleteTeacher(teacher)">
                      Delete
                    </button>
                  </td>
                </tr>
                <tr *ngIf="!loading && !errorMessage && filteredTeachers.length === 0">
                  <td colspan="7" class="empty-state">
                    {{ teacherView === 'class' ? 'No class teachers match your search.' : 'No teachers match your search.' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </ng-container>
    </section>
  `,

  styles: [
    `
      .page-shell {
        display: flex;
        flex-direction: column;
        gap: 1.2rem;
      }

      .card {
        background: linear-gradient(
          180deg,
          rgba(255,255,255,0.98) 0%,
          rgba(248,250,252,0.98) 100%
        );
        border-radius: 22px;
        border: 1px solid rgba(148,163,184,.15);
        box-shadow: 0 12px 30px rgba(15, 23, 42, 0.04);
      }

      .summary-row {
        display: grid;
        grid-template-columns: repeat(2, minmax(150px, 1fr));
        gap: 1rem;
      }

      .metric-card {
        background: linear-gradient(135deg, #f8fbff 0%, #eaf2ff 100%);
        border: 1px solid rgba(59, 130, 246, 0.1);
        border-radius: 18px;
        padding: 1rem 1.1rem;
        box-shadow: 0 12px 24px rgba(37, 99, 235, 0.06);
      }

      .metric-card span {
        display: block;
        font-size: 0.7rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #64748b;
      }

      .metric-card strong {
        display: block;
        margin-top: 0.4rem;
        font-size: 1.8rem;
        color: #0f172a;
      }

      .toolbar {
        padding: 1rem;
        display: flex;
        gap: .8rem;
        align-items: center;
        justify-content: space-between;
      }

      .teacher-view-toggle { display: inline-flex; flex: 0 0 auto; gap: .15rem; padding: .2rem; background: #eef2f6; border: 1px solid #dbe3eb; border-radius: 8px; }
      .teacher-view-toggle button { border: 0; border-radius: 6px; padding: .55rem .75rem; background: transparent; color: #475569; cursor: pointer; font: inherit; }
      .teacher-view-toggle button.active { background: #e6f4ec; color: #1b6e5b; box-shadow: 0 1px 3px rgba(15,23,42,.12); }
      .teacher-view-toggle span { margin-left: .25rem; color: #64748b; font-size: .85em; }
      .empty-state { text-align: center; color: #64748b; padding: 1.5rem; }

      .toolbar input,
      .toolbar select {
        flex: 1;
        border: 1px solid #d7e1ef;
        border-radius: 12px;
        padding: .8rem 1rem;
        background: white;
      }

      .form-panel {
        padding: 1.2rem;
      }

      .field-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(180px, 1fr));
        gap: 1rem;
      }

      label {
        display: flex;
        flex-direction: column;
        gap: .45rem;
        font-weight: 600;
        color: #334155;
      }

      input,
      select {
        border: 1px solid #d7e1ef;
        border-radius: 12px;
        padding: .8rem 1rem;
        background: white;
      }

      .password-input-wrap { display: flex; align-items: center; border: 1px solid #d7e1ef; border-radius: 12px; background: white; }
      .password-input-wrap input { flex: 1; min-width: 0; border: 0; background: transparent; }
      .password-toggle { border: 0; background: transparent; color: #1b6e5b; padding: .55rem .8rem; cursor: pointer; }
      .eye-icon { position: relative; display: block; width: 18px; height: 13px; color: currentColor; }
      .eye-icon::before { content: ''; position: absolute; left: 2px; top: 1px; width: 12px; height: 10px; border: 1.5px solid currentColor; border-radius: 75% 15%; transform: rotate(45deg); }
      .eye-icon::after { content: ''; position: absolute; left: 7px; top: 4px; width: 4px; height: 4px; border-radius: 50%; background: currentColor; }
      .eye-icon:not(.visible) { overflow: hidden; }
      .eye-icon:not(.visible)::before { border-color: transparent currentColor currentColor transparent; }

      .form-actions {
        display: flex;
        gap: .75rem;
        margin-top: 1rem;
      }

      .primary-btn,
      .secondary-btn,
      .actions button {
        border: none;
        border-radius: 10px;
        padding: .55rem .8rem;
        cursor: pointer;
      }

      .primary-btn {
        background: var(--teacher-action, linear-gradient(120deg, #21845f, #25856b));
        color: white;
      }

      .secondary-btn {
        background: #e2e8f0;
        color: #334155;
      }

      .table-panel {
        padding: 0.8rem;
      }

      .table-wrap {
        overflow-x: auto;
        border-radius: 16px;
        border: 1px solid #e2e8f0;
      }

      table {
        width: 100%;
        min-width: 1200px;
        border-collapse: collapse;
        background: #ffffff;
      }

      th,
      td {
        border-bottom: 1px solid #e2e8f0;
        text-align: left;
        padding: .9rem .7rem;
      }

      th {
        color: #64748b;
        font-size: .8rem;
        text-transform: uppercase;
        letter-spacing: .06em;
        background: #f8fafc;
      }

      tbody tr {
        transition: background 0.15s ease;
      }

      tbody tr:hover {
        background: rgba(239,246,255,0.7);
      }

      .actions {
        display: flex;
        gap: .5rem;
      }

      .actions button:not(.danger-btn) { background: #e6f4ec; color: #1b6e5b; }
      .actions .danger-btn { border: 1px solid #fecaca; border-radius: 10px; padding: .55rem .8rem; background: #fff1f0; color: #b91c1c; font-weight: 700; transition: background .16s ease, border-color .16s ease; }
      .actions .danger-btn:hover { border-color: #fca5a5; background: #fee2e2; }
      .actions .danger-btn:focus-visible { outline-color: rgba(185, 28, 28, .3); }

      .loading-row,
      .error-box {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        padding: .8rem 1rem;
        color: #334155;
      }

      .error-box {
        background: #fef2f2;
        color: #b91c1c;
        border-color: #fecaca;
      }

      .success-box {
        background: #ecfdf5;
        color: #065f46;
        border: 1px solid #bbf7d0;
        border-radius: 10px;
        padding: .8rem 1rem;
      }

      @media (max-width: 760px) {
        .summary-row {
          grid-template-columns: 1fr;
        }

        .toolbar {
          flex-direction: column;
        }

        .field-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class TeacherManagementComponent implements OnInit {
  searchTerm = '';

  showForm = false;
  isEditing = false;
  loading = false;
  saving = false;
  errorMessage = '';
  successMessage = '';
  showTeacherPassword = false;

  form = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    status: 'ACTIVE',
  };

  teachers: Teacher[] = [];
  teacherView: 'all' | 'class' = 'all';
  assignments: AssignmentRecord[] = [];

  constructor(
    private readonly teacherService: TeacherService,
    private readonly assignmentService: AssignmentService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadTeachers();
    this.loadAssignments();
  }

  private loadAssignments(): void {
    this.assignmentService.getAssignments().subscribe({
      next: (items) => {
        this.assignments = items;
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Unable to load class-teacher assignments from the server.';
        this.changeDetectorRef.markForCheck();
      },
    });
  }

  get classTeacherRows(): Array<{ classId: number; className: string; teacherId: number; teacherName: string }> {
    const rows = new Map<string, { classId: number; className: string; teacherId: number; teacherName: string }>();
    for (const assignment of this.assignments.filter((item) => item.classTeacher)) {
      const key = `${assignment.classEntity.id}:${assignment.teacher.id}`;
      rows.set(key, {
        classId: assignment.classEntity.id,
        className: assignment.classEntity.name,
        teacherId: assignment.teacher.id,
        teacherName: `${assignment.teacher.firstName} ${assignment.teacher.lastName}`.trim(),
      });
    }
    return [...rows.values()];
  }

  get classTeacherCount(): number {
    return new Set(this.classTeacherRows.map((row) => row.teacherId)).size;
  }

  classTeacherLabel(teacher: Teacher): string {
    const classes = this.classTeacherRows
      .filter((row) => row.teacherId === Number(teacher.id))
      .map((row) => row.className);
    return classes.length ? `Class teacher: ${classes.join(', ')}` : 'Teacher';
  }


  get filteredTeachers() {
    return this.teachers.filter((teacher) => {
      const teacherHasClassRole = this.classTeacherRows.some((row) => row.teacherId === Number(teacher.id));
      if (this.teacherView === 'class' && !teacherHasClassRole) return false;

      const fullName =
        `${teacher.firstName || ''} ${teacher.lastName || ''}`.toLowerCase();

      const search =
        this.searchTerm.toLowerCase();

      const roleAndClasses = this.classTeacherRows
        .filter((row) => row.teacherId === Number(teacher.id))
        .map((row) => row.className)
        .join(' ')
        .toLowerCase();

      const matchesSearch =
        fullName.includes(search) ||
        teacher.email.toLowerCase().includes(search) ||
        roleAndClasses.includes(search);

      return matchesSearch;
    });
  }

  getTeacherFullName(teacher: Teacher): string {
    return [
      teacher.firstName,
      teacher.lastName,
    ]
      .filter(Boolean)
      .join(' ');
  }

  getTeacherValues(values?: string[]): string {
    return values && values.length
      ? values.join(', ')
      : '—';
  }

  loadTeachers(): void {
    this.loading = true;
    this.errorMessage = '';

    this.teacherService.getTeachers().subscribe({
      next: (teachers) => {
        this.teachers = teachers ?? [];
        this.loading = false;
        this.changeDetectorRef.markForCheck();
      },

      error: () => {
        this.loading = false;
        this.errorMessage =
          'Unable to load teachers from the server.';
        this.teachers = [];
        this.changeDetectorRef.markForCheck();
      },
    });
  }

  openAddForm(): void {
    this.showForm = false;
    this.successMessage = '';
    this.errorMessage = '';
    this.isEditing = false;
    this.showTeacherPassword = false;
    this.form = {
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      status: 'ACTIVE',
    };
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
    this.isEditing = false;
    this.showTeacherPassword = false;
    this.form.phone = '';
    this.form.password = '';
    this.form = {
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      status: 'ACTIVE',
    };
    this.showForm = false;
  }

  saveTeacher(): void {
    if (
      !this.form.firstName.trim() ||
      !this.form.lastName.trim() ||
      !this.form.email.trim()
    ) {
      this.errorMessage =
        'First name, last name, and email are required.';
      return;
    }

    if (!this.isEditing && !this.form.password.trim()) {
      this.errorMessage = 'Password is required for new teachers.';
      return;
    }

    if (!/^[A-Z0-9._%+-]+@gmail\.com$/i.test(this.form.email.trim())) {
      this.errorMessage = 'Email must be a valid @gmail.com address.';
      return;
    }

    if (!this.isEditing && (this.form.password.length < 8 || this.form.password.length > 72 || !/[A-Z]/.test(this.form.password))) {
      this.errorMessage = 'Password must be 8 to 72 characters and include at least one capital letter.';
      return;
    }

    const payload: any = {
      firstName: this.form.firstName.trim(),
      lastName: this.form.lastName.trim(),
      email: this.form.email.trim(),
      phone: this.form.phone.trim(),
      status: this.form.status,
    };

    // Only include password for new teachers
    if (!this.isEditing) {
      payload.password = this.form.password;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const request$ =
      this.isEditing && this.form.id
        ? this.teacherService.updateTeacher(
            this.form.id,
            payload
          )
        : this.teacherService.addTeacher(payload);

    request$.pipe(
      timeout({ first: 20000 }),
      finalize(() => this.saving = false),
    ).subscribe({
      next: () => {
        this.successMessage = `Teacher saved successfully.`;
        this.cancelForm();
        this.showForm = false;
        this.loadTeachers();
        this.changeDetectorRef.markForCheck();
      },
      error: (error: any) => {
        const backendMessage = typeof error?.error === 'string'
          ? error.error
          : error?.error?.message ?? error?.message;
        const message = error?.name === 'TimeoutError'
          ? 'The server did not respond within 20 seconds. Check the backend and try again.'
          : error?.status === 0
            ? 'Cannot reach the backend. Check that the server is running, then try again.'
            : backendMessage ?? `Server request failed${error?.status ? ` (HTTP ${error.status})` : ''}.`;
        this.errorMessage = `Unable to save the teacher: ${message}`;
        this.changeDetectorRef.markForCheck();
      },
    });
  }

  editTeacher(teacher: Teacher): void {
    this.isEditing = true;

    this.form = {
      id: String(teacher.id ?? ''),
      firstName: teacher.firstName ?? '',
      lastName: teacher.lastName ?? '',
      email: teacher.email,
      phone: teacher.phone ?? '',
      password: '', // Password not required for editing
      status:
        teacher.status === 'INACTIVE'
          ? 'INACTIVE'
          : 'ACTIVE',
    };

    this.showForm = true;
  }

  deleteTeacher(teacher: Teacher): void {
    if (!teacher.id) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.teacherService
      .deleteTeacher(teacher.id)
      .subscribe({
        next: () => {
          this.loading = false;
          this.loadTeachers();
          this.changeDetectorRef.markForCheck();
        },

        error: (error) => {
          console.error(
            'Unable to delete teacher:',
            error
          );

          this.loading = false;

          this.errorMessage =
            'Unable to delete the teacher from the server.';
          this.changeDetectorRef.markForCheck();
        },
      });
  }
}