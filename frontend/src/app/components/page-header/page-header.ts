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
        margin-bottom: 0.2rem;
        padding: 1.1rem 1.2rem;
        background: linear-gradient(135deg, rgba(13,25,78,0.98) 0%, rgba(29,78,216,0.96) 52%, rgba(96,165,250,0.96) 100%);
        border-radius: 24px;
        color: #ffffff;
        box-shadow: 0 20px 34px rgba(37, 99, 235, 0.16);
      }

      .eyebrow {
        margin: 0 0 0.2rem;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: rgba(255,255,255,0.82);
        font-size: 0.7rem;
        font-weight: 700;
      }

      h2 {
        margin: 0;
        letter-spacing: -0.04em;
        font-size: clamp(1.4rem, 2vw, 2rem);
      }

      .primary-btn {
        background: rgba(255,255,255,0.96);
        color: #1636a8;
        border: none;
        border-radius: 12px;
        padding: 0.82rem 1rem;
        font-weight: 700;
        cursor: pointer;
        box-shadow: 0 10px 20px rgba(15, 23, 42, 0.14);
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
