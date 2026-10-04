import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../../components/page-header/page-header';
import { ResultService } from '../../../services/result.service';
import { ClassService, type ClassRecord } from '../../../services/class.service';
import { AssignmentService, type AssignmentRecord } from '../../../services/assignment.service';
import { ACADEMIC_TERM_OPTIONS, ACADEMIC_YEAR_OPTIONS, formatAcademicTerm, normalizeAcademicTerm } from '../../../services/academic-period';
import * as XLSX from 'xlsx-js-style';

interface StudentResultRow {
  student: string;
  admissionNumber: string;
  total: number;
  average: number;
  overallGrade: string;
  position: number;
  subjects: Array<{ subjectId: number; name: string; marks: number; grade: string }>;
}

@Component({
  selector: 'app-admin-results',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent],
  template: `
    <section class="page-shell">
      <app-page-header eyebrow="Academic" title="Results"></app-page-header>

      <div class="toolbar card">
        <select [(ngModel)]="selectedClassId" (ngModelChange)="onClassChange()">
          <option value="">Select class</option>
          <option *ngFor="let classRecord of classes" [value]="classRecord.id">{{ classRecord.name }}</option>
        </select>
        <input type="text" list="results-year-options" [(ngModel)]="selectedYear" aria-label="Academic year" placeholder="2026/2027" />
        <datalist id="results-year-options"><option *ngFor="let year of academicYearOptions" [value]="year"></option></datalist>
        <input type="text" list="results-term-options" [(ngModel)]="selectedTerm" aria-label="Term" placeholder="Term 1" />
        <datalist id="results-term-options"><option *ngFor="let term of termOptions" [value]="term"></option></datalist>
        <select [(ngModel)]="selectedSubjectId" aria-label="Subject">
          <option value="all">All subjects</option>
          <option *ngFor="let subject of classSubjects" [value]="subject.id">{{ subject.name }}</option>
        </select>
        <button type="button" class="calculate-btn" [disabled]="calculating || !selectedClassId || !classSubjects.length || !selectedYear.trim() || !selectedTerm.trim()" (click)="calculateResults()">{{ calculating ? 'Calculating...' : 'Calculate results' }}</button>
      </div>

      <p class="status-message" *ngIf="selectedClassId && !classSubjects.length">No subjects have been assigned to this class yet.</p>
      <p class="status-message" *ngIf="calculationMessage">{{ calculationMessage }}</p>

      <div class="summary-grid">
        <div class="summary-card card">
          <span>Total Students</span>
          <strong>{{ visibleResults.length }}</strong>
        </div>
        <div class="summary-card card">
          <span>Average Class Mark</span>
          <strong>{{ averageClassMark }}</strong>
        </div>
        <div class="summary-card card">
          <span>Top Student</span>
          <strong>{{ topStudent }}</strong>
        </div>
      </div>

      <div class="card table-panel">
        <div class="table-heading">
          <div>
            <h3>{{ selectedClassName || 'Class results' }}</h3>
            <p>{{ selectedYear }}<span *ngIf="selectedTerm"> · {{ displayTerm(selectedTerm) }}</span></p>
          </div>
          <button type="button" class="export-btn" [disabled]="calculating || !studentResults.length" (click)="exportSpreadsheet()">Export spreadsheet</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Position</th>
              <th>Student</th>
              <th>Admission No.</th>
              <th *ngFor="let subjectName of subjectNames">{{ subjectName }}</th>
              <th>Total</th>
              <th>Average</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let row of visibleResults">
              <td>{{ row.position }}</td>
              <td>{{ row.student }}</td>
              <td>{{ row.admissionNumber }}</td>
              <td *ngFor="let subjectName of subjectNames">{{ getSubjectMarks(row, subjectName) }}</td>
              <td>{{ row.total }}</td>
              <td>{{ row.average.toFixed(1) }}</td>
              <td><span class="grade-pill">{{ row.overallGrade }}</span></td>
            </tr>
            <tr *ngIf="!calculating && visibleResults.length === 0">
              <td [attr.colspan]="subjectNames.length + 6" class="empty-state">No results match the selected class, subject, year, and term.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `,
  styles: [
    `
      .page-shell { display: flex; flex-direction: column; gap: 1.2rem; }
      .card { background: linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%); border: 1px solid rgba(148,163,184,.15); border-radius: 22px; box-shadow: 0 12px 30px rgba(15,23,42,.04); }
      .toolbar { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px,1fr)); gap: .8rem; padding: 1rem; }
      select { border: 1px solid #d7e1ef; border-radius: 12px; padding: .8rem 1rem; background: white; }
      input { min-width: 0; border: 1px solid #d7e1ef; border-radius: 12px; padding: .8rem 1rem; background: white; font: inherit; }
      .calculate-btn, .export-btn { border: 0; border-radius: 9px; padding: .75rem 1rem; background: var(--teacher-action, linear-gradient(120deg, #21845f, #25856b)); color: white; cursor: pointer; font-weight: 700; }
      .export-btn { border: 1px solid #cde4d8; background: #e6f4ec; color: #1b6e5b; }
      .calculate-btn:disabled, .export-btn:disabled { opacity: .6; cursor: wait; }
      .status-message { margin: 0; color: #475569; }
      .summary-grid { display: grid; grid-template-columns: repeat(3, minmax(150px,1fr)); gap: .8rem; }
      .summary-card { padding: 1rem; display: flex; flex-direction: column; gap: .4rem; }
      .summary-card span { color: #64748b; }
      .summary-card strong { font-size: 1.4rem; }
      .table-panel { padding: 1rem; overflow-x: auto; }
      .table-heading { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: .8rem; }
      .table-heading h3 { margin: 0; color: #172b4d; font-size: 1rem; }
      .table-heading p { margin: .25rem 0 0; color: #64748b; font-size: .8rem; }
      .empty-state { text-align: center; color: #64748b; padding: 1.5rem; }
      table { width: 100%; border-collapse: collapse; min-width: 780px; }
      th, td { text-align: left; padding: .85rem .7rem; border-bottom: 1px solid #e2e8f0; }
      th { color: #64748b; font-size: .75rem; letter-spacing: .06em; text-transform: uppercase; }
      tbody tr:hover { background: rgba(239,246,255,0.7); }
      .grade-pill { background: #dcfce7; color: #166534; border-radius: 999px; padding: .35rem .7rem; font-weight: 700; }
      @media (max-width: 760px) { .toolbar, .summary-grid { grid-template-columns: 1fr; } }
    `,
  ],
})
export class AdminResultsComponent implements OnInit {
  selectedYear = '';
  selectedTerm = '';
  selectedSubjectId = 'all';
  selectedClassId = '';
  readonly academicYearOptions = ACADEMIC_YEAR_OPTIONS;
  readonly termOptions = ACADEMIC_TERM_OPTIONS;
  studentResults: StudentResultRow[] = [];
  classes: ClassRecord[] = [];
  assignments: AssignmentRecord[] = [];
  classSubjects: Array<{ id: number; name: string }> = [];
  calculating = false;
  calculationMessage = '';

  constructor(
    private readonly resultService: ResultService,
    private readonly classService: ClassService,
    private readonly assignmentService: AssignmentService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.classService.getClasses().subscribe({
      next: (classes) => {
        this.classes = classes;
        if (classes.length) {
          this.selectedClassId = String(classes[0].id);
          this.selectedYear = classes[0].academicYear;
          this.loadClassSubjects();
        }
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.calculationMessage = 'Unable to load classes from the server.';
        this.changeDetectorRef.markForCheck();
      },
    });
    this.assignmentService.getAssignments().subscribe({
      next: (assignments) => {
        this.assignments = assignments;
        this.loadClassSubjects();
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.calculationMessage = 'Unable to load class subject assignments from the server.';
        this.changeDetectorRef.markForCheck();
      },
    });
  }

  onClassChange(): void {
    this.selectedYear = this.classes.find((item) => String(item.id) === this.selectedClassId)?.academicYear ?? '';
    this.selectedSubjectId = 'all';
    this.studentResults = [];
    this.calculationMessage = '';
    this.loadClassSubjects();
  }

  private loadClassSubjects(): void {
    const classId = Number(this.selectedClassId);
    if (!classId) {
      this.classSubjects = [];
      return;
    }
    const subjects = this.assignments
      .filter((assignment) => assignment.classEntity.id === classId)
      .map((assignment) => assignment.subject);
    this.classSubjects = [...new Map(subjects.map((subject) => [subject.id, { id: subject.id, name: subject.name }])).values()]
      .sort((left, right) => left.name.localeCompare(right.name));
  }

  get subjectNames(): string[] {
    return this.classSubjects
      .filter((subject) => this.selectedSubjectId === 'all' || String(subject.id) === this.selectedSubjectId)
      .map((subject) => subject.name);
  }

  get selectedClassName(): string {
    return this.classes.find((item) => String(item.id) === this.selectedClassId)?.name ?? '';
  }

  displayTerm(term: string): string {
    return formatAcademicTerm(term);
  }

  get visibleResults(): StudentResultRow[] {
    if (this.selectedSubjectId === 'all') return this.studentResults;
    return this.studentResults.flatMap((row) => {
      const subject = row.subjects.find((item) => String(item.subjectId) === this.selectedSubjectId);
      return subject ? [{
        ...row,
        total: subject.marks,
        average: subject.marks,
        overallGrade: subject.grade,
        subjects: [subject],
      }] : [];
    }).sort((left, right) => right.average - left.average || left.student.localeCompare(right.student))
      .map((row, index) => ({ ...row, position: index + 1 }));
  }

  calculateResults(): void {
    if (!this.selectedClassId || !this.selectedYear.trim() || !this.selectedTerm.trim()) return;
    const term = normalizeAcademicTerm(this.selectedTerm);
    if (!/^TERM_[1-2]$/.test(term)) {
      this.calculationMessage = 'Enter Term 1 or Term 2.';
      return;
    }
    this.calculating = true;
    this.calculationMessage = '';
    this.resultService.calculateResults(Number(this.selectedClassId), this.selectedYear.trim(), term).subscribe({
      next: (results) => {
        this.studentResults = results.map((result) => ({
          student: result.studentName,
          admissionNumber: result.admissionNumber,
          total: result.totalMarks,
          average: result.average,
          overallGrade: result.overallGrade,
          position: result.position,
          subjects: result.subjects.map((subject) => ({
            subjectId: subject.subjectId,
            name: subject.subjectName,
            marks: subject.marks,
            grade: subject.grade,
          })),
        }));
        this.calculationMessage = results.length ? '' : 'No approved marks are available for this class, year, and term.';
        this.calculating = false;
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.calculationMessage = 'Results could not be calculated. Check approved submissions and try again.';
        this.calculating = false;
        this.changeDetectorRef.markForCheck();
      },
    });
  }

  exportSpreadsheet(): void {
    const results = this.visibleResults;
    const subjects = this.subjectNames;
    if (!results.length || !subjects.length) return;
    const headers = [
      'Position',
      'Student',
      'Admission No.',
      ...subjects,
      'Total',
      'Average',
      'Grade',
    ];
    const subjectFilter = this.selectedSubjectId === 'all'
      ? 'All subjects'
      : this.classSubjects.find((subject) => String(subject.id) === this.selectedSubjectId)?.name ?? 'Selected subject';
    const sheetRows: Array<Array<string | number>> = [
      ['JANG’OMBE SCHOOL | RESULTS REPORT'],
      ['CLASS', this.selectedClassName, 'ACADEMIC YEAR', this.selectedYear, 'TERM', formatAcademicTerm(this.selectedTerm)],
      ['SUBJECT FILTER', subjectFilter, 'STUDENTS', results.length, 'CLASS AVERAGE', this.averageClassMark, 'TOP STUDENT', this.topStudent],
      [],
      [],
      headers,
      ...results.map((row) => [
        row.position,
        row.student,
        row.admissionNumber,
        ...subjects.map((subject) => this.getSubjectMarks(row, subject)),
        row.total,
        row.average,
        row.overallGrade,
      ]),
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(sheetRows);
    const lastColumn = headers.length - 1;
    const lastRow = sheetRows.length;
    worksheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: Math.max(lastColumn, 7) } }];
    worksheet['!cols'] = [
      { wch: 11 },
      { wch: 28 },
      { wch: 20 },
      ...subjects.map(() => ({ wch: 17 })),
      { wch: 14 },
      { wch: 13 },
      { wch: 12 },
    ];
    worksheet['!autofilter'] = { ref: `A6:${XLSX.utils.encode_col(lastColumn)}${lastRow}` };
    worksheet['!rows'] = [{ hpt: 30 }, { hpt: 24 }, { hpt: 24 }, { hpt: 8 }, { hpt: 8 }, { hpt: 26 }];

    const setStyle = (row: number, column: number, style: Record<string, unknown>) => {
      const address = XLSX.utils.encode_cell({ r: row, c: column });
      if (worksheet[address]) worksheet[address].s = style;
    };
    const titleStyle = {
      font: { name: 'Aptos Display', sz: 16, bold: true, color: { rgb: 'FFFFFF' } },
      fill: { patternType: 'solid', fgColor: { rgb: '173C78' } },
      alignment: { vertical: 'center', horizontal: 'left' },
    };
    const metadataLabelStyle = {
      font: { name: 'Aptos', sz: 9, bold: true, color: { rgb: '405878' } },
      fill: { patternType: 'solid', fgColor: { rgb: 'EAF1FC' } },
      alignment: { vertical: 'center' },
    };
    const metadataValueStyle = {
      font: { name: 'Aptos', sz: 10, bold: true, color: { rgb: '172B4D' } },
      fill: { patternType: 'solid', fgColor: { rgb: 'F6F9FE' } },
      alignment: { vertical: 'center' },
    };
    const headerStyle = {
      font: { name: 'Aptos', sz: 10, bold: true, color: { rgb: 'FFFFFF' } },
      fill: { patternType: 'solid', fgColor: { rgb: '2459B8' } },
      alignment: { vertical: 'center', horizontal: 'center', wrapText: true },
      border: { bottom: { style: 'medium', color: { rgb: '173C78' } } },
    };
    const border = { bottom: { style: 'thin', color: { rgb: 'D9E2F0' } } };

    for (let column = 0; column <= Math.max(lastColumn, 7); column++) setStyle(0, column, titleStyle);
    for (const [row, labelColumns] of [[1, [0, 2, 4]], [2, [0, 2, 4, 6]]] as const) {
      for (const column of labelColumns) setStyle(row, column, metadataLabelStyle);
      for (let column = 1; column <= 7; column += 2) setStyle(row, column, metadataValueStyle);
    }
    for (let column = 0; column <= lastColumn; column++) setStyle(5, column, headerStyle);
    for (let row = 6; row < sheetRows.length; row++) {
      for (let column = 0; column <= lastColumn; column++) {
        setStyle(row, column, {
          font: { name: 'Aptos', sz: 10, color: { rgb: '23364D' } },
          fill: { patternType: 'solid', fgColor: { rgb: row % 2 === 0 ? 'F4F7FC' : 'FFFFFF' } },
          alignment: { vertical: 'center' },
          border,
        });
      }
      for (let column = 3; column < 3 + subjects.length + 2; column++) {
        const address = XLSX.utils.encode_cell({ r: row, c: column });
        if (worksheet[address] && typeof worksheet[address].v === 'number') worksheet[address].z = '0.00';
      }
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Class Results');
    const content = XLSX.write(workbook, { bookType: 'xlsx', type: 'array', cellStyles: true });
    const blob = new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const className = this.selectedClassName.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'class';
    const year = this.selectedYear.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'year';
    const term = formatAcademicTerm(this.selectedTerm).replace(/\s+/g, '-');
    const subjectName = this.selectedSubjectId === 'all' ? 'all-subjects' : subjectFilter.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '');
    link.href = url;
    link.download = `results-${className}-${year}-${term}-${subjectName || 'subject'}.xlsx`;
    link.click();
    URL.revokeObjectURL(url);
  }

  get averageClassMark(): string {
    const total = this.visibleResults.reduce((sum, row) => sum + row.average, 0);
    return (total / (this.visibleResults.length || 1)).toFixed(1);
  }

  get topStudent(): string {
    return this.visibleResults[0]?.student ?? 'N/A';
  }

  getSubjectMarks(row: StudentResultRow, subjectName: string): number | string {
    return row.subjects.find((subject) => subject.name === subjectName)?.marks ?? '—';
  }
}
