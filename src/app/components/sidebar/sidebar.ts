import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar" [class.collapsed]="collapsed">
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
            [routerLink]="item.route"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
            class="nav-item"
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
        height: 100%;
      }

      .sidebar {
        width: 260px;
        background: linear-gradient(180deg, #0f172a 0%, #111827 100%);
        color: #e5eefb;
        padding: 1.2rem 1rem;
        box-shadow: 8px 0 28px rgba(15, 23, 42, 0.08);
        height: 100vh;
        position: sticky;
        top: 0;
        transition: width 0.2s ease;
      }

      .sidebar.collapsed {
        width: 88px;
      }

      .brand-box {
        display: flex;
        align-items: center;
        gap: 0.9rem;
        padding: 0.8rem 0.6rem 1.4rem;
        border-bottom: 1px solid rgba(148, 163, 184, 0.2);
      }

      .brand-mark {
        width: 46px;
        height: 46px;
        display: grid;
        place-items: center;
        border-radius: 14px;
        background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%);
        font-weight: 700;
      }

      .brand-copy h2 {
        margin: 0;
        font-size: 0.9rem;
        letter-spacing: 0.08em;
      }

      .brand-copy small {
        color: #b6d1f9;
      }

      .nav {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        margin-top: 1.2rem;
      }

      .nav-item {
        display: flex;
        gap: 0.8rem;
        align-items: center;
        padding: 0.8rem 0.9rem;
        border-radius: 12px;
        text-decoration: none;
        color: #dfe9ff;
        font-weight: 600;
        transition: all 0.2s ease;
      }

      .nav-item:hover,
      .nav-item.active {
        background: rgba(96, 165, 250, 0.18);
        color: #fff;
      }

      .nav-icon {
        width: 20px;
        text-align: center;
      }

      .sidebar.collapsed .brand-copy,
      .sidebar.collapsed .nav-label {
        display: none;
      }

      @media (max-width: 900px) {
        .sidebar {
          width: 100%;
          height: auto;
          position: static;
        }

        .nav {
          flex-wrap: wrap;
          flex-direction: row;
        }
      }
    `,
  ],
})
export class SidebarComponent {
  @Input() items: Array<{ route: string; label: string; icon: string; visible?: boolean }> = [];
  @Input() collapsed = false;
}
