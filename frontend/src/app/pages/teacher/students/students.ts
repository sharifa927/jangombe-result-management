import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../../components/page-header/page-header';
import { ClassService, type ClassRecord } from '../../../services/class.service';
import { AssignmentService, type AssignmentRecord } from '../../../services/assignment.service';
import { StudentService } from '../../../services/student.service';

@Component({
  selector: 'app-teacher-students',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent],
  template: `
    <section class="page-shell">
      <app-page-header eyebrow="My Classes" title="My Students" [actionLabel]="hasClassTeacherAssignment ? 'Add Student' : ''" (action)="toggleAddForm()"></app-page-header>

      <p class="form-error" role="alert" *ngIf="studentErrorMessage">{{ studentErrorMessage }}</p>
      <p class="form-success" role="status" *ngIf="studentSuccessMessage">{{ studentSuccessMessage }}</p>

      <div class="stats-row">
        <div class="mini-card">
          <span>Total Students</span>
          <strong>{{ students.length }}</strong>
        </div>
        <div class="mini-card">
          <span>Active</span>
          <strong>{{ activeCount }}</strong>
        </div>
        <div class="mini-card">
          <span>Current Class</span>
          <strong>{{ currentClassName }}</strong>
        </div>
      </div>

      <div class="card form-panel" *ngIf="showForm">
        <h3>{{ isEditing ? 'Edit Student' : 'Add New Student' }}</h3>
        <div class="field-grid">
          <label><span>Admission No.</span><input type="text" [(ngModel)]="form.admission" required /></label>
          <label><span>First Name</span><input type="text" [(ngModel)]="form.firstName" required /></label>
          <label><span>Last Name</span><input type="text" [(ngModel)]="form.lastName" required /></label>
          <label><span>Gender</span><select [(ngModel)]="form.gender"><option>Female</option><option>Male</option></select></label>
          <label><span>Date of Birth</span><input type="date" [(ngModel)]="form.dob" /></label>
          <label><span>Class</span><select [(ngModel)]="form.classId" required><option value="">Select class</option><option *ngFor="let classRecord of classTeacherClasses" [value]="classRecord.id">{{ classRecord.name }}</option></select></label>
          <label><span>Status</span><select [(ngModel)]="form.status"><option>Active</option><option>Inactive</option></select></label>
        </div>
        <div class="form-actions">
          <button type="button" class="primary-btn" [disabled]="savingStudent" (click)="saveStudent()">{{ savingStudent ? 'Saving...' : isEditing ? 'Update Student' : 'Save Student' }}</button>
          <button type="button" class="secondary-btn" [disabled]="savingStudent" (click)="cancelForm()">Cancel</button>
        </div>
      </div>

      <ng-container *ngIf="!showForm">
        <div class="toolbar card">
          <input type="search" [(ngModel)]="searchTerm" placeholder="Search student..." />
          <select [(ngModel)]="classFilter">
            <option value="All Students">All Students</option>
            <option *ngFor="let classRecord of classes" [value]="classRecord.name">{{ classRecord.name }}</option>
          </select>
        </div>

        <div class="card table-panel">
          <div class="table-wrap">
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
                  <td class="actions" *ngIf="isClassTeacher(student.classId)"><button type="button" class="edit-btn" (click)="editStudent(student, i)">Edit</button><button type="button" class="danger-btn" (click)="deleteStudent(i)">Delete</button></td>
                  <td *ngIf="!isClassTeacher(student.classId)">Read only</td>
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
      .page-shell { display: flex; flex-direction: column; gap: 1.2rem; }
      .stats-row { display: grid; grid-template-columns: repeat(3, minmax(150px, 1fr)); gap: 1rem; }
      .mini-card { background: linear-gradient(125deg, #f2f8fc 0%, #e7f5ee 100%); border: 1px solid var(--teacher-border, #d6e6e3); border-radius: 12px; padding: 1rem 1.1rem; }
      .mini-card span { display: block; font-size: .74rem; color: #64748b; text-transform: uppercase; letter-spacing: .08em; }
      .mini-card strong { display: block; margin-top: .35rem; font-size: 1.6rem; }
      .card { background: linear-gradient(155deg, rgba(255,255,255,.99) 0%, rgba(241,248,246,.98) 100%); border-radius: 12px; border: 1px solid var(--teacher-border, #d6e6e3); box-shadow: 0 12px 30px rgba(21,85,115,.055); }
      .toolbar { display: flex; gap: .8rem; padding: 1rem; }
      .toolbar input, .toolbar select { flex: 1; border: 1px solid var(--teacher-border, #d6e6e3); border-radius: 8px; padding: .8rem 1rem; background: white; }
      .form-panel { padding: 1.2rem; }
      .field-grid { display: grid; grid-template-columns: repeat(2, minmax(180px, 1fr)); gap: 1rem; }
      label { display: flex; flex-direction: column; gap: .45rem; font-weight: 600; color: #334155; }
      input, select { border: 1px solid var(--teacher-border, #d6e6e3); border-radius: 8px; padding: .8rem 1rem; background: white; }
      input:focus, select:focus { outline: none; border-color: var(--teacher-green, #16856b); box-shadow: 0 0 0 3px rgba(22, 133, 107, .14); }
      .form-actions { display: flex; gap: .75rem; margin-top: 1rem; }
      .primary-btn, .secondary-btn, .actions button { border: none; border-radius: 10px; padding: .55rem .8rem; cursor: pointer; }
      .primary-btn { background: var(--teacher-action, linear-gradient(120deg, #21845f, #25856b)); color: white; }
      .secondary-btn { background: #e2e8f0; color: #334155; }
      .primary-btn:disabled, .secondary-btn:disabled { opacity: .65; cursor: wait; }
      .form-error, .form-success { margin: 0; padding: .75rem 1rem; border-radius: 8px; }
      .form-error { color: #b91c1c; background: #fef2f2; border: 1px solid #fecaca; }
      .form-success { color: #166534; background: #f0fdf4; border: 1px solid #bbf7d0; }
      .table-panel { padding: 0.4rem; }
      .table-wrap { overflow-x: auto; }
      table { width: 100%; border-collapse: collapse; min-width: 760px; }
      th, td { text-align: left; padding: .9rem .7rem; border-bottom: 1px solid #e2e8f0; }
      th { color: #64748b; font-size: .75rem; text-transform: uppercase; letter-spacing: .06em; }
      tbody tr:hover { background: rgba(224, 242, 235, .62); }
      .status-pill { display: inline-flex; padding: .35rem .7rem; background: #dcfce7; color: #166534; border-radius: 999px; font-size: .7rem; font-weight: 700; }
      .actions { display: flex; gap: .5rem; }
      .actions button { background: #e6f4ec; color: var(--teacher-green-deep, #1b6e5b); }
      .actions button:focus-visible, .primary-btn:focus-visible, .secondary-btn:focus-visible { outline: 3px solid rgba(22, 133, 107, .24); outline-offset: 2px; }
      @media (max-width: 760px) { .stats-row, .toolbar, .field-grid { grid-template-columns: 1fr; flex-direction: column; } .toolbar { display: flex; } }
    `,
  ],
})
export class TeacherStudentsComponent implements OnInit {
  searchTerm = '';
  classFilter = 'All Students';
  showForm = false;
  savingStudent = false;
  studentErrorMessage = '';
  studentSuccessMessage = '';
  isEditing = false;
  editingIndex = -1;
  form = {
    admission: '',
    firstName: '',
    lastName: '',
    gender: 'Female',
    dob: '',
    classId: '',
    status: 'Active',
  };

  classes: ClassRecord[] = [];
  assignments: AssignmentRecord[] = [];
  students: Array<{ id: string; admission: string; name: string; gender: string; dob: string; classId: string; className: string; status: string }> = [];

  constructor(
    private readonly studentService: StudentService,
    private readonly classService: ClassService,
    private readonly assignmentService: AssignmentService,
    private readonly route: ActivatedRoute,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.classService.getClasses().subscribe({
      next: (classes) => {
        this.classes = classes;
        this.changeDetectorRef.markForCheck();
        this.assignmentService.getMyAssignments().subscribe({
          next: (assignments) => {
            this.assignments = assignments;
            const requestedClassId = this.route.snapshot.queryParamMap.get('classId');
            const requestedClass = this.classes.find((item) => item.id.toString() === requestedClassId);
            if (requestedClass) this.classFilter = requestedClass.name;
            this.changeDetectorRef.markForCheck();
            this.loadStudents();
          },
          error: () => {
            this.assignments = [];
            this.changeDetectorRef.markForCheck();
          },
        });
      },
      error: () => {
        this.classes = [];
        this.changeDetectorRef.markForCheck();
      },
    });
  }

  get currentClassName(): string {
    return this.classes.find((item) => item.id.toString() === this.form.classId)?.name ?? 'All classes';
  }

  get classTeacherClasses(): ClassRecord[] {
    const classTeacherIds = new Set(this.assignments.filter((item) => item.classTeacher).map((item) => item.classEntity.id.toString()));
    return this.classes.filter((item) => classTeacherIds.has(item.id.toString()));
  }

  get hasClassTeacherAssignment(): boolean {
    return this.classTeacherClasses.length > 0;
  }

  isClassTeacher(classId: string): boolean {
    return this.assignments.some((item) => item.classTeacher && item.classEntity.id.toString() === classId.toString());
  }

  private loadStudents(): void {
    this.studentService.getStudents().subscribe({
      next: (students) => {
        this.students = students.map((student) => ({
          id: student.id,
          admission: student.admissionNumber,
          name: `${student.firstName} ${student.lastName}`.trim(),
          gender: student.gender,
          dob: student.dateOfBirth,
          classId: student.classId,
          className: this.classes.find((item) => item.id.toString() === student.classId)?.name ?? '',
          status: student.status,
        }));
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.students = [];
        this.changeDetectorRef.markForCheck();
      },
    });
  }

  get activeCount(): number {
    return this.students.filter((student) => student.status === 'Active').length;
  }

  get filteredStudents() {
    return this.students.filter((student) => {
      const matchesSearch = student.name.toLowerCase().includes(this.searchTerm.toLowerCase()) || student.admission.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesClass = this.classFilter === 'All Students' || student.className === this.classFilter;
      return matchesSearch && matchesClass;
    });
  }

  openAddForm(): void {
    if (!this.hasClassTeacherAssignment) return;
    this.studentErrorMessage = '';
    this.studentSuccessMessage = '';
    this.isEditing = false;
    this.editingIndex = -1;
    this.form = { admission: '', firstName: '', lastName: '', gender: 'Female', dob: '', classId: this.classTeacherClasses[0]?.id.toString() ?? '', status: 'Active' };
    this.showForm = true;
    this.changeDetectorRef.markForCheck();
  }

  toggleAddForm(): void {
    if (!this.hasClassTeacherAssignment) return;
    if (this.showForm) {
      this.cancelForm();
      return;
    }
    this.openAddForm();
  }

  cancelForm(): void {
    this.isEditing = false;
    this.editingIndex = -1;
    this.form = { admission: '', firstName: '', lastName: '', gender: 'Female', dob: '', classId: '', status: 'Active' };
    this.showForm = false;
  }

  saveStudent(): void {
    if (this.savingStudent) return;
    if (!this.form.firstName.trim() || !this.form.lastName.trim() || !this.form.admission.trim() || !this.form.classId) {
      this.studentErrorMessage = 'Enter an admission number and student name, then select a class.';
      this.changeDetectorRef.markForCheck();
      return;
    }

    const payload = {
      id: this.isEditing && this.editingIndex >= 0 ? this.students[this.editingIndex].id : '',
      admissionNumber: this.form.admission.trim(),
      firstName: this.form.firstName.trim(),
      lastName: this.form.lastName.trim(),
      gender: this.form.gender as 'Male' | 'Female',
      dateOfBirth: this.form.dob,
      classId: this.form.classId,
      status: this.form.status as 'Active' | 'Inactive',
    };

    const request = this.isEditing && this.editingIndex >= 0
      ? this.studentService.updateStudent(payload.id, payload)
      : this.studentService.addStudent(payload);
    const wasEditing = this.isEditing;
    this.savingStudent = true;
    this.studentErrorMessage = '';
    this.studentSuccessMessage = '';
    request.subscribe({
      next: () => {
        this.loadStudents();
        this.cancelForm();
        this.showForm = false;
        this.savingStudent = false;
        this.studentSuccessMessage = wasEditing ? 'Student details updated.' : 'Student added to your class.';
        this.changeDetectorRef.markForCheck();
      },
      error: (error: { error?: unknown; status?: number }) => {
        this.savingStudent = false;
        const serverMessage = typeof error.error === 'string' ? error.error : '';
        this.studentErrorMessage = serverMessage || (error.status === 403
          ? 'Your account is not authorized as the class teacher for this class. Ask the administrator to check your assignment.'
          : error.status === 400
            ? 'The student could not be saved. Check the admission number and required fields.'
            : error.status
              ? `Unable to save the student (HTTP ${error.status}).`
              : 'Could not connect to save the student. Your entries are still on this page.');
        this.changeDetectorRef.markForCheck();
      },
    });
  }

  editStudent(student: typeof this.students[number], index: number): void {
    if (!this.isClassTeacher(student.classId)) return;
    this.editingIndex = index;
    this.isEditing = true;
    const [firstName = '', ...lastNames] = student.name.split(' ');
    this.form = {
      admission: student.admission,
      firstName,
      lastName: lastNames.join(' '),
      gender: student.gender,
      dob: student.dob,
      classId: student.classId,
      status: student.status,
    };
    this.showForm = true;
  }

  deleteStudent(index: number): void {
    if (!this.isClassTeacher(this.students[index].classId)) return;
    this.studentService.deleteStudent(this.students[index].id).subscribe(() => this.loadStudents());
  }
}
