import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="topbar" [class.teacher-theme]="teacherTheme">
      <div class="topbar-left">
        <button class="menu-toggle" type="button" (click)="toggleSidebar.emit()">☰</button>
        <div>
          <h1>{{ title }}</h1>
          <p>{{ subtitle }}</p>
        </div>
      </div>

      <div class="topbar-actions">
        <div class="account-menu-anchor">
          <button
            class="user-pill"
            type="button"
            aria-haspopup="menu"
            [attr.aria-expanded]="menuOpen"
            [attr.aria-label]="menuOpen ? 'Close account menu' : 'Open account menu'"
            (click)="menuOpen = !menuOpen"
          >
            <span class="user-avatar">{{ userInitials }}</span>
            <span class="user-copy">
              <strong>{{ userName }}</strong>
              <small>{{ userRole }}</small>
            </span>
            <span class="menu-caret" [class.open]="menuOpen" aria-hidden="true">⌄</span>
          </button>
          <div *ngIf="menuOpen" class="account-menu" role="menu">
            <div class="menu-identity">
              <span class="menu-avatar">{{ userInitials }}</span>
              <div class="identity-copy">
                <strong>{{ userName }}</strong>
                <small>{{ userEmail }}</small>
              </div>
              <span class="menu-role">{{ userRole }}</span>
            </div>
            <button *ngIf="userRole.toLowerCase() !== 'admin'" type="button" role="menuitem" (click)="openProfile()"><span aria-hidden="true">◎</span> Profile</button>
            <button type="button" role="menuitem" class="logout-item" (click)="closeMenu(); logout.emit()"><span aria-hidden="true">↪</span> Logout</button>
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
        position: relative;
        z-index: 30;
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

      .topbar.teacher-theme { border-color: rgba(22, 133, 107, .18); box-shadow: 0 12px 26px rgba(21, 85, 115, .08); }

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

      .topbar.teacher-theme .menu-toggle { background: linear-gradient(135deg, #e2f1f7 0%, #e5f5ed 100%); color: #14745f; box-shadow: inset 0 0 0 1px rgba(22, 133, 107, .12); }

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
        gap: 0.75rem;
      }

      .account-menu-anchor { position: relative; z-index: 20; }

      .user-pill {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        color: #18313a;
        font: inherit;
        text-align: left;
        cursor: pointer;
        background: linear-gradient(135deg, #f8fbff 0%, #eaf2ff 100%);
        border: 1px solid rgba(59, 130, 246, .16);
        border-radius: 16px;
        padding: 0.42rem 0.72rem;
        box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.08);
        transition: background .16s ease, border-color .16s ease, box-shadow .16s ease;
      }

      .user-pill:hover, .user-pill[aria-expanded="true"] { background: #fff; border-color: rgba(37, 99, 235, .36); box-shadow: 0 5px 16px rgba(30, 64, 175, .1); }
      .user-pill:focus-visible, .account-menu > button:focus-visible { outline: 3px solid rgba(37, 99, 235, .3); outline-offset: 2px; }

      .user-avatar {
        display: grid;
        place-items: center;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background: linear-gradient(135deg, #51c4a3 0%, #318cb4 100%);
        color: #fff;
        font-weight: 700;
        box-shadow: 0 8px 18px rgba(49, 140, 180, 0.26);
      }

      .topbar.teacher-theme .user-avatar { background: var(--teacher-gradient, linear-gradient(120deg, #1f6384 0%, #21806d 100%)); box-shadow: 0 8px 18px rgba(31, 99, 132, .24); }

      .topbar.teacher-theme .user-pill { background: linear-gradient(120deg, #f0f7fa, #eaf5ef); border-color: rgba(37, 133, 107, .2); }
      .topbar.teacher-theme .user-pill:hover, .topbar.teacher-theme .user-pill[aria-expanded="true"] { border-color: rgba(37, 133, 107, .4); }
      .topbar.teacher-theme .user-pill:focus-visible, .topbar.teacher-theme .account-menu > button:focus-visible { outline-color: rgba(37, 133, 107, .3); }

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

      .menu-caret { color: #526b73; font-size: 1rem; transition: transform .16s ease; }
      .menu-caret.open { transform: rotate(180deg); }
      .account-menu { position: absolute; z-index: 1; top: calc(100% + .65rem); right: 0; width: min(280px, calc(100vw - 2rem)); padding: .5rem; border: 1px solid #dbe4ef; border-radius: 14px; background: #fff; box-shadow: 0 18px 44px rgba(15, 23, 42, .18); animation: menu-enter .14s ease-out; }
      @keyframes menu-enter { from { opacity: 0; transform: translateY(-5px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
      .menu-identity { display: flex; align-items: center; gap: .65rem; min-width: 0; padding: .65rem; margin-bottom: .35rem; border-bottom: 1px solid #e8edf3; }
      .menu-avatar { display: grid; place-items: center; flex: 0 0 38px; width: 38px; height: 38px; border-radius: 11px; background: #e8efff; color: #1d4ed8; font-size: .8rem; font-weight: 800; }
      .topbar.teacher-theme .menu-avatar { background: linear-gradient(120deg, #e6f1f7, #e4f3eb); color: #1b6e5b; }
      .identity-copy { min-width: 0; flex: 1; }
      .menu-identity strong, .menu-identity small { display: block; }
      .menu-identity strong { overflow: hidden; color: #18313a; font-size: .84rem; text-overflow: ellipsis; white-space: nowrap; }
      .menu-identity small { margin-top: .18rem; overflow: hidden; color: #647986; font-size: .7rem; text-overflow: ellipsis; white-space: nowrap; }
      .menu-role { flex: 0 0 auto; padding: .22rem .4rem; border-radius: 5px; background: #f1f5f9; color: #526174; font-size: .62rem; font-weight: 800; text-transform: uppercase; }
      .account-menu > button { display: flex; align-items: center; gap: .65rem; width: 100%; min-height: 40px; padding: .6rem .7rem; border: 0; border-radius: 8px; background: transparent; color: #26424d; cursor: pointer; font: inherit; font-size: .84rem; text-align: left; transition: background .14s ease, color .14s ease; }
      .account-menu > button:hover { background: #f1f5fa; }
      .account-menu > button span { width: 1.1rem; color: #2563eb; text-align: center; }
      .topbar.teacher-theme .account-menu > button span { color: #25856b; }
      .account-menu > .logout-item { margin-top: .25rem; border-top: 1px solid #edf1f5; border-radius: 0 0 8px 8px; color: #a33b3b; }
      .account-menu > .logout-item:hover { background: #fff1f0; }
      .account-menu > .logout-item span { color: #a33b3b; }
      @media (max-width: 720px) {
        .topbar {
          padding: 0.9rem 1rem;
        }

        .topbar-actions {
          gap: 0.4rem;
        }

        .user-pill { padding: 0.32rem 0.5rem; }
        .user-copy { display: none; }
        .account-menu { right: -3rem; }
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
  @Input() userEmail = '';
  @Input() teacherTheme = false;
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  menuOpen = false;

  constructor(
    private readonly router: Router,
    private readonly elementRef: ElementRef<HTMLElement>,
  ) {}

  @HostListener('document:click', ['$event'])
  closeOnOutsideClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.closeMenu();
    }
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  openProfile(): void {
    this.closeMenu();
    if (this.userRole.toLowerCase() === 'teacher') {
      this.router.navigateByUrl('/teacher/profile');
    }
  }

}
