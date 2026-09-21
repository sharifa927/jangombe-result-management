import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ResultService } from '../../../services/result.service';
import { StudentService } from '../../../services/student.service';

interface StudentResultRow {
  student: string;
  total: number;
  average: number;
  overallGrade: string;
  position: number;
  subjects: Array<{ name: string; marks: number; grade: string }>;
}

@Component({
  selector: 'app-admin-results',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="page-shell">
      <div class="page-header">
        <div>
          <p class="eyebrow">Academic</p>
          <h2>Results</h2>
        </div>
      </div>

      <div class="toolbar card">
        <select [(ngModel)]="selectedYear" (ngModelChange)="loadResults()">
          <option value="2026">Academic Year: 2026</option>
          <option value="2025">Academic Year: 2025</option>
        </select>
        <select [(ngModel)]="selectedTerm" (ngModelChange)="loadResults()">
          <option value="Term 1">Term: Term 1</option>
          <option value="Term 2">Term: Term 2</option>
        </select>
        <select [(ngModel)]="selectedClass" (ngModelChange)="loadResults()">
          <option value="Form 2A">Class: Form 2A</option>
          <option value="Form 2B">Class: Form 2B</option>
          <option value="Form 3A">Class: Form 3A</option>
        </select>
      </div>

      <div class="summary-grid">
        <div class="summary-card card">
          <span>Total Students</span>
          <strong>{{ studentResults.length }}</strong>
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
        <table>
          <thead>
            <tr>
              <th>Position</th>
              <th>Student</th>
              <th>Mathematics</th>
              <th>English</th>
              <th>Physics</th>
              <th>Chemistry</th>
              <th>Total</th>
              <th>Average</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let row of studentResults">
              <td>{{ row.position }}</td>
              <td>{{ row.student }}</td>
              <td>{{ getSubjectMarks(row, 'Mathematics') }}</td>
              <td>{{ getSubjectMarks(row, 'English') }}</td>
              <td>{{ getSubjectMarks(row, 'Physics') }}</td>
              <td>{{ getSubjectMarks(row, 'Chemistry') }}</td>
              <td>{{ row.total }}</td>
              <td>{{ row.average.toFixed(1) }}</td>
              <td><span class="grade-pill">{{ row.overallGrade }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `,
  styles: [
    `
      .page-shell { display: flex; flex-direction: column; gap: 1.2rem; }
      .page-header { margin-bottom: .4rem; }
      .eyebrow { margin: 0; font-size: .72rem; text-transform: uppercase; letter-spacing: .12em; color: #64748b; }
      h2 { margin: .25rem 0 0; font-size: clamp(1.5rem, 2vw, 2rem); }
      .card { background: linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%); border: 1px solid rgba(148,163,184,.15); border-radius: 22px; box-shadow: 0 12px 30px rgba(15,23,42,.04); }
      .toolbar { display: grid; grid-template-columns: repeat(3, minmax(150px,1fr)); gap: .8rem; padding: 1rem; }
      select { border: 1px solid #d7e1ef; border-radius: 12px; padding: .8rem 1rem; background: white; }
      .summary-grid { display: grid; grid-template-columns: repeat(3, minmax(150px,1fr)); gap: .8rem; }
      .summary-card { padding: 1rem; display: flex; flex-direction: column; gap: .4rem; }
      .summary-card span { color: #64748b; }
      .summary-card strong { font-size: 1.4rem; }
      .table-panel { padding: 1rem; overflow-x: auto; }
      table { width: 100%; border-collapse: collapse; min-width: 780px; }
      th, td { text-align: left; padding: .85rem .7rem; border-bottom: 1px solid #e2e8f0; }
      th { color: #64748b; font-size: .75rem; letter-spacing: .06em; text-transform: uppercase; }
      tbody tr:hover { background: rgba(239,246,255,0.7); }
      .grade-pill { background: #dcfce7; color: #166534; border-radius: 999px; padding: .35rem .7rem; font-weight: 700; }
      @media (max-width: 760px) { .toolbar, .summary-grid { grid-template-columns: 1fr; } }
    `,
  ],
})
export class AdminResultsComponent {
  selectedYear = '2026';
  selectedTerm = 'Term 1';
  selectedClass = 'Form 2A';
  studentResults: StudentResultRow[] = [];

  constructor(
    private readonly resultService: ResultService,
    private readonly studentService: StudentService,
  ) {
    this.loadResults();
  }

  private classIdByName(name: string): string {
    const classMap: Record<string, string> = {
      'Form 2A': 'class-2a',
      'Form 2B': 'class-2b',
      'Form 3A': 'class-3a',
      'Form 1A': 'class-1a',
    };
    return classMap[name] ?? 'class-2a';
  }

  loadResults(): void {
    this.studentService.getStudents().subscribe((students) => {
      this.resultService.getResults().subscribe((results) => {
        const selectedClassId = this.classIdByName(this.selectedClass);
        const classStudents = students.filter((student) => student.classId === selectedClassId);

        const rows = results
          .filter((result) => result.academicYear === this.selectedYear && result.term === this.selectedTerm && result.classId === selectedClassId)
          .map((result) => {
            const student = classStudents.find((entry) => entry.id === result.studentId);
            const subjects = result.subjectResults.map((subject) => ({
              name: subject.subjectName,
              marks: subject.marks,
              grade: subject.grade,
            }));

            return {
              student: student ? `${student.firstName} ${student.lastName}` : 'Unknown Student',
              total: result.totalMarks,
              average: result.average,
              overallGrade: result.overallGrade,
              position: result.position ?? 0,
              subjects,
            };
          })
          .sort((a, b) => b.total - a.total);

        this.studentResults = rows.map((row, index) => ({ ...row, position: index + 1 }));
      });
    });
  }

  get averageClassMark(): string {
    const total = this.studentResults.reduce((sum, row) => sum + row.average, 0);
    return (total / (this.studentResults.length || 1)).toFixed(1);
  }

  get topStudent(): string {
    return this.studentResults[0]?.student ?? 'N/A';
  }

  getSubjectMarks(row: StudentResultRow, subjectName: string): number {
    return row.subjects.find((subject) => subject.name === subjectName)?.marks ?? 0;
  }
}
