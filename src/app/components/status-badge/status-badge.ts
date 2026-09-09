import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="status-badge" [ngClass]="status.toLowerCase()">{{ status }}</span>
  `,
  styles: [
    `
      .status-badge {
        display: inline-flex;
        align-items: center;
        padding: 0.38rem 0.7rem;
        border-radius: 999px;
        font-size: 0.74rem;
        font-weight: 700;
      }
      .pending, .draft { background: #fef3c7; color: #92400e; }
      .accepted, .active, .submitted { background: #dcfce7; color: #166534; }
      .resubmitted { background: #dbeafe; color: #1d4ed8; }
      .rejected { background: #fee2e2; color: #991b1b; }
      .warning, .on-leave { background: #fef3c7; color: #92400e; }
      .inactive { background: #e2e8f0; color: #334155; }
      .class-teacher, .subject-teacher, .class-subject-teacher { background: #dbeafe; color: #1d4ed8; }
    `,
  ],
})
export class StatusBadgeComponent {
  @Input() status = 'Pending';
}
