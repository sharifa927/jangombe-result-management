import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SidebarComponent } from '../components/sidebar/sidebar';
import { TopbarComponent } from '../components/topbar/topbar';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, TopbarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="app-shell" *ngIf="authService.currentUser as user">
      <app-sidebar [items]="navItems"></app-sidebar>

      <main class="content-panel">
        <app-topbar
          [title]="pageTitle"
          [subtitle]="pageSubtitle"
          [userName]="user.firstName + ' ' + user.lastName"
          [userRole]="user.role === 'ADMIN' ? 'Admin' : 'Teacher'"
          [userInitials]="user.firstName.charAt(0) + user.lastName.charAt(0)"
          (toggleSidebar)="sidebarCollapsed = !sidebarCollapsed"
        ></app-topbar>

        <div class="page-body">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
        background: #f3f7fb;
      }
      .app-shell {
        display: flex;
        min-height: 100vh;
      }
      .content-panel {
        flex: 1;
        padding: 1.5rem;
      }
      .page-body {
        margin-top: 1.5rem;
      }
      @media (max-width: 900px) {
        .app-shell {
          display: block;
        }
        .content-panel {
          padding: 0.8rem;
        }
      }
    `,
  ],
})
export class LayoutComponent implements OnInit {
  sidebarCollapsed = false;
  pageTitle = 'Dashboard';
  pageSubtitle = 'School administration overview';
  navItems: Array<{ route: string; label: string; icon: string; visible?: boolean }> = [];

  constructor(
    public authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    this.updateNavItems();
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updatePageTitles();
        this.cdr.markForCheck();
      });
    this.updatePageTitles();
  }

  private updatePageTitles(): void {
    const url = this.router.url;
    if (url.includes('/admin/dashboard')) {
      this.pageTitle = 'Good morning, Admin';
      this.pageSubtitle = "Here's what's happening at Jang'ombe Secondary School today.";
    } else if (url.includes('/teacher/dashboard')) {
      this.pageTitle = 'Welcome back, Teacher Asha 👋';
      this.pageSubtitle = 'Track your classes, subjects, and students.';
    } else if (url.includes('/admin/teachers')) {
      this.pageTitle = 'Teacher Management';
      this.pageSubtitle = 'School administration overview';
    } else if (url.includes('/admin/classes')) {
      this.pageTitle = 'Class Management';
      this.pageSubtitle = 'School administration overview';
    } else if (url.includes('/admin/subjects')) {
      this.pageTitle = 'Subject Management';
      this.pageSubtitle = 'School administration overview';
    } else if (url.includes('/admin/assignments')) {
      this.pageTitle = 'Teacher Assignments';
      this.pageSubtitle = 'School administration overview';
    } else if (url.includes('/admin/marks')) {
      this.pageTitle = 'Mark Submissions';
      this.pageSubtitle = 'School administration overview';
    } else if (url.includes('/admin/results')) {
      this.pageTitle = 'Results';
      this.pageSubtitle = 'School administration overview';
    } else if (url.includes('/admin/reports')) {
      this.pageTitle = 'Reports';
      this.pageSubtitle = 'School administration overview';
    } else if (url.includes('/teacher/students')) {
      this.pageTitle = 'My Students';
      this.pageSubtitle = 'Manage the students assigned to your class.';
    } else if (url.includes('/teacher/marks')) {
      this.pageTitle = 'Enter Marks';
      this.pageSubtitle = 'Record marks and compute grade outcomes.';
    } else if (url.includes('/teacher/submissions')) {
      this.pageTitle = 'My Submissions';
      this.pageSubtitle = 'School administration overview';
    } else if (url.includes('/teacher/profile')) {
      this.pageTitle = 'Profile';
      this.pageSubtitle = 'School administration overview';
    }
  }

  private updateNavItems(): void {
    const user = this.authService.currentUser;
    if (!user) {
      this.navItems = [];
      return;
    }

    if (user.role === 'ADMIN') {
      this.navItems = [
        { route: '/admin/dashboard', label: 'Dashboard', icon: '🏠' },
        { route: '/admin/teachers', label: 'Teachers', icon: '👩‍🏫' },
        { route: '/admin/classes', label: 'Classes', icon: '🏫' },
        { route: '/admin/subjects', label: 'Subjects', icon: '📚' },
        { route: '/admin/assignments', label: 'Assignments', icon: '🗂️' },
        { route: '/admin/marks', label: 'Mark Submissions', icon: '📝' },
        { route: '/admin/results', label: 'Results', icon: '📊' },
        { route: '/admin/reports', label: 'Reports', icon: '📄' },
        { route: '/admin/settings', label: 'Settings', icon: '⚙️' },
        { route: '/login', label: 'Logout', icon: '🚪' },
      ];
    } else {
      this.navItems = [
        { route: '/teacher/dashboard', label: 'Dashboard', icon: '🏠' },
        { route: '/teacher/classes', label: 'My Classes', icon: '🎓' },
        { route: '/teacher/students', label: 'My Students', icon: '👨‍🎓' },
        { route: '/teacher/marks', label: 'Enter Marks', icon: '✏️' },
        { route: '/teacher/submissions', label: 'My Submissions', icon: '📤' },
        { route: '/teacher/profile', label: 'Profile', icon: '👤' },
        { route: '/login', label: 'Logout', icon: '🚪' },
      ];
    }
  }
}
