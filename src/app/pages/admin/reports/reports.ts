import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface SchoolReport {
  title: string;
  description: string;
  data: string[];
}

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-shell">
      <div class="page-header">
        <div>
          <p class="eyebrow">Overview</p>
          <h2>Reports</h2>
        </div>
      </div>

      <div class="report-grid">
        <div class="report-card card" *ngFor="let report of reports">
          <h3>{{ report.title }}</h3>
          <p>{{ report.description }}</p>
          <div class="report-list">
            <span *ngFor="let item of report.data">{{ item }}</span>
          </div>
          <div class="actions">
            <button type="button" (click)="openReport(report)">View</button>
            <button type="button" (click)="printReport(report)">Print</button>
            <button type="button" (click)="downloadReport(report)">Download</button>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .page-shell { display: flex; flex-direction: column; gap: 1.2rem; }
      .page-header { margin-bottom: .3rem; }
      .eyebrow { margin: 0; font-size: .72rem; text-transform: uppercase; letter-spacing: .12em; color: #64748b; }
      h2 { margin: .25rem 0 0; }
      .report-grid { display: grid; grid-template-columns: repeat(2, minmax(220px,1fr)); gap: 1rem; }
      .card { background: white; border: 1px solid rgba(148,163,184,.15); border-radius: 18px; box-shadow: 0 8px 22px rgba(15,23,42,.04); padding: 1.2rem; }
      .report-card h3 { margin-top: 0; }
      .report-card p { color: #64748b; margin-bottom: 1rem; }
      .report-list { display: flex; flex-direction: column; gap: .35rem; margin-bottom: 1rem; font-size: .85rem; color: #334155; }
      .actions { display: flex; flex-wrap: wrap; gap: .5rem; }
      .actions button { border: 0; background: #eff6ff; color: #1d4ed8; border-radius: 10px; padding: .5rem .8rem; cursor: pointer; }
      @media (max-width: 760px) { .report-grid { grid-template-columns: 1fr; } }
    `,
  ],
})
export class AdminReportsComponent {
  reports: SchoolReport[] = [
    {
      title: 'Student Result Report',
      description: 'Detailed view of each learner’s performance and grade summary.',
      data: ['Amina Ali — A', 'Juma Omar — B', 'Fatma Said — B'],
    },
    {
      title: 'Class Result Report',
      description: 'Summaries for all students within a selected class and term.',
      data: ['Form 2A average: 69.4', 'Top student: Amina Ali', 'Pass rate: 88%'],
    },
    {
      title: 'Subject Performance Report',
      description: 'Comparison of subject averages, pass rate, and grade distribution.',
      data: ['Mathematics: 71.5', 'English: 68.0', 'Physics: 72.8'],
    },
    {
      title: 'Teacher Mark Submission Report',
      description: 'Review of submission status across teachers and academic periods.',
      data: ['Accepted: 2', 'Pending: 1', 'Resubmitted: 1'],
    },
  ];

  openReport(report: SchoolReport): void {
    const summary = report.data.join('\n');
    window.alert(`${report.title}\n\n${summary}`);
  }

  printReport(report: SchoolReport): void {
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) {
      return;
    }

    printWindow.document.write(`
      <html>
        <head><title>${report.title}</title></head>
        <body style="font-family: Arial, sans-serif; padding: 24px;">
          <h2>${report.title}</h2>
          <p>${report.description}</p>
          <ul>${report.data.map((item) => `<li>${item}</li>`).join('')}</ul>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  downloadReport(report: SchoolReport): void {
    const csvContent = ['Report Title,Description,Summary', `${report.title},${report.description},${report.data.join(' | ')}`].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${report.title.toLowerCase().replace(/\s+/g, '-')}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }
}
