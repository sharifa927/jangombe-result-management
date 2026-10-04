import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StatusBadgeComponent } from '../../../components/status-badge/status-badge';
import { MarkService, type SubmissionReviewItem } from '../../../services/mark.service';

@Component({
  selector: 'app-submission-review',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusBadgeComponent],
  template: `
    <p class="state-message" *ngIf="loading">Loading submission...</p>
    <p class="error-message" role="alert" *ngIf="errorMessage">{{ errorMessage }}</p>
    <section class="page-shell" *ngIf="submission as item">
      <div class="page-header">
        <div>
          <p class="eyebrow">Submission review</p>
          <h2>{{ item.subject }} - {{ item.className }}</h2>
        </div>
        <button type="button" class="secondary-btn" (click)="goBack()">Back to submissions</button>
      </div>

      <div class="summary-grid card">
        <div><span>Teacher</span><strong>{{ item.teacher }}</strong></div>
        <div><span>Submitted</span><strong>{{ item.date }}</strong></div>
        <div><span>Students</span><strong>{{ item.students }}</strong></div>
        <div><span>Status</span><strong><app-status-badge [status]="item.status"></app-status-badge></strong></div>
      </div>

      <div class="card review-card">
        <div class="section-header">
          <h3>Student marks</h3>
        </div>

        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Marks</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let row of item.studentRows">
              <td>{{ row.name }}</td>
              <td>{{ row.marks }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="card action-card">
        <h3>Admin decision</h3>

        <label class="field">
          <span>Review note</span>
          <textarea [(ngModel)]="reviewNote" rows="4" placeholder="Add a note for the teacher..."></textarea>
        </label>

        <div class="decision-row">
          <button type="button" class="accept-btn" [disabled]="saving" (click)="acceptSubmission()">Accept submission</button>
          <button type="button" class="reject-btn" [disabled]="saving" (click)="rejectSubmission()">Reject submission</button>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .page-shell { display: flex; flex-direction: column; gap: 1.2rem; }
      .page-header { display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
      .eyebrow { margin: 0; text-transform: uppercase; letter-spacing: .12em; font-size: .7rem; color: #64748b; }
      h2 { margin: .25rem 0 0; }
      .card { background: white; border: 1px solid rgba(148,163,184,.15); border-radius: 18px; box-shadow: 0 8px 22px rgba(15,23,42,.04); }
      .summary-grid { display: grid; grid-template-columns: repeat(4, minmax(120px, 1fr)); gap: .8rem; padding: 1rem; }
      .summary-grid span { display: block; color: #64748b; }
      .summary-grid strong { display: block; margin-top: .2rem; font-size: 1.08rem; }
      .review-card, .action-card { padding: 1rem 1.2rem; }
      .section-header { margin-bottom: .8rem; }
      h3 { margin: 0; }
      table { width: 100%; border-collapse: collapse; }
      th, td { text-align: left; padding: .8rem .7rem; border-bottom: 1px solid #e2e8f0; }
      th { color: #64748b; font-size: .75rem; letter-spacing: .06em; text-transform: uppercase; }
      .field { display: flex; flex-direction: column; gap: .45rem; margin: 1rem 0 1.2rem; }
      .field span { font-weight: 600; color: #334155; }
      textarea { width: 100%; border: 1px solid #d7e1ef; border-radius: 12px; padding: .85rem 1rem; resize: vertical; }
      .decision-row { display: flex; gap: .8rem; flex-wrap: wrap; }
      .accept-btn, .reject-btn, .secondary-btn { border: none; border-radius: 12px; cursor: pointer; font-weight: 700; padding: .8rem 1rem; }
      .accept-btn:disabled, .reject-btn:disabled { opacity: .6; cursor: wait; }
      .accept-btn { background: var(--teacher-action, linear-gradient(120deg, #21845f, #25856b)); color: white; }
      .reject-btn { background: linear-gradient(135deg, #b91c1c 0%, #ef4444 100%); color: white; }
      .secondary-btn { background: #e6f4ec; color: #1b6e5b; }
      .state-message, .error-message { margin: 0; padding: .85rem 1rem; border: 1px solid #dbe4ee; background: #f8fafc; }
      .error-message { color: #b91c1c; border-color: #fecaca; background: #fef2f2; }
      @media (max-width: 760px) { .summary-grid { grid-template-columns: repeat(2, minmax(140px, 1fr)); } .page-header { align-items: flex-start; flex-direction: column; } }
    `,
  ],
})
export class SubmissionReviewComponent implements OnInit {
  submission?: SubmissionReviewItem;
  reviewNote = '';
  loading = true;
  saving = false;
  errorMessage = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly markService: MarkService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigateByUrl('/admin/marks');
      return;
    }

    this.markService.getReviewItemById(id).subscribe({
      next: (item) => {
        this.submission = item;
        this.reviewNote = item.rejectionReason ?? '';
        this.loading = false;
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Unable to load this submission. Return to the submissions list and try again.';
        this.changeDetectorRef.markForCheck();
      },
    });
  }

  acceptSubmission(): void {
    if (!this.submission) {
      return;
    }

    this.updateSubmission('Accepted', this.reviewNote || 'Accepted after review.');
  }

  rejectSubmission(): void {
    if (!this.submission) {
      return;
    }

    this.updateSubmission('Rejected', this.reviewNote || 'Submission did not meet the minimum review standard.');
  }

  goBack(): void {
    this.router.navigateByUrl('/admin/marks');
  }

  private updateSubmission(status: 'Accepted' | 'Rejected', reason: string): void {
    if (!this.submission || this.saving) return;
    this.saving = true;
    this.errorMessage = '';
    this.changeDetectorRef.markForCheck();
    this.markService.updateReviewStatus(this.submission.id, status, reason).subscribe({
      next: () => this.router.navigateByUrl('/admin/marks'),
      error: () => {
        this.saving = false;
        this.errorMessage = 'The review decision could not be saved. Please try again.';
        this.changeDetectorRef.markForCheck();
      },
    });
  }
}
