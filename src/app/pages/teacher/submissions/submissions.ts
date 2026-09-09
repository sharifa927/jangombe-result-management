import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StatusBadgeComponent } from '../../../components/status-badge/status-badge';

@Component({
  selector: 'app-teacher-submissions',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent],
  template: `
    <section class="page-shell">
      <div class="page-header">
        <div>
          <p class="eyebrow">Submission history</p>
          <h2>My Submissions</h2>
        </div>
      </div>

      <div class="card table-panel">
        <table>
          <thead>
            <tr>
              <th>Class</th>
              <th>Subject</th>
              <th>Term</th>
              <th>Academic Year</th>
              <th>Students</th>
              <th>Submitted Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let row of submissions">
              <td>{{ row.className }}</td>
              <td>{{ row.subject }}</td>
              <td>{{ row.term }}</td>
              <td>{{ row.year }}</td>
              <td>{{ row.students }}</td>
              <td>{{ row.date }}</td>
              <td><app-status-badge [status]="row.status"></app-status-badge></td>
              <td><button type="button" (click)="openSubmission(row)">View</button></td>
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
      .eyebrow { margin: 0; text-transform: uppercase; letter-spacing: .12em; font-size: .7rem; color: #64748b; }
      h2 { margin: .25rem 0 0; }
      .card { background: white; border: 1px solid rgba(148,163,184,.15); border-radius: 18px; box-shadow: 0 8px 22px rgba(15,23,42,.04); }
      table { width: 100%; border-collapse: collapse; }
      th, td { padding: .9rem .8rem; text-align: left; border-bottom: 1px solid #e2e8f0; }
      th { color: #64748b; font-size: .75rem; letter-spacing: .06em; text-transform: uppercase; }
      button { border: none; background: #eff6ff; color: #1d4ed8; border-radius: 10px; padding: .45rem .7rem; cursor: pointer; }
    `,
  ],
})
export class TeacherSubmissionsComponent {
  constructor(private readonly router: Router) {}

  submissions = [
    { className: 'Form 2A', subject: 'Mathematics', term: 'Term 1', year: '2026', students: 42, date: '2026-09-05', status: 'Submitted' },
    { className: 'Form 2A', subject: 'Physics', term: 'Term 1', year: '2026', students: 42, date: '2026-09-06', status: 'Accepted' },
    { className: 'Form 3B', subject: 'Computer Science', term: 'Term 1', year: '2026', students: 44, date: '2026-09-02', status: 'Draft' },
  ];

  openSubmission(row: typeof this.submissions[number]): void {
    this.router.navigateByUrl('/teacher/marks');
    console.log('Opened submission', row);
  }
}
