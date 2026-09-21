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
        width: 270px;
        background: linear-gradient(180deg, #091426 0%, #111827 100%);
        color: #eaf2ff;
        padding: 1rem 0.8rem 1.1rem;
        box-shadow: 18px 0 36px rgba(15, 23, 42, 0.14);
        height: calc(100vh - 2.2rem);
        border-radius: 28px;
        position: sticky;
        top: 1rem;
        transition: width 0.22s ease;
        border: 1px solid rgba(148, 163, 184, 0.15);
      }

      .sidebar.collapsed {
        width: 92px;
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
        background: linear-gradient(135deg, #60a5fa 0%, #1d4ed8 100%);
        font-weight: 800;
        font-size: 0.85rem;
        box-shadow: 0 12px 22px rgba(59, 130, 246, 0.35);
      }

      .brand-copy h2 {
        margin: 0;
        font-size: 0.82rem;
        letter-spacing: 0.12em;
      }

      .brand-copy small {
        display: block;
        margin-top: 0.1rem;
        color: #bfd3ff;
        letter-spacing: 0.04em;
      }

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
        color: #dfeaff;
        font-weight: 600;
        transition: all 0.2s ease;
      }

      .nav-item:hover,
      .nav-item.active {
        background: linear-gradient(135deg, rgba(96, 165, 250, 0.18), rgba(37, 99, 235, 0.12));
        color: #ffffff;
        transform: translateX(2px);
        box-shadow: inset 0 0 0 1px rgba(147, 197, 253, 0.18);
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
}
