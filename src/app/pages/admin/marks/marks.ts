import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StatusBadgeComponent } from '../../../components/status-badge/status-badge';
import { MarkService, type SubmissionReviewItem } from '../../../services/mark.service';

@Component({
  selector: 'app-admin-marks',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusBadgeComponent],
  template: `
    <section class="page-shell">
      <div class="page-header">
        <div>
          <p class="eyebrow">Review</p>
          <h2>Mark Submissions</h2>
        </div>
      </div>

      <div class="filters card">
        <select [(ngModel)]="filters.className">
          <option value="All">All Classes</option>
          <option value="Form 1A">Form 1A</option>
          <option value="Form 2A">Form 2A</option>
          <option value="Form 3A">Form 3A</option>
        </select>
        <select [(ngModel)]="filters.subject">
          <option value="All">All Subjects</option>
          <option value="Mathematics">Mathematics</option>
          <option value="English">English</option>
          <option value="Biology">Biology</option>
        </select>
        <select [(ngModel)]="filters.teacher">
          <option value="All">All Teachers</option>
          <option value="Asha Ali">Asha Ali</option>
          <option value="Khamis Mbezi">Khamis Mbezi</option>
          <option value="Fatma Mroso">Fatma Mroso</option>
        </select>
        <select [(ngModel)]="filters.term">
          <option value="All">All Terms</option>
          <option value="Term 1">Term 1</option>
          <option value="Term 2">Term 2</option>
        </select>
        <select [(ngModel)]="filters.status">
          <option value="All">All Statuses</option>
          <option value="Accepted">Accepted</option>
          <option value="Pending">Pending</option>
          <option value="Resubmitted">Resubmitted</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

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
          </tbody>
        </table>
      </div>
    </section>
  `,
  styles: [
    `
      .page-shell { display: flex; flex-direction: column; gap: 1.2rem; }
      .page-header { margin-bottom: .6rem; }
      .eyebrow { margin: 0; text-transform: uppercase; letter-spacing: .12em; font-size: .7rem; color: #64748b; }
      h2 { margin: .25rem 0 0; }
      .card { background: white; border: 1px solid rgba(148,163,184,.15); border-radius: 18px; box-shadow: 0 8px 22px rgba(15,23,42,.04); }
      .filters { padding: 1rem; display: grid; grid-template-columns: repeat(5, minmax(120px, 1fr)); gap: .8rem; }
      select { border: 1px solid #d7e1ef; border-radius: 12px; padding: .8rem 1rem; }
      table { width: 100%; border-collapse: collapse; }
      th, td { padding: .9rem .8rem; text-align: left; border-bottom: 1px solid #e2e8f0; }
      th { color: #64748b; font-size: .75rem; letter-spacing: .06em; text-transform: uppercase; }
      .text-btn { border: 0; background: #eff6ff; color: #1d4ed8; border-radius: 10px; padding: .45rem .7rem; cursor: pointer; }
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

  submissions: SubmissionReviewItem[] = [
    { id: 'sub-1', teacher: 'Asha Ali', className: 'Form 2A', subject: 'Mathematics', students: 42, date: '2026-09-05', status: 'Accepted', studentRows: [] },
    { id: 'sub-2', teacher: 'Khamis Mbezi', className: 'Form 1A', subject: 'English', students: 41, date: '2026-09-04', status: 'Pending', studentRows: [] },
    { id: 'sub-3', teacher: 'Fatma Mroso', className: 'Form 3A', subject: 'Biology', students: 45, date: '2026-09-03', status: 'Rejected', rejectionReason: 'Several marks are missing or out of range.', studentRows: [] },
    { id: 'sub-4', teacher: 'Asha Ali', className: 'Form 2B', subject: 'Physics', students: 40, date: '2026-09-08', status: 'Resubmitted', studentRows: [] },
  ];

  constructor(
    private readonly router: Router,
    private readonly markService: MarkService,
  ) {
    this.refreshSubmissions();
  }

  private refreshSubmissions(): void {
    const serviceItems = this.markService.getReviewItems();
    this.submissions = serviceItems.length > 0 ? serviceItems : this.submissions;
  }

  get filteredSubmissions() {
    return this.submissions.filter((submission) => {
      const classMatch = this.filters.className === 'All' || submission.className === this.filters.className;
      const subjectMatch = this.filters.subject === 'All' || submission.subject === this.filters.subject;
      const teacherMatch = this.filters.teacher === 'All' || submission.teacher === this.filters.teacher;
      const statusMatch = this.filters.status === 'All' || (
        this.filters.status === 'Pending' ? ['Pending', 'Resubmitted'].includes(submission.status) : submission.status === this.filters.status
      );
      const termMatch = this.filters.term === 'All' || this.filters.term === 'Term 1';
      return classMatch && subjectMatch && teacherMatch && statusMatch && termMatch;
    });
  }

  openSubmission(submission: SubmissionReviewItem): void {
    this.router.navigateByUrl(`/admin/submission-review/${submission.id}`);
  }
}
