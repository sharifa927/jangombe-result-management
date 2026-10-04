import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StatusBadgeComponent } from '../../../components/status-badge/status-badge';
import { MarkService, type TeacherSubmissionRow } from '../../../services/mark.service';
import { formatAcademicTerm } from '../../../services/academic-period';

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

      <div class="summary-row">
        <div class="mini-card">
          <span>Total entries</span>
          <strong>{{ submissions.length }}</strong>
        </div>
        <div class="mini-card">
          <span>Approved</span>
          <strong>{{ approvedCount }}</strong>
        </div>
      </div>

      <p class="state-message" *ngIf="loading">Loading submissions from the school database...</p>
      <p class="error-message" *ngIf="errorMessage">{{ errorMessage }}</p>

      <div class="card table-panel">
        <div class="table-wrap">
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
                <th>Admin Review Note</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of submissions">
                <td>{{ row.className }}</td>
                <td>{{ row.subject }}</td>
                <td>{{ formatTerm(row.term) }}</td>
                <td>{{ row.year }}</td>
                <td>{{ row.students }}</td>
                <td>{{ row.date }}</td>
                <td><app-status-badge [status]="row.status"></app-status-badge></td>
                <td class="review-note">{{ row.rejectionReason || 'No review note' }}</td>
                <td><button type="button" class="primary-action" (click)="openSubmission(row)">Review / edit marks</button></td>
              </tr>
              <tr *ngIf="!loading && !errorMessage && submissions.length === 0">
                <td colspan="9" class="empty-state">No submissions have been recorded for your account.</td>
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
      .page-header { margin-bottom: .2rem; }
      .eyebrow { margin: 0; text-transform: uppercase; letter-spacing: .12em; font-size: .7rem; color: #64748b; }
      h2 { margin: .25rem 0 0; font-size: clamp(1.5rem, 2vw, 2rem); }
      .summary-row { display: grid; grid-template-columns: repeat(2, minmax(160px, 1fr)); gap: 1rem; }
      .mini-card { background: linear-gradient(125deg, #f2f8fc 0%, #e7f5ee 100%); border: 1px solid var(--teacher-border, #d6e6e3); border-radius: 12px; padding: 1rem 1.1rem; }
      .mini-card span { display: block; font-size: .74rem; color: #64748b; text-transform: uppercase; letter-spacing: .08em; }
      .mini-card strong { display: block; margin-top: .35rem; font-size: 1.6rem; }
      .card { background: linear-gradient(155deg, rgba(255,255,255,.99) 0%, rgba(241,248,246,.98) 100%); border: 1px solid var(--teacher-border, #d6e6e3); border-radius: 12px; box-shadow: 0 12px 30px rgba(21,85,115,.055); }
      .table-panel { padding: 0.4rem; }
      .state-message, .error-message { margin: 0; padding: .85rem 1rem; border: 1px solid var(--teacher-border, #d6e6e3); background: linear-gradient(110deg, #edf5fa, #eef7f2); }
      .error-message { color: #b91c1c; border-color: #fecaca; background: #fef2f2; }
      .empty-state { text-align: center; color: #64748b; padding: 2rem; }
      .table-wrap { overflow-x: auto; }
      table { width: 100%; border-collapse: collapse; min-width: 980px; }
      th, td { padding: .9rem .8rem; text-align: left; border-bottom: 1px solid #e2e8f0; }
      th { color: #64748b; font-size: .75rem; letter-spacing: .06em; text-transform: uppercase; }
      tbody tr:hover { background: rgba(224, 242, 235, .62); }
      .review-note { max-width: 320px; white-space: normal; }
      button { border: none; background: var(--teacher-action, linear-gradient(120deg, #21845f, #25856b)); color: #fff; border-radius: 8px; padding: .45rem .7rem; cursor: pointer; font-weight: 700; }
      button:hover { filter: brightness(.95); }
      button:focus-visible { outline: 3px solid rgba(22, 133, 107, .24); outline-offset: 2px; }
      @media (max-width: 760px) { .summary-row { grid-template-columns: 1fr; } }
    `,
  ],
})
export class TeacherSubmissionsComponent implements OnInit {
  submissions: TeacherSubmissionRow[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    private readonly router: Router,
    private readonly markService: MarkService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.markService.getMySubmissions().subscribe({
      next: (submissions) => {
        this.submissions = submissions;
        this.loading = false;
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Unable to load your submissions from the server.';
        this.changeDetectorRef.markForCheck();
      },
    });
  }

  get approvedCount(): number {
    return this.submissions.filter((row) => row.status === 'Accepted').length;
  }

  formatTerm(term: string): string {
    return formatAcademicTerm(term);
  }

  openSubmission(row: TeacherSubmissionRow): void {
    this.router.navigate(['/teacher/marks'], {
      queryParams: {
        classId: row.classId,
        subjectId: row.subjectId,
        academicYear: row.year,
        term: row.term,
      },
    });
  }
}
