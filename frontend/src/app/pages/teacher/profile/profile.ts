import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { AssignmentService, type AssignmentRecord } from '../../../services/assignment.service';
import { AuthService } from '../../../services/auth.service';
import { TeacherService, type TeacherProfile as TeacherProfileRecord } from '../../../services/teacher.service';

@Component({
  selector: 'app-teacher-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="page-shell">
      <p class="state-message" *ngIf="loading">Loading your profile...</p>
      <p class="error-message" role="alert" *ngIf="errorMessage">{{ errorMessage }}</p>
      <p class="success-message" role="status" *ngIf="successMessage">{{ successMessage }}</p>

      <ng-container *ngIf="teacher as profile">
        <header class="profile-hero">
          <div class="hero-copy">
            <p class="eyebrow">Teacher profile</p>
            <div class="identity-row">
              <div class="avatar">{{ initials }}</div>
              <div>
                <h1>{{ profile.firstName }} {{ profile.lastName }}</h1>
                <p class="role-line">{{ roleLabel }} <span class="status-dot"></span> {{ profile.status }}</p>
              </div>
            </div>
            <p class="hero-email">{{ profile.email }}</p>
          </div>
          <button *ngIf="!editing" type="button" class="edit-button" (click)="startEditing()">Edit profile</button>
        </header>

        <form *ngIf="editing" class="edit-panel" (ngSubmit)="saveProfile()">
          <div class="panel-title">
            <div><p class="section-kicker">Your details</p><h2>Edit contact information</h2></div>
            <span class="private-note">Changes apply to your teacher account</span>
          </div>
          <div class="field-grid">
            <label><span>First name</span><input name="firstName" [(ngModel)]="editForm.firstName" required maxlength="100" /></label>
            <label><span>Last name</span><input name="lastName" [(ngModel)]="editForm.lastName" required maxlength="100" /></label>
            <label><span>Email address (@gmail.com)</span><input name="email" type="email" [(ngModel)]="editForm.email" required maxlength="50" pattern="^[A-Z0-9._%+-]+@gmail\\.com$" placeholder="name@gmail.com" /></label>
            <label><span>Phone number</span><input name="phone" type="tel" [(ngModel)]="editForm.phone" maxlength="30" /></label>
          </div>
          <div class="form-actions">
            <button class="save-button" type="submit" [disabled]="saving || !editForm.firstName.trim() || !editForm.lastName.trim() || !editForm.email.trim()">{{ saving ? 'Saving...' : 'Save changes' }}</button>
            <button class="cancel-button" type="button" [disabled]="saving" (click)="cancelEditing()">Cancel</button>
          </div>
        </form>

        <div class="details-grid">
          <section class="detail-card contact-card">
            <p class="section-kicker">Contact</p>
            <h2>Personal information</h2>
            <dl>
              <div><dt>Email address</dt><dd>{{ profile.email }}</dd></div>
              <div><dt>Phone number</dt><dd>{{ profile.phone || 'Not provided' }}</dd></div>
              <div><dt>Account status</dt><dd>{{ profile.status }}</dd></div>
            </dl>
          </section>
          <section class="detail-card assignment-card">
            <p class="section-kicker">School placement</p>
            <h2>Your assignments</h2>
            <div class="assignment-group">
              <h3>Classes</h3>
              <div class="chips"><span class="chip" *ngFor="let name of classNameList">{{ name }}</span><span class="muted" *ngIf="!classNameList.length">No classes assigned</span></div>
            </div>
            <div class="assignment-group">
              <h3>Subjects</h3>
              <div class="chips"><span class="chip subject-chip" *ngFor="let name of subjectNameList">{{ name }}</span><span class="muted" *ngIf="!subjectNameList.length">No subjects assigned</span></div>
            </div>
            <div class="class-teacher-callout" *ngIf="classTeacherNameList.length">
              <span class="callout-mark">CT</span><p><strong>Class teacher</strong><span>{{ classTeacherNameList.join(', ') }}</span></p>
            </div>
          </section>
        </div>
      </ng-container>
    </section>
  `,
  styles: [
    `
      .page-shell { display: flex; flex-direction: column; gap: 1rem; max-width: 1080px; }
      .profile-hero { position: relative; display: flex; align-items: flex-end; justify-content: space-between; gap: 1.5rem; min-height: 250px; padding: 2rem; overflow: hidden; color: #f8fafc; background: var(--teacher-gradient, linear-gradient(120deg, #155587, #167a72)); border-radius: 14px; }
      .hero-copy, .edit-button { position: relative; z-index: 1; }
      .eyebrow, .section-kicker { margin: 0 0 .75rem; color: #d7e7ff; font-size: .73rem; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; }
      .identity-row { display: flex; align-items: center; gap: 1rem; }
      .avatar { width: 72px; height: 72px; flex: 0 0 auto; display: grid; place-items: center; border: 1px solid rgba(255,255,255,.4); border-radius: 50%; color: white; background: rgba(255,255,255,.13); font-size: 1.25rem; font-weight: 750; }
      h1 { margin: 0; font-size: 2rem; line-height: 1.15; }
      .role-line { display: flex; align-items: center; gap: .5rem; margin: .45rem 0 0; color: #e1edff; }
      .status-dot { width: 7px; height: 7px; border-radius: 50%; background: #b7ed8a; }
      .hero-email { margin: 1.2rem 0 0 88px; color: #edf4ff; }
      .edit-button, .save-button, .cancel-button { border: 0; border-radius: 8px; padding: .7rem 1rem; font: inherit; font-weight: 650; cursor: pointer; }
      .edit-button { color: #fff; background: var(--teacher-action, linear-gradient(120deg, #21845f, #25856b)); }
      .edit-button:hover, .save-button:hover { filter: brightness(.95); }
      .edit-panel, .detail-card { padding: 1.25rem; border: 1px solid var(--teacher-border, #d6e6e3); border-radius: 12px; background: linear-gradient(155deg, #fff 0%, #f2f8f5 100%); box-shadow: 0 8px 24px rgba(21,85,115,.055); }
      .panel-title { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; margin-bottom: 1rem; }
      .panel-title h2, .detail-card h2 { margin: 0; font-size: 1.2rem; color: var(--teacher-ink, #183744); }
      .panel-title .section-kicker, .detail-card .section-kicker { color: var(--teacher-green, #16856b); margin-bottom: .25rem; }
      .private-note, .muted { color: #718187; font-size: .83rem; }
      .field-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
      label { display: flex; flex-direction: column; gap: .4rem; color: #385058; font-size: .88rem; font-weight: 650; }
      input { min-width: 0; border: 1px solid var(--teacher-border, #d6e6e3); border-radius: 7px; padding: .72rem .8rem; color: var(--teacher-ink, #183744); background: #fbfdfd; font: inherit; }
      input:focus { outline: 2px solid rgba(22, 133, 107, .28); border-color: var(--teacher-green, #16856b); }
      .form-actions { display: flex; gap: .6rem; justify-content: flex-end; margin-top: 1rem; }
      .save-button { color: white; background: var(--teacher-action, linear-gradient(120deg, #21845f, #25856b)); }
      .save-button:disabled, .cancel-button:disabled { opacity: .6; cursor: wait; }
      .cancel-button { color: #41565d; background: #edf2f3; }
      .details-grid { display: grid; grid-template-columns: .85fr 1.15fr; gap: 1rem; }
      .detail-card h2 { margin-bottom: 1.2rem; }
      dl { margin: 0; }
      dl div { padding: .7rem 0; border-bottom: 1px solid #e7edef; }
      dt { margin-bottom: .2rem; color: #718187; font-size: .82rem; }
      dd { margin: 0; color: #233f46; font-weight: 620; overflow-wrap: anywhere; }
      .assignment-group + .assignment-group { margin-top: 1.2rem; }
      .assignment-group h3 { margin: 0 0 .55rem; color: #60747a; font-size: .82rem; font-weight: 650; }
      .chips { display: flex; flex-wrap: wrap; gap: .45rem; }
      .chip { padding: .42rem .65rem; border: 1px solid #d0e4df; border-radius: 6px; color: var(--teacher-blue, #1d5f91); background: #edf5fa; font-size: .85rem; }
      .subject-chip { color: var(--teacher-green-deep, #0f6d58); border-color: #cde4d8; background: #eaf5ef; }
      .class-teacher-callout { display: flex; align-items: center; gap: .7rem; margin-top: 1.25rem; padding: .75rem; border-left: 3px solid #c48636; background: #fbf6ed; }
      .callout-mark { display: grid; place-items: center; width: 34px; height: 34px; border-radius: 50%; background: #f0dfc4; color: #86551f; font-size: .7rem; font-weight: 800; }
      .class-teacher-callout p { display: flex; flex-direction: column; gap: .15rem; margin: 0; color: #60491f; }
      .state-message, .error-message, .success-message { margin: 0; padding: .8rem 1rem; border: 1px solid var(--teacher-border, #d6e6e3); background: linear-gradient(110deg, #edf5fa, #eef7f2); border-radius: 8px; }
      .error-message { color: #a22d2d; border-color: #f0c7c7; background: #fff5f3; }
      .success-message { color: #176b58; border-color: #b9dece; background: #f0faf5; }
      @media (max-width: 760px) { .profile-hero { min-height: 0; align-items: flex-start; flex-direction: column; padding: 1.4rem; } .identity-row { align-items: flex-start; } h1 { font-size: 1.5rem; overflow-wrap: anywhere; } .avatar { width: 58px; height: 58px; } .hero-email { margin-left: 0; overflow-wrap: anywhere; } .details-grid, .field-grid { grid-template-columns: 1fr; } .panel-title { flex-direction: column; } }
    `,
  ],
})
export class TeacherProfileComponent implements OnInit {
  teacher: TeacherProfileRecord | null = null;
  assignments: AssignmentRecord[] = [];
  loading = true;
  editing = false;
  saving = false;
  errorMessage = '';
  successMessage = '';
  editForm = { firstName: '', lastName: '', email: '', phone: '' };

  constructor(
    private readonly teacherService: TeacherService,
    private readonly assignmentService: AssignmentService,
    private readonly authService: AuthService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    forkJoin({
      teacher: this.teacherService.getMyProfile(),
      assignments: this.assignmentService.getMyAssignments(),
    }).subscribe({
      next: ({ teacher, assignments }) => {
        this.teacher = teacher;
        this.assignments = assignments;
        this.resetForm(teacher);
        this.loading = false;
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Unable to load your profile and assignments from the server.';
        this.changeDetectorRef.markForCheck();
      },
    });
  }

  startEditing(): void {
    if (!this.teacher) return;
    this.resetForm(this.teacher);
    this.editing = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  cancelEditing(): void {
    if (this.teacher) this.resetForm(this.teacher);
    this.editing = false;
    this.errorMessage = '';
  }

  saveProfile(): void {
    if (!this.teacher || this.saving) return;
    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';
    const payload = {
      firstName: this.editForm.firstName.trim(),
      lastName: this.editForm.lastName.trim(),
      email: this.editForm.email.trim(),
      phone: this.editForm.phone.trim(),
    };
    this.teacherService.updateMyProfile(payload).subscribe({
      next: (teacher) => {
        this.teacher = teacher;
        this.authService.updateCurrentUserProfile({
          email: teacher.email,
          firstName: teacher.firstName,
          lastName: teacher.lastName,
        });
        this.resetForm(teacher);
        this.editing = false;
        this.saving = false;
        this.successMessage = 'Your profile was updated.';
        this.changeDetectorRef.markForCheck();
      },
      error: (error: { error?: unknown; status?: number }) => {
        const serverMessage = typeof error.error === 'string' ? error.error : '';
        this.errorMessage = serverMessage || `Unable to update your profile${error.status ? ` (HTTP ${error.status})` : ''}.`;
        this.saving = false;
        this.changeDetectorRef.markForCheck();
      },
    });
  }

  get classNameList(): string[] {
    return [...new Set(this.assignments.map((assignment) => assignment.classEntity.name))];
  }

  get subjectNameList(): string[] {
    return [...new Set(this.assignments.map((assignment) => assignment.subject.name))];
  }

  get classTeacherNameList(): string[] {
    return [...new Set(this.assignments
      .filter((assignment) => assignment.classTeacher)
      .map((assignment) => assignment.classEntity.name))];
  }

  get initials(): string {
    return `${this.teacher?.firstName?.[0] ?? ''}${this.teacher?.lastName?.[0] ?? ''}`.toUpperCase();
  }

  get roleLabel(): string {
    if (this.assignments.some((assignment) => assignment.classTeacher)) return 'Class & Subject Teacher';
    return this.assignments.length ? 'Subject Teacher' : 'Teacher awaiting assignments';
  }

  private resetForm(teacher: TeacherProfileRecord): void {
    this.editForm = {
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      email: teacher.email,
      phone: teacher.phone ?? '',
    };
  }
}
