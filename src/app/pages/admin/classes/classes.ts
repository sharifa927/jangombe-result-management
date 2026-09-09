import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../../components/page-header/page-header';
import { StatusBadgeComponent } from '../../../components/status-badge/status-badge';

@Component({
  selector: 'app-class-management',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, StatusBadgeComponent],
  template: `
    <section class="page-shell">
      <app-page-header eyebrow="Academics" title="Class Management" actionLabel="Add Class" (action)="toggleAddForm()"></app-page-header>

      <div class="card form-panel" *ngIf="showForm">
        <h3>{{ isEditing ? 'Edit Class' : 'Add New Class' }}</h3>
        <div class="field-grid">
          <label>
            <span>Class Name</span>
            <input type="text" [(ngModel)]="form.name" placeholder="Form 5A" />
          </label>
          <label>
            <span>Students</span>
            <input type="number" min="0" [(ngModel)]="form.students" />
          </label>
          <label>
            <span>Class Teacher</span>
            <input type="text" [(ngModel)]="form.teacher" placeholder="Teacher name" />
          </label>
          <label>
            <span>Status</span>
            <select [(ngModel)]="form.status">
              <option value="Active">Active</option>
              <option value="Archived">Archived</option>
            </select>
          </label>
        </div>
        <div class="form-actions">
          <button type="button" class="primary-btn" (click)="saveClass()">{{ isEditing ? 'Update Class' : 'Save Class' }}</button>
          <button type="button" class="secondary-btn" (click)="cancelForm()">Cancel</button>
        </div>
      </div>

      <div class="card search-panel">
        <input type="search" [(ngModel)]="searchTerm" placeholder="Search classes..." />
      </div>

      <div class="card table-panel">
        <table>
          <thead>
            <tr>
              <th>Class Name</th>
              <th>Number of Students</th>
              <th>Class Teacher</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of filteredClasses; let i = index">
              <td>{{ item.name }}</td>
              <td>{{ item.students }}</td>
              <td>{{ item.teacher }}</td>
              <td><app-status-badge [status]="item.status"></app-status-badge></td>
              <td class="actions"><button type="button" (click)="editClass(item, i)">Edit</button><button type="button" (click)="deleteClass(i)">Delete</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `,
  styles: [
    `
      .page-shell { display: flex; flex-direction: column; gap: 1.2rem; }
      .card { background: white; border-radius: 18px; border: 1px solid rgba(148,163,184,.15); box-shadow: 0 8px 22px rgba(15,23,42,.04); }
      .search-panel { padding: 1rem; }
      .search-panel input { width: 100%; border: 1px solid #d7e1ef; border-radius: 12px; padding: .8rem 1rem; }
      .form-panel { padding: 1.2rem; }
      .field-grid { display: grid; grid-template-columns: repeat(2, minmax(180px, 1fr)); gap: 1rem; }
      label { display: flex; flex-direction: column; gap: .45rem; font-weight: 600; color: #334155; }
      input, select { border: 1px solid #d7e1ef; border-radius: 12px; padding: .8rem 1rem; }
      .form-actions { display: flex; gap: .75rem; margin-top: 1rem; }
      .primary-btn, .secondary-btn, .actions button { border: none; border-radius: 10px; padding: .55rem .8rem; cursor: pointer; }
      .primary-btn { background: linear-gradient(135deg, #1d4ed8, #3b82f6); color: white; }
      .secondary-btn { background: #e2e8f0; color: #334155; }
      table { width: 100%; border-collapse: collapse; }
      th, td { text-align: left; padding: .9rem .8rem; border-bottom: 1px solid #e2e8f0; }
      th { color: #64748b; text-transform: uppercase; letter-spacing: .06em; font-size: .75rem; }
      .actions { display: flex; gap: .5rem; }
      .actions button { background: #eff6ff; color: #1d4ed8; }
      @media (max-width: 760px) { .field-grid { grid-template-columns: 1fr; } }
    `,
  ],
})
export class ClassManagementComponent {
  searchTerm = '';
  showForm = false;
  isEditing = false;
  editingIndex = -1;
  form: { name: string; students: number; teacher: string; status: 'Active' | 'Archived' } = { name: '', students: 0, teacher: '', status: 'Active' };

  classes: Array<{ name: string; students: number; teacher: string; status: 'Active' | 'Archived' }> = [
    { name: 'Form 1A', students: 41, teacher: 'Khamis Mbezi', status: 'Active' },
    { name: 'Form 1B', students: 39, teacher: 'Fatma Mroso', status: 'Active' },
    { name: 'Form 2A', students: 42, teacher: 'Asha Ali', status: 'Active' },
    { name: 'Form 2B', students: 40, teacher: 'Khamis Mbezi', status: 'Active' },
    { name: 'Form 3A', students: 45, teacher: 'Fatma Mroso', status: 'Active' },
    { name: 'Form 3B', students: 44, teacher: 'Asha Ali', status: 'Active' },
    { name: 'Form 4A', students: 38, teacher: 'Juma Mneni', status: 'Active' },
    { name: 'Form 4B', students: 37, teacher: 'Khamis Mbezi', status: 'Active' },
  ];

  get filteredClasses() {
    return this.classes.filter((item) =>
      item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.teacher.toLowerCase().includes(this.searchTerm.toLowerCase()),
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
    this.form = { name: '', students: 0, teacher: '', status: 'Active' };
  }

  saveClass(): void {
    if (!this.form.name.trim()) {
      return;
    }

    const payload = {
      name: this.form.name.trim(),
      students: Number(this.form.students || 0),
      teacher: this.form.teacher.trim() || 'Unassigned',
      status: this.form.status,
    };

    if (this.isEditing && this.editingIndex >= 0) {
      this.classes[this.editingIndex] = payload;
    } else {
      this.classes.unshift(payload);
    }

    this.cancelForm();
    this.showForm = false;
  }

  editClass(item: typeof this.classes[number], index: number): void {
    this.editingIndex = index;
    this.isEditing = true;
    this.form = { ...item, status: item.status === 'Archived' ? 'Archived' : 'Active' };
    this.showForm = true;
  }

  deleteClass(index: number): void {
    this.classes.splice(index, 1);
    if (this.editingIndex === index) {
      this.cancelForm();
    }
  }
}
