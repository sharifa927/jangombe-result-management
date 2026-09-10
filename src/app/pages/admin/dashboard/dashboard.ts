import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardCardComponent } from '../../../components/dashboard-card/dashboard-card';
import { StatusBadgeComponent } from '../../../components/status-badge/status-badge';
import { ResultService } from '../../../services/result.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, DashboardCardComponent, StatusBadgeComponent],
  template: `
    <section class="dashboard-shell">
      <div class="hero-card">
        <div>
          <p class="eyebrow">School overview</p>
          <h2>Good morning, Admin</h2>
          <p>Here's what's happening at Jang’ombe Secondary School today.</p>
        </div>
        <button type="button" class="primary-btn" (click)="generateReport()">Generate report</button>
      </div>

      <div class="stats-grid">
        <app-dashboard-card label="Total Teachers" [value]="stats.totalTeachers.toString()" icon="👩‍🏫" trend="+2" tone="info"></app-dashboard-card>
        <app-dashboard-card label="Total Students" [value]="stats.totalStudents.toString()" icon="🎓" trend="+21" tone="success"></app-dashboard-card>
        <app-dashboard-card label="Total Classes" [value]="stats.totalClasses.toString()" icon="🏫" trend="+1" tone="warning"></app-dashboard-card>
        <app-dashboard-card label="Total Subjects" [value]="stats.totalSubjects.toString()" icon="📚" trend="+3" tone="info"></app-dashboard-card>
        <app-dashboard-card label="Pending Mark Submissions" [value]="stats.pendingSubmissions.toString()" icon="📝" trend="Needs review" tone="warning"></app-dashboard-card>
        <app-dashboard-card label="Completed Results" [value]="stats.completedResults.toString()" icon="✅" trend="This term" tone="success"></app-dashboard-card>
      </div>

      <div class="content-grid">
        <div class="panel chart-panel">
          <div class="panel-header">
            <h3>Performance Overview</h3>
            <button type="button" class="ghost-btn">View details</button>
          </div>
          <div class="chart-bars" aria-label="Subject performance chart">
            <div class="bar-group" *ngFor="let item of performanceData">
              <span class="bar-label">{{ item.subject }}</span>
              <div class="bar-track">
                <div class="bar-fill" [style.width.%]="item.score"></div>
              </div>
              <span class="bar-value">{{ item.score }}%</span>
            </div>
          </div>
        </div>

        <div class="panel quick-actions-panel">
          <div class="panel-header">
            <h3>Quick Actions</h3>
          </div>
          <div class="action-list">
            <button type="button" class="action-btn" (click)="goTo('/admin/teachers')">Register Teacher</button>
            <button type="button" class="action-btn" (click)="goTo('/admin/classes')">Add Class</button>
            <button type="button" class="action-btn" (click)="goTo('/admin/subjects')">Add Subject</button>
            <button type="button" class="action-btn" (click)="goTo('/admin/assignments')">Assign Teacher</button>
            <button type="button" class="action-btn" (click)="goTo('/admin/marks')">Review Marks</button>
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
        gap: 1.5rem;
      }
      .hero-card {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%);
        color: white;
        border-radius: 20px;
        padding: 1.5rem 1.6rem;
        box-shadow: 0 20px 40px rgba(29, 78, 216, 0.18);
      }
      .eyebrow { margin: 0; text-transform: uppercase; letter-spacing: .12em; font-size: .7rem; opacity: .8; }
      h2 { margin: .3rem 0 .4rem; font-size: clamp(1.5rem, 2.4vw, 2.3rem); }
      .hero-card p { margin: 0; color: rgba(255,255,255,0.8); }
      .primary-btn, .ghost-btn, .action-btn, .text-btn {
        border: none; border-radius: 12px; cursor: pointer; font-weight: 700;
      }
      .primary-btn {
        background: white; color: #1d4ed8; padding: .8rem 1rem;
      }
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(6, minmax(160px, 1fr));
        gap: 1rem;
      }
      .content-grid {
        display: grid;
        grid-template-columns: 1.8fr 1fr;
        gap: 1.2rem;
      }
      .panel {
        background: white;
        border-radius: 20px;
        border: 1px solid rgba(148,163,184,.15);
        box-shadow: 0 10px 22px rgba(15, 23, 42, 0.04);
        padding: 1.2rem;
      }
      .panel-header {
        display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;
      }
      .panel-header h3 { margin: 0; }
      .ghost-btn {
        background: #eff6ff; color: #1d4ed8; padding: .65rem .8rem;
      }
      .chart-bars {
        display: flex; flex-direction: column; gap: 1rem;
      }
      .bar-group {
        display: grid; grid-template-columns: 110px 1fr 50px; align-items: center; gap: .75rem;
      }
      .bar-label { color: #475569; font-weight: 600; }
      .bar-track {
        height: 12px; background: #e2e8f0; border-radius: 999px; overflow: hidden;
      }
      .bar-fill {
        height: 100%; border-radius: 999px; background: linear-gradient(90deg, #1d4ed8 0%, #60a5fa 100%);
      }
      .bar-value { color: #334155; font-weight: 700; }
      .action-list {
        display: flex; flex-direction: column; gap: 0.8rem;
      }
      .action-btn {
        background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); color: #1e3a8a; padding: 0.9rem 1rem; text-align: left;
      }
      .table-wrap { overflow-x: auto; }
      table { width: 100%; border-collapse: collapse; min-width: 720px; }
      th, td { text-align: left; padding: 0.9rem 0.7rem; border-bottom: 1px solid #e2e8f0; }
      th { color: #64748b; font-size: .8rem; text-transform: uppercase; letter-spacing: .06em; }
      .text-btn {
        background: transparent; color: #1d4ed8; padding: 0.35rem 0.6rem;
      }
      @media (max-width: 1180px) {
        .stats-grid { grid-template-columns: repeat(3, minmax(160px, 1fr)); }
      }
      @media (max-width: 760px) {
        .hero-card { flex-direction: column; align-items: flex-start; }
        .content-grid { grid-template-columns: 1fr; }
        .stats-grid { grid-template-columns: repeat(2, minmax(140px, 1fr)); }
        .bar-group { grid-template-columns: 90px 1fr 40px; }
      }
    `,
  ],
})
export class AdminDashboardComponent {
  stats = {
    totalTeachers: 28,
    totalStudents: 642,
    totalClasses: 18,
    totalSubjects: 14,
    pendingSubmissions: 7,
    completedResults: 11,
  };

  performanceData = [
    { subject: 'Mathematics', score: 82 },
    { subject: 'English', score: 75 },
    { subject: 'Physics', score: 70 },
    { subject: 'Chemistry', score: 68 },
    { subject: 'Biology', score: 73 },
    { subject: 'Computer Science', score: 88 },
  ];

  recentSubmissions: Array<{ teacher: string; className: string; subject: string; term: string; date: string; status: 'Pending' | 'Accepted' | 'Rejected' | 'Resubmitted' }> = [];

  constructor(
    private readonly router: Router,
    private readonly resultService: ResultService,
  ) {
    this.resultService.getDashboardStats().subscribe((payload) => {
      this.stats = payload.stats;
      this.recentSubmissions = payload.recentSubmissions;
    });
  }

  goTo(route: string): void {
    this.router.navigateByUrl(route);
  }

  generateReport(): void {
    const rows = this.recentSubmissions.length > 0 ? this.recentSubmissions : [
      { teacher: 'Asha Ali', className: 'Form 2A', subject: 'Mathematics', term: 'Term 1', date: '2026-09-05', status: 'Pending' },
    ];

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
