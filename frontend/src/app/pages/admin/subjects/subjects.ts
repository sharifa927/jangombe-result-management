import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../../components/page-header/page-header';
import { StatusBadgeComponent } from '../../../components/status-badge/status-badge';
import { SubjectService, type SubjectRecord } from '../../../services/subject.service';

@Component({
  selector: 'app-subject-management',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, StatusBadgeComponent],
  template: `
    <section class="page-shell">
      <app-page-header eyebrow="Curriculum" title="Subject Management" actionLabel="Add Subject" (action)="toggleAddForm()"></app-page-header>

      <div class="card form-panel" *ngIf="showForm">
        <h3>{{ isEditing ? 'Edit Subject' : 'Add New Subject' }}</h3>
        <div class="field-grid">
          <label><span>Subject Code</span><input type="text" [(ngModel)]="form.code" /></label>
          <label><span>Subject Name</span><input type="text" [(ngModel)]="form.name" /></label>
          <label><span>Status</span><select [(ngModel)]="form.status"><option value="Active">Active</option><option value="Inactive">Inactive</option></select></label>
        </div>
        <div class="form-actions">
          <button type="button" class="primary-btn" (click)="saveSubject()">{{ isEditing ? 'Update Subject' : 'Save Subject' }}</button>
          <button type="button" class="secondary-btn" (click)="cancelForm()">Cancel</button>
        </div>
      </div>

      <ng-container *ngIf="!showForm">
        <div class="toolbar card">
          <input type="search" [(ngModel)]="searchTerm" placeholder="Search subjects..." />
        </div>

        <div class="card table-panel">
          <table>
            <thead>
              <tr>
                <th>Subject Code</th>
                <th>Subject Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let subject of filteredSubjects; let i = index">
                <td>{{ subject.code }}</td>
                <td>{{ subject.name }}</td>
                <td><app-status-badge [status]="subject.status"></app-status-badge></td>
                <td class="actions"><button type="button" class="edit-btn" (click)="editSubject(subject)">Edit</button><button type="button" class="danger-btn" (click)="deleteSubject(subject)">Delete</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </ng-container>
    </section>
  `,
  styles: [
    `
      .page-shell { display: flex; flex-direction: column; gap: 1.2rem; }
      .card { background: linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%); border: 1px solid rgba(148,163,184,.15); border-radius: 22px; box-shadow: 0 12px 30px rgba(15, 23, 42, .04); }
      .toolbar { padding: 1rem; }
      .toolbar input { width: 100%; border: 1px solid #d7e1ef; border-radius: 12px; padding: .8rem 1rem; background: white; }
      .form-panel { padding: 1.2rem; }
      .field-grid { display: grid; grid-template-columns: repeat(2, minmax(180px, 1fr)); gap: 1rem; }
      input, select { border: 1px solid #d7e1ef; border-radius: 12px; padding: .8rem 1rem; background: white; }
      label { display: flex; flex-direction: column; gap: .45rem; font-weight: 600; color: #334155; }
      .form-actions { display: flex; gap: .75rem; margin-top: 1rem; }
      .primary-btn, .secondary-btn, .actions button { border: none; border-radius: 10px; padding: .55rem .8rem; cursor: pointer; }
      .primary-btn { background: var(--teacher-action, linear-gradient(120deg, #21845f, #25856b)); color: white; }
      .secondary-btn { background: #e2e8f0; color: #334155; }
      table { width: 100%; border-collapse: collapse; }
      th, td { text-align: left; padding: .9rem .8rem; border-bottom: 1px solid #e2e8f0; }
      th { color: #64748b; font-size: .75rem; text-transform: uppercase; letter-spacing: .06em; }
      tbody tr:hover { background: rgba(239,246,255,0.7); }
      .actions { display: flex; gap: .5rem; }
      .actions button:not(.danger-btn) { background: #e6f4ec; color: var(--teacher-green-deep, #1b6e5b); }
      .actions .danger-btn { border: 1px solid #fecaca; border-radius: 10px; padding: .55rem .8rem; background: #fff1f0; color: #b91c1c; font-weight: 700; transition: background .16s ease, border-color .16s ease; }
      .actions .danger-btn:hover { border-color: #fca5a5; background: #fee2e2; }
      .actions .danger-btn:focus-visible { outline-color: rgba(185, 28, 28, .3); }
      .primary-btn:focus-visible, .secondary-btn:focus-visible, .actions button:focus-visible { outline: 3px solid rgba(37, 133, 107, .25); outline-offset: 2px; }
      @media (max-width: 760px) { .field-grid { grid-template-columns: 1fr; } }
    `,
  ],
})
export class SubjectManagementComponent implements OnInit {
  searchTerm = '';
  showForm = false;
  isEditing = false;
  editingId?: number;
  form = { code: '', name: '', status: 'ACTIVE' };
  subjects: SubjectRecord[] = [];

  constructor(
    private readonly subjectService: SubjectService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadSubjects();
  }

  private loadSubjects(): void {
    this.subjectService.getSubjects().subscribe({
      next: (subjects) => {
        this.subjects = subjects;
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.subjects = [];
        this.changeDetectorRef.markForCheck();
      },
    });
  }

  get filteredSubjects() {
    return this.subjects.filter((subject) =>
      subject.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      subject.code.toLowerCase().includes(this.searchTerm.toLowerCase()),
    );
  }

  openAddForm(): void {
    this.isEditing = false;
    this.editingId = undefined;
    this.form = { code: '', name: '', status: 'ACTIVE' };
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
    this.editingId = undefined;
    this.form = { code: '', name: '', status: 'ACTIVE' };
    this.showForm = false;
  }

  saveSubject(): void {
    if (!this.form.code.trim() || !this.form.name.trim()) {
      return;
    }

    const payload = {
      code: this.form.code.trim().toUpperCase(),
      name: this.form.name.trim(),
      status: this.form.status.toUpperCase(),
    };

    const request = this.editingId !== undefined
      ? this.subjectService.updateSubject(this.editingId, payload)
      : this.subjectService.addSubject(payload);
    request.subscribe({
      next: () => {
        this.loadSubjects();
        this.cancelForm();
        this.showForm = false;
        this.changeDetectorRef.markForCheck();
      },
    });
  }

  editSubject(subject: SubjectRecord): void {
    this.editingId = subject.id;
    this.isEditing = true;
    this.form = { code: subject.code, name: subject.name, status: subject.status.toUpperCase() };
    this.showForm = true;
  }

  deleteSubject(subject: SubjectRecord): void {
    this.subjectService.deleteSubject(subject.id).subscribe(() => {
      this.loadSubjects();
      this.changeDetectorRef.markForCheck();
    });
  }
}
