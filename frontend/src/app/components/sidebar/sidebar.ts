import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar" [class.collapsed]="collapsed" [class.teacher-theme]="teacherTheme">
      <div class="brand-box">
        <div class="brand-mark">JS</div>
        <div class="brand-copy">
          <h2>JANG’OMBE</h2>
          <small>School System</small>
        </div>
      </div>

      <nav class="nav">
        <ng-container *ngFor="let item of items">
          <a
            *ngIf="item.visible !== false"
            [routerLink]="item.route === '/login' ? null : item.route"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
            class="nav-item"
            (click)="item.route === '/login' && logout.emit()"
          >
            <span class="nav-icon">{{ item.icon }}</span>
            <span class="nav-label">{{ item.label }}</span>
          </a>
        </ng-container>
      </nav>
    </aside>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .sidebar {
        width: 270px;
        background: linear-gradient(165deg, #123b54 0%, #102d42 58%, #123d3c 100%);
        color: #eaf2ff;
        padding: 1rem 0.8rem 1.1rem;
        box-shadow: 18px 0 36px rgba(13, 57, 62, .18);
        height: 100%;
        min-height: calc(100vh - 2.2rem);
        border-radius: 28px;
        transition: width 0.22s ease;
        border: 1px solid rgba(148, 163, 184, 0.15);
      }

      .sidebar.collapsed {
        width: 92px;
      }

      .sidebar.teacher-theme {
        background: linear-gradient(165deg, #123b54 0%, #102d42 58%, #123d3c 100%);
        color: #eaf2ff;
        border-color: rgba(148, 163, 184, .18);
        box-shadow: 12px 0 28px rgba(15, 23, 42, .18);
      }

      .brand-box {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        padding: 0.75rem 0.7rem 1.2rem;
        border-bottom: 1px solid rgba(148, 163, 184, 0.16);
      }

      .brand-mark {
        width: 48px;
        height: 48px;
        display: grid;
        place-items: center;
        border-radius: 16px;
        background: linear-gradient(135deg, #51c4a3 0%, #318cb4 100%);
        font-weight: 800;
        font-size: 0.85rem;
        box-shadow: 0 12px 22px rgba(37, 133, 107, .28);
      }

      .brand-copy h2 {
        margin: 0;
        font-size: 0.82rem;
        letter-spacing: 0.12em;
      }

      .brand-copy small {
        display: block;
        margin-top: 0.1rem;
        color: #b8ddd5;
        letter-spacing: 0.04em;
      }

      .sidebar.teacher-theme .brand-copy small { color: #b8ddd5; }
      .sidebar.teacher-theme .brand-box { border-bottom-color: rgba(148, 163, 184, .16); }
      .sidebar.teacher-theme .brand-mark { background: linear-gradient(135deg, #51c4a3 0%, #318cb4 100%); box-shadow: 0 10px 20px rgba(22, 133, 107, .25); }

      .nav {
        display: flex;
        flex-direction: column;
        gap: 0.28rem;
        margin-top: 1.1rem;
      }

      .nav-item {
        display: flex;
        gap: 0.8rem;
        align-items: center;
        padding: 0.82rem 0.8rem;
        border-radius: 14px;
        text-decoration: none;
        color: #e3f0f1;
        font-weight: 600;
        transition: all 0.2s ease;
      }

      .sidebar.teacher-theme .nav-item { color: #e3f0f1; }

      .nav-item:hover,
      .nav-item.active {
        background: linear-gradient(110deg, rgba(59, 159, 190, .28), rgba(37, 166, 128, .25));
        color: #ffffff;
        transform: translateX(2px);
        box-shadow: inset 0 0 0 1px rgba(164, 224, 210, .28);
      }

      .sidebar.teacher-theme .nav-item:hover,
      .sidebar.teacher-theme .nav-item.active {
        background: linear-gradient(110deg, rgba(59, 159, 190, .24), rgba(37, 166, 128, .2));
        color: #ffffff;
        box-shadow: inset 0 0 0 1px rgba(122, 220, 190, .24);
      }

      .nav-icon {
        width: 20px;
        text-align: center;
        font-size: 1.05rem;
      }

      .sidebar.collapsed .brand-copy,
      .sidebar.collapsed .nav-label {
        display: none;
      }

      .sidebar.collapsed .brand-box {
        justify-content: center;
      }

      @media (max-width: 900px) {
        .sidebar {
          width: 100%;
          height: auto;
          min-height: 0;
          position: static;
          border-radius: 22px;
          margin-bottom: 0.9rem;
        }

        .nav {
          flex-wrap: wrap;
          flex-direction: row;
        }

        .nav-item {
          flex: 1 1 150px;
        }
      }
    `,
  ],
})
export class SidebarComponent {
  @Input() items: Array<{ route: string; label: string; icon: string; visible?: boolean }> = [];
  @Input() collapsed = false;
  @Input() teacherTheme = false;
  @Output() logout = new EventEmitter<void>();
}
