import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../../components/page-header/page-header';
import { StatusBadgeComponent } from '../../../components/status-badge/status-badge';

@Component({
  selector: 'app-teacher-management',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, StatusBadgeComponent],
  template: `
    <section class="page-shell">
      <app-page-header eyebrow="Administration" title="Teacher Management" actionLabel="Add Teacher" (action)="toggleAddForm()"></app-page-header>

      <div class="card form-panel" *ngIf="showForm">
        <h3>{{ isEditing ? 'Edit Teacher' : 'Add New Teacher' }}</h3>
        <div class="field-grid">
          <label><span>Teacher ID</span><input type="text" [(ngModel)]="form.id" /></label>
          <label><span>Full Name</span><input type="text" [(ngModel)]="form.fullName" /></label>
          <label><span>Email</span><input type="email" [(ngModel)]="form.email" /></label>
          <label><span>Phone</span><input type="text" [(ngModel)]="form.phone" /></label>
          <label><span>Gender</span><select [(ngModel)]="form.gender"><option>Male</option><option>Female</option></select></label>
          <label><span>Assigned Classes</span><input type="text" [(ngModel)]="form.classes" /></label>
          <label><span>Assigned Subjects</span><input type="text" [(ngModel)]="form.subjects" /></label>
          <label><span>Teacher Type</span><select [(ngModel)]="form.type"><option>Class Teacher</option><option>Subject Teacher</option><option>Class & Subject Teacher</option></select></label>
          <label><span>Status</span><select [(ngModel)]="form.status"><option>Active</option><option>Inactive</option><option>On Leave</option></select></label>
        </div>
        <div class="form-actions">
          <button type="button" class="primary-btn" (click)="saveTeacher()">{{ isEditing ? 'Update Teacher' : 'Save Teacher' }}</button>
          <button type="button" class="secondary-btn" (click)="cancelForm()">Cancel</button>
        </div>
      </div>

      <div class="toolbar card">
        <input type="search" [(ngModel)]="searchTerm" placeholder="Search teacher..." />
        <select [(ngModel)]="typeFilter">
          <option value="All">All Teachers</option>
          <option value="Class Teacher">Class Teacher</option>
          <option value="Subject Teacher">Subject Teacher</option>
          <option value="Class & Subject Teacher">Class & Subject Teacher</option>
        </select>
      </div>

      <div class="card table-panel">
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Teacher ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Gender</th>
                <th>Assigned Classes</th>
                <th>Assigned Subjects</th>
                <th>Teacher Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let teacher of filteredTeachers; let i = index">
                <td>{{ teacher.id }}</td>
                <td>{{ teacher.fullName }}</td>
                <td>{{ teacher.email }}</td>
                <td>{{ teacher.phone }}</td>
                <td>{{ teacher.gender }}</td>
                <td>{{ teacher.classes }}</td>
                <td>{{ teacher.subjects }}</td>
                <td><app-status-badge [status]="teacher.type"></app-status-badge></td>
                <td><app-status-badge [status]="teacher.status"></app-status-badge></td>
                <td class="actions"><button type="button" (click)="editTeacher(teacher, i)">Edit</button><button type="button" (click)="deleteTeacher(i)">Delete</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .page-shell { display: flex; flex-direction: column; gap: 1.2rem; }
      .card { background: white; border-radius: 18px; border: 1px solid rgba(148,163,184,.15); box-shadow: 0 8px 22px rgba(15, 23, 42, 0.04); }
      .toolbar { padding: 1rem; display: flex; gap: .8rem; }
      .toolbar input, .toolbar select { flex: 1; border: 1px solid #d7e1ef; border-radius: 12px; padding: .8rem 1rem; }
      .form-panel { padding: 1.2rem; }
      .field-grid { display: grid; grid-template-columns: repeat(2, minmax(180px, 1fr)); gap: 1rem; }
      label { display: flex; flex-direction: column; gap: .45rem; font-weight: 600; color: #334155; }
      input, select { border: 1px solid #d7e1ef; border-radius: 12px; padding: .8rem 1rem; }
      .form-actions { display: flex; gap: .75rem; margin-top: 1rem; }
      .primary-btn, .secondary-btn, .actions button { border: none; border-radius: 10px; padding: .55rem .8rem; cursor: pointer; }
      .primary-btn { background: linear-gradient(135deg, #1d4ed8, #3b82f6); color: white; }
      .secondary-btn { background: #e2e8f0; color: #334155; }
      .table-wrap { overflow-x: auto; }
      table { width: 100%; min-width: 1200px; border-collapse: collapse; }
      th, td { border-bottom: 1px solid #e2e8f0; text-align: left; padding: .9rem .7rem; }
      th { color: #64748b; font-size: .8rem; text-transform: uppercase; letter-spacing: .06em; }
      .actions { display: flex; gap: .5rem; }
      .actions button { background: #eff6ff; color: #1d4ed8; }
      @media (max-width: 760px) { .toolbar { flex-direction: column; } .field-grid { grid-template-columns: 1fr; } }
    `,
  ],
})
export class TeacherManagementComponent {
  searchTerm = '';
  typeFilter = 'All';
  showForm = false;
  isEditing = false;
  editingIndex = -1;
  form = {
    id: '',
    fullName: '',
    email: '',
    phone: '',
    gender: 'Male',
    classes: '',
    subjects: '',
    type: 'Class Teacher',
    status: 'Active',
  };

  teachers = [
    { id: 'T-001', fullName: 'Asha Ali Mohamed', email: 'asha.ali@jangombe.ac.tz', phone: '+255 712 345 678', gender: 'Female', classes: 'Form 2A, Form 3B', subjects: 'Mathematics, Physics', type: 'Class & Subject Teacher', status: 'Active' },
    { id: 'T-002', fullName: 'Khamis Juma Mbezi', email: 'khamis.mbezi@jangombe.ac.tz', phone: '+255 713 222 333', gender: 'Male', classes: 'Form 1A, Form 2B', subjects: 'English', type: 'Class Teacher', status: 'Active' },
    { id: 'T-003', fullName: 'Fatma Abdallah Mroso', email: 'fatma.mroso@jangombe.ac.tz', phone: '+255 766 784 125', gender: 'Female', classes: 'Form 3A', subjects: 'Biology, Chemistry', type: 'Subject Teacher', status: 'Active' },
    { id: 'T-004', fullName: 'Juma Hassan Mneni', email: 'juma.mneni@jangombe.ac.tz', phone: '+255 765 555 111', gender: 'Male', classes: 'Form 4A', subjects: 'History', type: 'Class Teacher', status: 'On Leave' },
  ];

  get filteredTeachers() {
    return this.teachers.filter((teacher) => {
      const matchesSearch = teacher.fullName.toLowerCase().includes(this.searchTerm.toLowerCase()) || teacher.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesType = this.typeFilter === 'All' || teacher.type === this.typeFilter;
      return matchesSearch && matchesType;
    });
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
    this.form = {
      id: '',
      fullName: '',
      email: '',
      phone: '',
      gender: 'Male',
      classes: '',
      subjects: '',
      type: 'Class Teacher',
      status: 'Active',
    };
  }

  saveTeacher(): void {
    if (!this.form.fullName.trim() || !this.form.email.trim()) {
      return;
    }

    const payload = { ...this.form, fullName: this.form.fullName.trim(), email: this.form.email.trim() };

    if (this.isEditing && this.editingIndex >= 0) {
      this.teachers[this.editingIndex] = payload;
    } else {
      this.teachers.unshift(payload);
    }

    this.cancelForm();
    this.showForm = false;
  }

  editTeacher(teacher: typeof this.teachers[number], index: number): void {
    this.editingIndex = index;
    this.isEditing = true;
    this.form = { ...teacher };
    this.showForm = true;
  }

  deleteTeacher(index: number): void {
    this.teachers.splice(index, 1);
    if (this.editingIndex === index) {
      this.cancelForm();
    }
  }
}
