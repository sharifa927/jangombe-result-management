import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="status-badge" [ngClass]="badgeClass(status)">{{ status }}</span>
  `,
  styles: [
    `
      .status-badge {
        display: inline-flex;
        align-items: center;
        padding: 0.38rem 0.72rem;
        border-radius: 999px;
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.02em;
      }
      .pending, .draft, .warning, .on-leave { background: #fff7d6; color: #92400e; }
      .accepted, .active, .submitted { background: #dcfce7; color: #166534; }
      .resubmitted, .class-teacher, .subject-teacher, .class-subject-teacher { background: #dcfce7; color: #166534; }
      .rejected { background: #fee2e2; color: #991b1b; }
      .inactive { background: #f0fdf4; color: #475569; }
    `,
  ],
})
export class StatusBadgeComponent {
  @Input() status = 'Pending';

  badgeClass(value: string): string {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
}
