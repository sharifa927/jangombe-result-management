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
        <button class="action-btn" type="button">🔔</button>
        <button class="action-btn" type="button">⚙️</button>
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
        padding: 1.1rem 1.5rem;
        background: rgba(255, 255, 255, 0.8);
        border: 1px solid rgba(148, 163, 184, 0.18);
        border-radius: 18px;
        box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
        backdrop-filter: blur(12px);
      }
      .topbar-left {
        display: flex;
        align-items: center;
        gap: 0.9rem;
      }
      .menu-toggle {
        display: none;
        border: 0;
        background: #eff6ff;
        width: 40px;
        height: 40px;
        border-radius: 12px;
        cursor: pointer;
      }
      h1 {
        margin: 0;
        font-size: clamp(1.2rem, 2vw, 1.8rem);
      }
      p {
        margin: 0.1rem 0 0;
        color: #64748b;
      }
      .topbar-actions {
        display: flex;
        align-items: center;
        gap: 0.9rem;
      }
      .action-btn {
        border: 0;
        background: #f8fafc;
        width: 40px;
        height: 40px;
        border-radius: 12px;
        cursor: pointer;
      }
      .user-pill {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        background: #f8fafc;
        border-radius: 14px;
        padding: 0.4rem 0.7rem;
      }
      .user-avatar {
        display: grid;
        place-items: center;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background: linear-gradient(135deg, #1d4ed8, #3b82f6);
        color: #fff;
        font-weight: 700;
      }
      .user-pill strong,
      .user-pill small {
        display: block;
      }
      .user-pill small {
        color: #64748b;
      }
      @media (max-width: 720px) {
        .menu-toggle {
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .topbar {
          padding: 0.9rem 1rem;
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
