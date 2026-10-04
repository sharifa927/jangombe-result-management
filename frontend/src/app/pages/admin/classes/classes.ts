import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../../components/page-header/page-header';
import { StatusBadgeComponent } from '../../../components/status-badge/status-badge';
import { ClassService, type ClassRecord } from '../../../services/class.service';
import { ACADEMIC_YEAR_OPTIONS } from '../../../services/academic-period';

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
            <input type="text" [(ngModel)]="form.name" placeholder="Enter class name" />
          </label>
          <label>
            <span>Academic Year</span>
            <input type="text" list="admin-year-options" [(ngModel)]="form.academicYear" placeholder="2026/2027" />
            <datalist id="admin-year-options"><option *ngFor="let year of academicYearOptions" [value]="year"></option></datalist>
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

      <ng-container *ngIf="!showForm">
        <div class="card search-panel">
          <input type="search" [(ngModel)]="searchTerm" placeholder="Search classes..." />
        </div>

        <div class="card table-panel">
          <table>
            <thead>
              <tr>
                <th>Class Name</th>
                <th>Academic Year</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of filteredClasses">
                <td>{{ item.name }}</td>
                <td>{{ item.academicYear }}</td>
                <td><app-status-badge [status]="item.status"></app-status-badge></td>
                <td class="actions"><button type="button" class="edit-btn" (click)="editClass(item)">Edit</button><button type="button" class="danger-btn" (click)="deleteClass(item)">Delete</button></td>
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
      .card { background: linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%); border-radius: 22px; border: 1px solid rgba(148,163,184,.15); box-shadow: 0 12px 30px rgba(15,23,42,.04); }
      .search-panel { padding: 1rem; }
      .search-panel input { width: 100%; border: 1px solid #d7e1ef; border-radius: 12px; padding: .8rem 1rem; background: white; }
      .form-panel { padding: 1.2rem; }
      .field-grid { display: grid; grid-template-columns: repeat(2, minmax(180px, 1fr)); gap: 1rem; }
      label { display: flex; flex-direction: column; gap: .45rem; font-weight: 600; color: #334155; }
      input, select { border: 1px solid #d7e1ef; border-radius: 12px; padding: .8rem 1rem; background: white; }
      .form-actions { display: flex; gap: .75rem; margin-top: 1rem; }
      .primary-btn, .secondary-btn, .actions button { border: none; border-radius: 10px; padding: .55rem .8rem; cursor: pointer; }
      .primary-btn { background: var(--teacher-action, linear-gradient(120deg, #21845f, #25856b)); color: white; }
      .secondary-btn { background: #e2e8f0; color: #334155; }
      table { width: 100%; border-collapse: collapse; }
      th, td { text-align: left; padding: .9rem .8rem; border-bottom: 1px solid #e2e8f0; }
      th { color: #64748b; text-transform: uppercase; letter-spacing: .06em; font-size: .75rem; }
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
export class ClassManagementComponent implements OnInit {
  searchTerm = '';
  showForm = false;
  isEditing = false;
  editingId?: number;
  form = { name: '', academicYear: '', status: 'ACTIVE' };
  readonly academicYearOptions = ACADEMIC_YEAR_OPTIONS;
  classes: ClassRecord[] = [];

  constructor(
    private readonly classService: ClassService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadClasses();
  }

  private loadClasses(): void {
    this.classService.getClasses().subscribe({
      next: (classes) => {
        this.classes = classes;
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.classes = [];
        this.changeDetectorRef.markForCheck();
      },
    });
  }

  get filteredClasses() {
    return this.classes.filter((item) =>
      item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.academicYear.toLowerCase().includes(this.searchTerm.toLowerCase()),
    );
  }

  openAddForm(): void {
    this.isEditing = false;
    this.editingId = undefined;
    this.form = { name: '', academicYear: '', status: 'ACTIVE' };
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
    this.form = { name: '', academicYear: '', status: 'ACTIVE' };
    this.showForm = false;
  }

  saveClass(): void {
    if (!this.form.name.trim()) {
      return;
    }

    const payload = {
      name: this.form.name.trim(),
      academicYear: this.form.academicYear.trim(),
      status: this.form.status.toUpperCase(),
    };

    const request = this.editingId !== undefined
      ? this.classService.updateClass(this.editingId, payload)
      : this.classService.addClass(payload);
    request.subscribe({
      next: () => {
        this.loadClasses();
        this.cancelForm();
        this.showForm = false;
        this.changeDetectorRef.markForCheck();
      },
    });
  }

  editClass(item: ClassRecord): void {
    this.editingId = item.id;
    this.isEditing = true;
    this.form = { name: item.name, academicYear: item.academicYear, status: item.status.toUpperCase() };
    this.showForm = true;
  }

  deleteClass(item: ClassRecord): void {
    this.classService.deleteClass(item.id).subscribe(() => {
      this.loadClasses();
      this.changeDetectorRef.markForCheck();
    });
  }
}
