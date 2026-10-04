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
      <button *ngIf="actionLabel" type="button" class="primary-btn" [disabled]="actionDisabled" (click)="action.emit()">
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
        background: #dcebe5;
        border: 1px solid #d6e6e3;
        border-radius: 14px;
        color: #183744;
        box-shadow: 0 8px 20px rgba(21, 85, 115, 0.06);
      }

      .eyebrow {
        margin: 0 0 0.2rem;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: #60777c;
        font-size: 0.7rem;
        font-weight: 700;
      }

      h2 {
        margin: 0;
        letter-spacing: -0.04em;
        font-size: clamp(1.4rem, 2vw, 2rem);
      }

      .primary-btn {
        background: #1b6e5b;
        color: #ffffff;
        border: 1px solid #1b6e5b;
        border-radius: 10px;
        padding: 0.82rem 1rem;
        font-weight: 700;
        cursor: pointer;
        box-shadow: 0 5px 12px rgba(20, 84, 68, .16);
        transition: background .16s ease, transform .16s ease, box-shadow .16s ease;
      }

      .primary-btn:hover { background: #145344; border-color: #145344; transform: translateY(-1px); box-shadow: 0 7px 15px rgba(20, 84, 68, .2); }
      .primary-btn:focus-visible { outline: 3px solid #b5ead2; outline-offset: 2px; }

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
  @Input() actionDisabled = false;
  @Output() action = new EventEmitter<void>();
}
