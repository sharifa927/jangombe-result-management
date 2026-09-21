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
        position: relative;
        background: linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(246,249,255,0.98) 100%);
        border-radius: 22px;
        border: 1px solid var(--border);
        padding: 1.15rem 1.1rem 1rem;
        min-height: 144px;
        box-shadow: var(--shadow-soft);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.95rem;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        overflow: hidden;
      }

      .stat-card::before {
        content: '';
        position: absolute;
        inset: 0 auto auto 0;
        width: 100%;
        height: 3px;
        background: linear-gradient(90deg, rgba(29,78,216,0.15), rgba(96,165,250,0.7), rgba(29,78,216,0.15));
      }

      .stat-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 18px 30px rgba(15, 23, 42, 0.08);
      }

      .icon-box {
        width: 58px;
        height: 58px;
        display: grid;
        place-items: center;
        border-radius: 16px;
        font-size: 1.6rem;
        background: rgba(59, 130, 246, 0.12);
        box-shadow: inset 0 0 0 1px rgba(96, 165, 250, 0.14);
      }

      .card-copy {
        flex: 1;
        min-width: 0;
      }

      .card-copy p {
        margin: 0;
        color: var(--muted);
        font-size: 0.8rem;
      }

      .card-copy h3 {
        margin: 0.42rem 0 0;
        font-size: clamp(1.5rem, 2vw, 2.1rem);
        line-height: 1.1;
        letter-spacing: -0.04em;
      }

      .trend {
        font-size: 0.68rem;
        font-weight: 700;
        padding: 0.4rem 0.62rem;
        border-radius: 999px;
        background: #e0f2fe;
        color: #0369a1;
        white-space: nowrap;
      }

      .stat-card.warning .icon-box { background: rgba(245, 158, 11, 0.12); }
      .stat-card.success .icon-box { background: rgba(16, 185, 129, 0.12); }
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
