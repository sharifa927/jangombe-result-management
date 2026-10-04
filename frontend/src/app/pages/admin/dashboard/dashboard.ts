import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';
import { DashboardCardComponent } from '../../../components/dashboard-card/dashboard-card';
import { StatusBadgeComponent } from '../../../components/status-badge/status-badge';
import { ClassService } from '../../../services/class.service';
import { ResultService } from '../../../services/result.service';
import { SubjectService } from '../../../services/subject.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, DashboardCardComponent, StatusBadgeComponent],
  template: `
    <section class="dashboard-shell">
      <div class="stats-grid">
        <app-dashboard-card label="Total Teachers" [value]="stats.totalTeachers.toString()" icon="👩‍🏫" tone="info"></app-dashboard-card>
        <app-dashboard-card label="Total Students" [value]="stats.totalStudents.toString()" icon="🎓" tone="success"></app-dashboard-card>
        <app-dashboard-card label="Total Classes" [value]="stats.totalClasses.toString()" icon="🏫" tone="warning"></app-dashboard-card>
        <app-dashboard-card label="Total Subjects" [value]="stats.totalSubjects.toString()" icon="📚" tone="info"></app-dashboard-card>
        <app-dashboard-card label="Pending Mark Submissions" [value]="stats.pendingSubmissions.toString()" icon="📝" tone="warning"></app-dashboard-card>
        <app-dashboard-card label="Completed Results" [value]="stats.completedResults.toString()" icon="✅" tone="success"></app-dashboard-card>
      </div>
      <p class="dashboard-error" role="alert" *ngIf="dashboardError">{{ dashboardError }}</p>

      <div class="content-grid">
        <div class="panel quick-actions-panel">
          <div class="panel-header">
            <div class="header-copy">
              <span class="eyebrow">Admin hub</span>
              <h3>Quick Actions</h3>
            </div>
            <button type="button" class="ghost-btn" [disabled]="loadingDashboard" (click)="refreshDashboard()">
              {{ loadingDashboard ? 'Refreshing...' : 'Refresh data' }}
            </button>
          </div>

          <div class="action-sections">
            <div class="action-group">
              <h4>People</h4>
              <div class="action-grid">
                <button type="button" class="action-btn" (click)="goTo('/admin/teachers')">
                  <span class="action-icon">👩‍🏫</span>
                  <span class="action-copy">
                    <strong>Register Teacher</strong>
                    <small>Add a new staff member</small>
                  </span>
                </button>
                <button type="button" class="action-btn" (click)="goTo('/admin/classes')">
                  <span class="action-icon">🏫</span>
                  <span class="action-copy">
                    <strong>Add Class</strong>
                    <small>Create a new class group</small>
                  </span>
                </button>
              </div>
            </div>

            <div class="action-group">
              <h4>Academics</h4>
              <div class="action-grid">
                <button type="button" class="action-btn" (click)="goTo('/admin/subjects')">
                  <span class="action-icon">📚</span>
                  <span class="action-copy">
                    <strong>Add Subject</strong>
                    <small>Build your academic catalog</small>
                  </span>
                </button>
                <button type="button" class="action-btn" (click)="goTo('/admin/assignments')">
                  <span class="action-icon">🧩</span>
                  <span class="action-copy">
                    <strong>Assign Teacher</strong>
                    <small>Match teachers to classes</small>
                  </span>
                </button>
              </div>
            </div>

            <div class="action-group">
              <h4>Review</h4>
              <div class="action-grid single-row">
                <button type="button" class="action-btn" (click)="goTo('/admin/marks')">
                  <span class="action-icon">📝</span>
                  <span class="action-copy">
                    <strong>Review Marks</strong>
                    <small>Check submissions and approvals</small>
                  </span>
                </button>
                <button type="button" class="action-btn" (click)="goTo('/admin/results')">
                  <span class="action-icon">📊</span>
                  <span class="action-copy">
                    <strong>Results</strong>
                    <small>Monitor outcomes and reports</small>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="panel table-panel">
        <div class="panel-header">
          <h3>Recent Mark Submissions</h3>
          <button type="button" class="ghost-btn" (click)="goTo('/admin/marks')">Manage</button>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Teacher</th>
                <th>Class</th>
                <th>Subject</th>
                <th>Term</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of recentSubmissions">
                <td>{{ row.teacher }}</td>
                <td>{{ row.className }}</td>
                <td>{{ row.subject }}</td>
                <td>{{ row.term }}</td>
                <td>{{ row.date }}</td>
                <td><app-status-badge [status]="row.status"></app-status-badge></td>
                <td><button type="button" class="text-btn" (click)="goTo('/admin/marks')">Open</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .dashboard-shell {
        display: flex;
        flex-direction: column;
        gap: 1.3rem;
      }

      .ghost-btn, .action-btn, .text-btn {
        border: none;
        border-radius: 12px;
        cursor: pointer;
        font-weight: 700;
      }

      .dashboard-error { margin: -.5rem 0 0; padding: .75rem 1rem; border: 1px solid #fecaca; border-radius: 8px; background: #fef2f2; color: #b91c1c; }
      .ghost-btn:disabled { opacity: .65; cursor: wait; }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
        gap: 1rem;
      }

      .content-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 1rem;
      }

      .panel {
        background: linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,250,252,0.98) 100%);
        border-radius: 24px;
        border: 1px solid var(--border);
        box-shadow: var(--shadow-soft);
        padding: 1.2rem;
      }

      .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .header-copy {
        display: flex;
        flex-direction: column;
        gap: 0.15rem;
      }

      .eyebrow {
        font-size: 0.68rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #25856b;
      }

      .panel-header h3 {
        margin: 0;
        font-size: 1.05rem;
      }

      .ghost-btn {
        background: #e6f4ec;
        color: #1b6e5b;
        padding: 0.7rem 0.8rem;
      }

      .action-sections {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 1rem;
      }

      .action-group {
        display: flex;
        flex-direction: column;
        gap: 0.7rem;
        padding: 0.9rem;
        border: 1px solid #e2e8f0;
        background: rgba(248,250,252,0.75);
        border-radius: 18px;
      }

      .action-group h4 {
        margin: 0;
        font-size: 0.78rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #475569;
      }

      .action-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 0.75rem;
      }

      .action-grid.single-row {
        grid-template-columns: 1fr 1fr;
      }

      .action-btn {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        width: 100%;
        background: linear-gradient(120deg, rgba(230,244,236,.98), rgba(226,241,239,.98));
        color: #1b554b;
        padding: 0.9rem 0.85rem;
        text-align: left;
        border: 1px solid rgba(148,163,184,0.15);
        transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
      }

      .action-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 10px 20px rgba(37, 133, 107, .1);
        border-color: rgba(37, 133, 107, .3);
      }

      .action-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 42px;
        height: 42px;
        border-radius: 12px;
        background: rgba(37, 133, 107, .13);
        font-size: 1.25rem;
        flex-shrink: 0;
      }

      .action-copy {
        display: flex;
        flex-direction: column;
        gap: 0.15rem;
        min-width: 0;
      }

      .action-copy strong {
        font-size: 0.96rem;
      }

      .action-copy small {
        font-size: 0.73rem;
        color: #475569;
        line-height: 1.4;
      }

      .table-wrap {
        overflow-x: auto;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        min-width: 720px;
      }

      th, td {
        text-align: left;
        padding: 0.9rem 0.7rem;
        border-bottom: 1px solid #e2e8f0;
      }

      th {
        color: #64748b;
        font-size: 0.76rem;
        text-transform: uppercase;
        letter-spacing: 0.06em;
      }

      .text-btn {
        background: transparent;
        color: #1b6e5b;
        padding: 0.35rem 0.6rem;
      }

      @media (max-width: 1180px) {
        .stats-grid {
          grid-template-columns: repeat(3, minmax(160px, 1fr));
        }

        .action-sections {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 760px) {
        .hero-card {
          flex-direction: column;
          align-items: flex-start;
        }

        .content-grid {
          grid-template-columns: 1fr;
        }

        .stats-grid {
          grid-template-columns: repeat(2, minmax(140px, 1fr));
        }

        .bar-group {
          grid-template-columns: 90px 1fr 40px;
        }

        .action-grid.single-row {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class AdminDashboardComponent {
  loadingDashboard = false;
  dashboardError = '';
  stats = {
    totalTeachers: 0,
    totalStudents: 0,
    totalClasses: 0,
    totalSubjects: 0,
    pendingSubmissions: 0,
    completedResults: 0,
  };

  recentSubmissions: Array<{ teacher: string; className: string; subject: string; term: string; date: string; status: 'Pending' | 'Accepted' | 'Rejected' | 'Resubmitted' }> = [];

  constructor(
    private readonly router: Router,
    private readonly resultService: ResultService,
    private readonly classService: ClassService,
    private readonly subjectService: SubjectService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {
    this.refreshDashboard();
  }

  refreshDashboard(): void {
    this.loadingDashboard = true;
    this.dashboardError = '';

    forkJoin({
      summary: this.resultService.getDashboardStats().pipe(catchError(() => of(null))),
      classes: this.classService.getClasses().pipe(catchError(() => of(null))),
      subjects: this.subjectService.getSubjects().pipe(catchError(() => of(null))),
    }).subscribe(({ summary, classes, subjects }) => {
      if (summary) {
        this.stats = { ...this.stats, ...summary.stats };
        this.recentSubmissions = summary.recentSubmissions;
      }
      if (classes) this.stats.totalClasses = classes.length;
      if (subjects) this.stats.totalSubjects = subjects.length;

      const failedRequests = [summary, classes, subjects].filter((response) => response === null).length;
      this.dashboardError = failedRequests
        ? 'Some dashboard data could not be loaded. Check the backend connection and refresh.'
        : '';
      this.loadingDashboard = false;
      this.changeDetectorRef.markForCheck();
    });
  }

  goTo(route: string): void {
    this.router.navigateByUrl(route);
  }

  generateReport(): void {
    const rows = this.recentSubmissions;

    const csv = [
      'Teacher,Class,Subject,Term,Date,Status',
      ...rows.map((row) => `${row.teacher},${row.className},${row.subject},${row.term},${row.date},${row.status}`),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'school-report.csv';
    anchor.click();
    URL.revokeObjectURL(url);
  }
}
