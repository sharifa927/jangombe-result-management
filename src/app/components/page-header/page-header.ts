import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <div>
        <p class="eyebrow">{{ eyebrow }}</p>
        <h2>{{ title }}</h2>
      </div>
      <button *ngIf="actionLabel" type="button" class="primary-btn" (click)="action.emit()">
        {{ actionLabel }}
      </button>
    </div>
  `,
  styles: [
    `
      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }
      .eyebrow {
        margin: 0 0 0.2rem;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: #64748b;
        font-size: 0.72rem;
        font-weight: 700;
      }
      h2 {
        margin: 0;
      }
      .primary-btn {
        background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%);
        color: white;
        border: none;
        border-radius: 12px;
        padding: 0.8rem 1rem;
        font-weight: 600;
        cursor: pointer;
      }
      @media (max-width: 640px) {
        .page-header {
          flex-direction: column;
          align-items: flex-start;
        }
      }
    `,
  ],
})
export class PageHeaderComponent {
  @Input() eyebrow = 'Overview';
  @Input() title = 'Page';
  @Input() actionLabel = '';
  @Output() action = new EventEmitter<void>();
}
