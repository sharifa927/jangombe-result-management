import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../../components/page-header/page-header';

@Component({
  selector: 'app-assignment-management',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent],
  template: `
    <section class="page-shell">
      <app-page-header eyebrow="Teacher Allocation" title="Teacher Assignment" actionLabel="Add Assignment" (action)="toggleAddForm()"></app-page-header>

      <div class="assignment-grid">
        <div class="card form-panel" *ngIf="showForm">
          <h3>{{ isEditing ? 'Edit Assignment' : 'Assign Teacher' }}</h3>
          <div class="field-grid">
            <label>
              <span>Teacher</span>
              <select [(ngModel)]="form.teacher">
                <option value="Asha Ali">Asha Ali</option>
                <option value="Khamis Mbezi">Khamis Mbezi</option>
                <option value="Fatma Mroso">Fatma Mroso</option>
                <option value="Juma Mneni">Juma Mneni</option>
              </select>
            </label>
            <label>
              <span>Class</span>
              <select [(ngModel)]="form.className">
                <option value="Form 1A">Form 1A</option>
                <option value="Form 2A">Form 2A</option>
                <option value="Form 3A">Form 3A</option>
                <option value="Form 4A">Form 4A</option>
              </select>
            </label>
            <label>
              <span>Subject</span>
              <select [(ngModel)]="form.subjects" multiple size="4">
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="English">English</option>
                <option value="Biology">Biology</option>
                <option value="Chemistry">Chemistry</option>
              </select>
            </label>
          </div>
          <div class="form-actions">
            <button type="button" class="primary-btn" (click)="saveAssignment()">{{ isEditing ? 'Update Assignment' : 'Save Assignment' }}</button>
            <button type="button" class="secondary-btn" (click)="cancelForm()">Cancel</button>
          </div>
        </div>

        <div class="card list-panel">
          <h3>Current Assignments</h3>
          <div class="assignment-list" *ngFor="let item of assignments; let i = index">
            <div class="assignment-item">
              <strong>{{ item.teacher }}</strong>
              <span>{{ item.className }}</span>
              <small>{{ item.subjects }}</small>
              <div class="item-actions">
                <button type="button" (click)="editAssignment(item, i)">Edit</button>
                <button type="button" class="danger-btn" (click)="deleteAssignment(i)">Remove</button>
              </div>
            </div>
          </div>
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
      .primary-btn { background: linear-gradient(135deg, #1d4ed8, #3b82f6); color: white; }
      .secondary-btn { background: #e2e8f0; color: #334155; }
      .assignment-list { display: flex; flex-direction: column; gap: .8rem; }
      .assignment-item { border: 1px solid #e2e8f0; border-radius: 14px; padding: .9rem; display: flex; flex-direction: column; gap: .2rem; background: rgba(248,250,252,0.7); }
      .item-actions { display: flex; gap: .5rem; margin-top: .5rem; }
      .item-actions button { background: #eff6ff; color: #1d4ed8; }
      @media (max-width: 860px) { .assignment-grid { grid-template-columns: 1fr; } }
    `,
  ],
})
export class AssignmentManagementComponent {
  showForm = false;
  isEditing = false;
  editingIndex = -1;
  form = { teacher: 'Asha Ali', className: 'Form 2A', subjects: ['Mathematics'] as string[] };

  assignments = [
    { teacher: 'Asha Ali', className: 'Form 2A', subjects: 'Mathematics, Physics' },
    { teacher: 'Khamis Mbezi', className: 'Form 1A', subjects: 'English' },
    { teacher: 'Fatma Mroso', className: 'Form 3A', subjects: 'Biology, Chemistry' },
  ];

  toggleAddForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.cancelForm();
    }
  }

  cancelForm(): void {
    this.isEditing = false;
    this.editingIndex = -1;
    this.form = { teacher: 'Asha Ali', className: 'Form 2A', subjects: ['Mathematics'] };
  }

  saveAssignment(): void {
    const payload = {
      teacher: this.form.teacher,
      className: this.form.className,
      subjects: Array.isArray(this.form.subjects) ? this.form.subjects.join(', ') : this.form.subjects,
    };

    if (this.isEditing && this.editingIndex >= 0) {
      this.assignments[this.editingIndex] = payload;
    } else {
      this.assignments.unshift(payload);
    }

    this.cancelForm();
    this.showForm = false;
  }

  editAssignment(item: typeof this.assignments[number], index: number): void {
    this.editingIndex = index;
    this.isEditing = true;
    this.form = {
      teacher: item.teacher,
      className: item.className,
      subjects: item.subjects.split(', ').map((s) => s.trim()),
    };
    this.showForm = true;
  }

  deleteAssignment(index: number): void {
    this.assignments.splice(index, 1);
    if (this.editingIndex === index) {
      this.cancelForm();
    }
  }
}
