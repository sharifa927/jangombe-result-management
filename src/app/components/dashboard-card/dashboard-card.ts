import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stat-card" [ngClass]="tone">
      <div class="icon-box">{{ icon }}</div>
      <div class="card-copy">
        <p>{{ label }}</p>
        <h3>{{ value }}</h3>
      </div>
      <span class="trend" *ngIf="trend">{{ trend }}</span>
    </div>
  `,
  styles: [
    `
      .stat-card {
        background: white;
        border-radius: 18px;
        border: 1px solid rgba(148, 163, 184, 0.18);
        padding: 1.15rem 1rem;
        box-shadow: 0 12px 22px rgba(15, 23, 42, 0.04);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.9rem;
      }
      .icon-box {
        width: 52px;
        height: 52px;
        display: grid;
        place-items: center;
        border-radius: 14px;
        font-size: 1.5rem;
        background: rgba(59, 130, 246, 0.12);
      }
      .card-copy {
        flex: 1;
      }
      .card-copy p {
        margin: 0;
        color: #64748b;
      }
      .card-copy h3 {
        margin: 0.35rem 0 0;
        font-size: 1.8rem;
      }
      .trend {
        font-size: 0.75rem;
        font-weight: 700;
        padding: 0.35rem 0.55rem;
        border-radius: 999px;
        background: #e0f2fe;
        color: #0369a1;
      }
      .stat-card.warning .icon-box { background: rgba(245, 158, 11, 0.14); }
      .stat-card.success .icon-box { background: rgba(34, 197, 94, 0.14); }
      .stat-card.danger .icon-box { background: rgba(239, 68, 68, 0.12); }
      .stat-card.info .icon-box { background: rgba(59, 130, 246, 0.12); }
    `,
  ],
})
export class DashboardCardComponent {
  @Input() label = 'Total';
  @Input() value = '0';
  @Input() icon = '📊';
  @Input() trend = '';
  @Input() tone: 'info' | 'success' | 'warning' | 'danger' = 'info';
}
