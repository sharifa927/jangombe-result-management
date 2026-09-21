import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StatusBadgeComponent } from '../../../components/status-badge/status-badge';
import { MarkService, type SubmissionReviewItem } from '../../../services/mark.service';

@Component({
  selector: 'app-submission-review',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusBadgeComponent],
  template: `
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
              <th>Grade</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let row of item.studentRows">
              <td>{{ row.name }}</td>
              <td>{{ row.marks }}</td>
              <td>{{ row.grade }}</td>
              <td>{{ row.remarks }}</td>
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
          <button type="button" class="accept-btn" (click)="acceptSubmission()">Accept submission</button>
          <button type="button" class="reject-btn" (click)="rejectSubmission()">Reject submission</button>
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
      .accept-btn { background: linear-gradient(135deg, #15803d 0%, #22c55e 100%); color: white; }
      .reject-btn { background: linear-gradient(135deg, #b91c1c 0%, #ef4444 100%); color: white; }
      .secondary-btn { background: #eff6ff; color: #1d4ed8; }
      @media (max-width: 760px) { .summary-grid { grid-template-columns: repeat(2, minmax(140px, 1fr)); } .page-header { align-items: flex-start; flex-direction: column; } }
    `,
  ],
})
export class SubmissionReviewComponent implements OnInit {
  submission?: SubmissionReviewItem;
  reviewNote = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly markService: MarkService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigateByUrl('/admin/marks');
      return;
    }

    const item = this.markService.getReviewItemById(id);
    this.submission = item ?? undefined;
    if (!this.submission) {
      this.router.navigateByUrl('/admin/marks');
      return;
    }

    this.reviewNote = this.submission.rejectionReason ?? '';
  }

  acceptSubmission(): void {
    if (!this.submission) {
      return;
    }

    this.markService.updateReviewStatus(this.submission.id, 'Accepted', this.reviewNote || 'Accepted after review.');
    this.submission.status = 'Accepted';
    this.submission.rejectionReason = undefined;
    this.router.navigateByUrl('/admin/marks');
  }

  rejectSubmission(): void {
    if (!this.submission) {
      return;
    }

    this.markService.updateReviewStatus(this.submission.id, 'Rejected', this.reviewNote || 'Submission did not meet the minimum review standard.');
    this.submission.status = 'Rejected';
    this.submission.rejectionReason = this.reviewNote || 'Submission did not meet the minimum review standard.';
    this.router.navigateByUrl('/admin/marks');
  }

  goBack(): void {
    this.router.navigateByUrl('/admin/marks');
  }
}
