import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../../components/page-header/page-header';
import { StatusBadgeComponent } from '../../../components/status-badge/status-badge';

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
          <label><span>Number of Teachers</span><input type="number" min="0" [(ngModel)]="form.teachers" /></label>
          <label><span>Status</span><select [(ngModel)]="form.status"><option value="Active">Active</option><option value="Inactive">Inactive</option></select></label>
        </div>
        <div class="form-actions">
          <button type="button" class="primary-btn" (click)="saveSubject()">{{ isEditing ? 'Update Subject' : 'Save Subject' }}</button>
          <button type="button" class="secondary-btn" (click)="cancelForm()">Cancel</button>
        </div>
      </div>

      <div class="toolbar card">
        <input type="search" [(ngModel)]="searchTerm" placeholder="Search subjects..." />
      </div>

      <div class="card table-panel">
        <table>
          <thead>
            <tr>
              <th>Subject Code</th>
              <th>Subject Name</th>
              <th>Number of Teachers</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let subject of filteredSubjects; let i = index">
              <td>{{ subject.code }}</td>
              <td>{{ subject.name }}</td>
              <td>{{ subject.teachers }}</td>
              <td><app-status-badge [status]="subject.status"></app-status-badge></td>
              <td class="actions"><button type="button" (click)="editSubject(subject, i)">Edit</button><button type="button" (click)="deleteSubject(i)">Delete</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `,
  styles: [
    `
      .page-shell { display: flex; flex-direction: column; gap: 1.2rem; }
      .card { background: white; border: 1px solid rgba(148,163,184,.15); border-radius: 18px; box-shadow: 0 8px 22px rgba(15, 23, 42, .04); }
      .toolbar { padding: 1rem; }
      .toolbar input { width: 100%; border: 1px solid #d7e1ef; border-radius: 12px; padding: .8rem 1rem; }
      .form-panel { padding: 1.2rem; }
      .field-grid { display: grid; grid-template-columns: repeat(2, minmax(180px, 1fr)); gap: 1rem; }
      input, select { border: 1px solid #d7e1ef; border-radius: 12px; padding: .8rem 1rem; }
      label { display: flex; flex-direction: column; gap: .45rem; font-weight: 600; color: #334155; }
      .form-actions { display: flex; gap: .75rem; margin-top: 1rem; }
      .primary-btn, .secondary-btn, .actions button { border: none; border-radius: 10px; padding: .55rem .8rem; cursor: pointer; }
      .primary-btn { background: linear-gradient(135deg, #1d4ed8, #3b82f6); color: white; }
      .secondary-btn { background: #e2e8f0; color: #334155; }
      table { width: 100%; border-collapse: collapse; }
      th, td { text-align: left; padding: .9rem .8rem; border-bottom: 1px solid #e2e8f0; }
      th { color: #64748b; font-size: .75rem; text-transform: uppercase; letter-spacing: .06em; }
      .actions { display: flex; gap: .5rem; }
      .actions button { background: #eff6ff; color: #1d4ed8; }
      @media (max-width: 760px) { .field-grid { grid-template-columns: 1fr; } }
    `,
  ],
})
export class SubjectManagementComponent {
  searchTerm = '';
  showForm = false;
  isEditing = false;
  editingIndex = -1;
  form: { code: string; name: string; teachers: number; status: 'Active' | 'Inactive' } = { code: '', name: '', teachers: 0, status: 'Active' };

  subjects: Array<{ code: string; name: string; teachers: number; status: 'Active' | 'Inactive' }> = [
    { code: 'MTH101', name: 'Mathematics', teachers: 3, status: 'Active' },
    { code: 'ENG101', name: 'English', teachers: 2, status: 'Active' },
    { code: 'KIS101', name: 'Kiswahili', teachers: 2, status: 'Active' },
    { code: 'PHY101', name: 'Physics', teachers: 2, status: 'Active' },
    { code: 'CHE101', name: 'Chemistry', teachers: 2, status: 'Active' },
    { code: 'BIO101', name: 'Biology', teachers: 2, status: 'Active' },
    { code: 'GEO101', name: 'Geography', teachers: 1, status: 'Active' },
    { code: 'HIS101', name: 'History', teachers: 1, status: 'Active' },
    { code: 'ICT101', name: 'Computer Science', teachers: 2, status: 'Active' },
    { code: 'CIV101', name: 'Civics', teachers: 1, status: 'Active' },
  ];

  get filteredSubjects() {
    return this.subjects.filter((subject) =>
      subject.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      subject.code.toLowerCase().includes(this.searchTerm.toLowerCase()),
    );
  }

  toggleAddForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.cancelForm();
    }
  }

  cancelForm(): void {
    this.isEditing = false;
    this.editingIndex = -1;
    this.form = { code: '', name: '', teachers: 0, status: 'Active' };
  }

  saveSubject(): void {
    if (!this.form.code.trim() || !this.form.name.trim()) {
      return;
    }

    const payload = {
      code: this.form.code.trim().toUpperCase(),
      name: this.form.name.trim(),
      teachers: Number(this.form.teachers || 0),
      status: this.form.status,
    };

    if (this.isEditing && this.editingIndex >= 0) {
      this.subjects[this.editingIndex] = payload;
    } else {
      this.subjects.unshift(payload);
    }

    this.cancelForm();
    this.showForm = false;
  }

  editSubject(subject: typeof this.subjects[number], index: number): void {
    this.editingIndex = index;
    this.isEditing = true;
    this.form = { ...subject, status: subject.status === 'Inactive' ? 'Inactive' : 'Active' };
    this.showForm = true;
  }

  deleteSubject(index: number): void {
    this.subjects.splice(index, 1);
    if (this.editingIndex === index) {
      this.cancelForm();
    }
  }
}
