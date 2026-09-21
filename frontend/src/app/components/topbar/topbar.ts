import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="topbar">
      <div class="topbar-left">
        <button class="menu-toggle" type="button" (click)="toggleSidebar.emit()">☰</button>
        <div>
          <h1>{{ title }}</h1>
          <p>{{ subtitle }}</p>
        </div>
      </div>

      <div class="topbar-actions">
        <div class="user-pill">
          <div class="user-avatar">{{ userInitials }}</div>
          <div>
            <strong>{{ userName }}</strong>
            <small>{{ userRole }}</small>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .topbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        padding: 1.1rem 1.3rem;
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid rgba(99, 102, 241, 0.12);
        border-radius: 22px;
        box-shadow: 0 14px 28px rgba(30, 58, 138, 0.08);
        backdrop-filter: blur(10px);
      }

      .topbar-left {
        display: flex;
        align-items: center;
        gap: 0.9rem;
        min-width: 0;
      }

      .menu-toggle {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 0;
        background: linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%);
        width: 42px;
        height: 42px;
        border-radius: 12px;
        cursor: pointer;
        box-shadow: inset 0 0 0 1px rgba(59, 130, 246, 0.08);
        color: #1d4ed8;
        font-size: 1.2rem;
      }

      h1 {
        margin: 0;
        font-size: clamp(1.2rem, 2vw, 1.9rem);
        letter-spacing: -0.04em;
      }

      p {
        margin: 0.2rem 0 0;
        color: var(--muted);
        font-size: 0.9rem;
      }

      .topbar-actions {
        display: flex;
        align-items: center;
      }

      .user-pill {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        background: linear-gradient(135deg, #f9fffb 0%, #edfdf5 100%);
        border: 1px solid rgba(34, 197, 94, 0.12);
        border-radius: 16px;
        padding: 0.42rem 0.72rem;
        box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.08);
      }

      .user-avatar {
        display: grid;
        place-items: center;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background: linear-gradient(135deg, #1636a8 0%, #2563eb 55%, #60a5fa 100%);
        color: #fff;
        font-weight: 700;
        box-shadow: 0 8px 18px rgba(59, 130, 246, 0.28);
      }

      .user-pill strong,
      .user-pill small {
        display: block;
      }

      .user-pill strong {
        font-size: 0.92rem;
      }

      .user-pill small {
        color: var(--muted);
      }

      @media (max-width: 720px) {
        .topbar {
          padding: 0.9rem 1rem;
        }

        .topbar-actions {
          gap: 0.4rem;
        }

        .user-pill {
          padding: 0.32rem 0.5rem;
        }
      }
    `,
  ],
})
export class TopbarComponent {
  @Input() title = 'Dashboard';
  @Input() subtitle = '';
  @Input() userName = 'Admin';
  @Input() userRole = 'Admin';
  @Input() userInitials = 'AD';
  @Output() toggleSidebar = new EventEmitter<void>();
}
