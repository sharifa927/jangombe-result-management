import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../../components/page-header/page-header';
import { StatusBadgeComponent } from '../../../components/status-badge/status-badge';
import { MarkService, type SubmissionReviewItem } from '../../../services/mark.service';

@Component({
  selector: 'app-admin-marks',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, StatusBadgeComponent],
  template: `
    <section class="page-shell">
      <app-page-header eyebrow="Review" title="Mark Submissions" [actionLabel]="loading ? 'Refreshing...' : 'Refresh submissions'" [actionDisabled]="loading" (action)="refreshSubmissions()"></app-page-header>

      <div class="filters card">
        <select [(ngModel)]="filters.className">
          <option value="All">All Classes</option>
          <option *ngFor="let className of classNames" [value]="className">{{ className }}</option>
        </select>
        <select [(ngModel)]="filters.subject">
          <option value="All">All Subjects</option>
          <option *ngFor="let subject of subjectNames" [value]="subject">{{ subject }}</option>
        </select>
        <select [(ngModel)]="filters.teacher">
          <option value="All">All Teachers</option>
          <option *ngFor="let teacher of teacherNames" [value]="teacher">{{ teacher }}</option>
        </select>
        <select [(ngModel)]="filters.term">
          <option value="All">All Terms</option>
          <option *ngFor="let term of terms" [value]="term">{{ term }}</option>
        </select>
        <select [(ngModel)]="filters.status">
          <option value="All">All Statuses</option>
          <option *ngFor="let status of statuses" [value]="status">{{ status }}</option>
        </select>
      </div>

      <p class="state-message" *ngIf="loading">Loading submissions...</p>
      <p class="error-message" *ngIf="errorMessage">{{ errorMessage }}</p>

      <div class="card table-panel">
        <table>
          <thead>
            <tr>
              <th>Teacher</th>
              <th>Class</th>
              <th>Subject</th>
              <th>Students</th>
              <th>Submitted Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let submission of filteredSubmissions">
              <td>{{ submission.teacher }}</td>
              <td>{{ submission.className }}</td>
              <td>{{ submission.subject }}</td>
              <td>{{ submission.students }}</td>
              <td>{{ submission.date }}</td>
              <td><app-status-badge [status]="submission.status"></app-status-badge></td>
              <td><button class="text-btn" type="button" (click)="openSubmission(submission)">Open</button></td>
            </tr>
            <tr *ngIf="!loading && !errorMessage && filteredSubmissions.length === 0">
              <td colspan="7" class="empty-state">No submissions match these filters.</td>
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
      .filters { padding: 1rem; display: grid; grid-template-columns: repeat(5, minmax(120px, 1fr)); gap: .8rem; }
      select { border: 1px solid #d7e1ef; border-radius: 12px; padding: .8rem 1rem; background: white; }
      table { width: 100%; border-collapse: collapse; }
      th, td { padding: .9rem .8rem; text-align: left; border-bottom: 1px solid #e2e8f0; }
      th { color: #64748b; font-size: .75rem; letter-spacing: .06em; text-transform: uppercase; }
      tbody tr:hover { background: rgba(239,246,255,0.7); }
      .text-btn { border: 0; background: #e6f4ec; color: #1b6e5b; border-radius: 10px; padding: .45rem .7rem; cursor: pointer; }
      .text-btn:focus-visible { outline: 3px solid rgba(37, 133, 107, .25); outline-offset: 2px; }
      .state-message, .error-message { margin: 0; padding: .85rem 1rem; border: 1px solid #dbe4ee; background: #f8fafc; }
      .error-message { color: #b91c1c; border-color: #fecaca; background: #fef2f2; }
      .empty-state { text-align: center; color: #64748b; padding: 1.5rem; }
      @media (max-width: 780px) { .filters { grid-template-columns: 1fr 1fr; } }
    `,
  ],
})
export class AdminMarksComponent {
  filters = {
    className: 'All',
    subject: 'All',
    teacher: 'All',
    term: 'All',
    status: 'All',
  };

  submissions: SubmissionReviewItem[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    private readonly router: Router,
    private readonly markService: MarkService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {
    this.refreshSubmissions();
  }

  refreshSubmissions(): void {
    this.loading = true;
    this.errorMessage = '';
    this.markService.loadReviewItemsFromApi().subscribe({
      next: (serviceItems) => {
        this.submissions = serviceItems;
        this.loading = false;
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.submissions = [];
        this.loading = false;
        this.errorMessage = 'Unable to load submissions from the server.';
        this.changeDetectorRef.markForCheck();
      },
    });
  }

  get classNames(): string[] {
    return [...new Set(this.submissions.map((submission) => submission.className))];
  }

  get subjectNames(): string[] {
    return [...new Set(this.submissions.map((submission) => submission.subject))];
  }

  get teacherNames(): string[] {
    return [...new Set(this.submissions.map((submission) => submission.teacher))];
  }

  get terms(): string[] {
    return [...new Set(this.submissions.map((submission) => submission.term))]
      .filter((term) => term !== 'Term 3');
  }

  get statuses(): string[] {
    return [...new Set(this.submissions.map((submission) => submission.status))];
  }

  get filteredSubmissions() {
    return this.submissions.filter((submission) => {
      const classMatch = this.filters.className === 'All' || submission.className === this.filters.className;
      const subjectMatch = this.filters.subject === 'All' || submission.subject === this.filters.subject;
      const teacherMatch = this.filters.teacher === 'All' || submission.teacher === this.filters.teacher;
      const statusMatch = this.filters.status === 'All' || (
        this.filters.status === 'Pending' ? ['Pending', 'Resubmitted'].includes(submission.status) : submission.status === this.filters.status
      );
      const termMatch = this.filters.term === 'All' || submission.term === this.filters.term;
      return classMatch && subjectMatch && teacherMatch && statusMatch && termMatch;
    });
  }

  openSubmission(submission: SubmissionReviewItem): void {
    this.router.navigateByUrl(`/admin/submission-review/${submission.id}`);
  }
}
