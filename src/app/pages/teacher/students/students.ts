import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../../components/page-header/page-header';

@Component({
  selector: 'app-teacher-students',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent],
  template: `
    <section class="page-shell">
      <app-page-header eyebrow="Class Teacher" title="My Students" actionLabel="Add Student" (action)="toggleAddForm()"></app-page-header>

      <div class="card form-panel" *ngIf="showForm">
        <h3>{{ isEditing ? 'Edit Student' : 'Add New Student' }}</h3>
        <div class="field-grid">
          <label><span>Student ID</span><input type="text" [(ngModel)]="form.id" /></label>
          <label><span>Admission No.</span><input type="text" [(ngModel)]="form.admission" /></label>
          <label><span>Student Name</span><input type="text" [(ngModel)]="form.name" /></label>
          <label><span>Gender</span><select [(ngModel)]="form.gender"><option>Female</option><option>Male</option></select></label>
          <label><span>Date of Birth</span><input type="date" [(ngModel)]="form.dob" /></label>
          <label><span>Class</span><select [(ngModel)]="form.className"><option>Form 2A</option><option>Form 3B</option><option>Form 1A</option></select></label>
          <label><span>Status</span><select [(ngModel)]="form.status"><option>Active</option><option>Transferred</option><option>Graduated</option></select></label>
        </div>
        <div class="form-actions">
          <button type="button" class="primary-btn" (click)="saveStudent()">{{ isEditing ? 'Update Student' : 'Save Student' }}</button>
          <button type="button" class="secondary-btn" (click)="cancelForm()">Cancel</button>
        </div>
      </div>

      <div class="toolbar card">
        <input type="search" [(ngModel)]="searchTerm" placeholder="Search student..." />
        <select [(ngModel)]="classFilter">
          <option value="All Students">All Students</option>
          <option value="Form 2A">Form 2A</option>
          <option value="Form 3B">Form 3B</option>
          <option value="Form 1A">Form 1A</option>
        </select>
      </div>

      <div class="card table-panel">
        <table>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Admission No.</th>
              <th>Student Name</th>
              <th>Gender</th>
              <th>Date of Birth</th>
              <th>Class</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let student of filteredStudents; let i = index">
              <td>{{ student.id }}</td>
              <td>{{ student.admission }}</td>
              <td>{{ student.name }}</td>
              <td>{{ student.gender }}</td>
              <td>{{ student.dob }}</td>
              <td>{{ student.className }}</td>
              <td><span class="status-pill">{{ student.status }}</span></td>
              <td class="actions"><button type="button" (click)="editStudent(student, i)">Edit</button><button type="button" (click)="deleteStudent(i)">Delete</button></td>
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
      .toolbar { display: flex; gap: .8rem; padding: 1rem; }
      .toolbar input, .toolbar select { flex: 1; border: 1px solid #d7e1ef; border-radius: 12px; padding: .8rem 1rem; }
      .form-panel { padding: 1.2rem; }
      .field-grid { display: grid; grid-template-columns: repeat(2, minmax(180px, 1fr)); gap: 1rem; }
      label { display: flex; flex-direction: column; gap: .45rem; font-weight: 600; color: #334155; }
      input, select { border: 1px solid #d7e1ef; border-radius: 12px; padding: .8rem 1rem; }
      .form-actions { display: flex; gap: .75rem; margin-top: 1rem; }
      .primary-btn, .secondary-btn, .actions button { border: none; border-radius: 10px; padding: .55rem .8rem; cursor: pointer; }
      .primary-btn { background: linear-gradient(135deg, #1d4ed8, #3b82f6); color: white; }
      .secondary-btn { background: #e2e8f0; color: #334155; }
      table { width: 100%; border-collapse: collapse; }
      th, td { text-align: left; padding: .9rem .7rem; border-bottom: 1px solid #e2e8f0; }
      th { color: #64748b; font-size: .75rem; text-transform: uppercase; letter-spacing: .06em; }
      .status-pill { display: inline-flex; padding: .35rem .7rem; background: #dcfce7; color: #166534; border-radius: 999px; font-size: .7rem; font-weight: 700; }
      .actions { display: flex; gap: .5rem; }
      .actions button { background: #eff6ff; color: #1d4ed8; }
      @media (max-width: 760px) { .toolbar { flex-direction: column; } .field-grid { grid-template-columns: 1fr; } }
    `,
  ],
})
export class TeacherStudentsComponent {
  searchTerm = '';
  classFilter = 'All Students';
  showForm = false;
  isEditing = false;
  editingIndex = -1;
  form = {
    id: '',
    admission: '',
    name: '',
    gender: 'Female',
    dob: '',
    className: 'Form 2A',
    status: 'Active',
  };

  students = [
    { id: 'STD-01', admission: 'JG001', name: 'Amina Ali Hassan', gender: 'Female', dob: '2011-04-12', className: 'Form 2A', status: 'Active' },
    { id: 'STD-02', admission: 'JG002', name: 'Juma Omar Kibwana', gender: 'Male', dob: '2010-08-28', className: 'Form 2A', status: 'Active' },
    { id: 'STD-03', admission: 'JG003', name: 'Fatma Said Mselem', gender: 'Female', dob: '2011-11-20', className: 'Form 2A', status: 'Active' },
    { id: 'STD-04', admission: 'JG004', name: 'Mohamed Abdallah Kisusi', gender: 'Male', dob: '2010-06-26', className: 'Form 2A', status: 'Active' },
  ];

  get filteredStudents() {
    return this.students.filter((student) => {
      const matchesSearch = student.name.toLowerCase().includes(this.searchTerm.toLowerCase()) || student.admission.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesClass = this.classFilter === 'All Students' || student.className === this.classFilter;
      return matchesSearch && matchesClass;
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
    this.form = { id: '', admission: '', name: '', gender: 'Female', dob: '', className: 'Form 2A', status: 'Active' };
  }

  saveStudent(): void {
    if (!this.form.name.trim() || !this.form.admission.trim()) {
      return;
    }

    const payload = { ...this.form, name: this.form.name.trim(), admission: this.form.admission.trim() };

    if (this.isEditing && this.editingIndex >= 0) {
      this.students[this.editingIndex] = payload;
    } else {
      this.students.unshift(payload);
    }

    this.cancelForm();
    this.showForm = false;
  }

  editStudent(student: typeof this.students[number], index: number): void {
    this.editingIndex = index;
    this.isEditing = true;
    this.form = { ...student };
    this.showForm = true;
  }

  deleteStudent(index: number): void {
    this.students.splice(index, 1);
    if (this.editingIndex === index) {
      this.cancelForm();
    }
  }
}
