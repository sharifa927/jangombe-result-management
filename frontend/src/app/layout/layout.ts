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
      <app-sidebar [items]="navItems" [collapsed]="sidebarCollapsed"></app-sidebar>

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
        background: linear-gradient(180deg, #f5f8ff 0%, #eef4ff 100%);
      }

      .app-shell {
        display: flex;
        align-items: flex-start;
        min-height: 100vh;
        gap: 1.2rem;
        padding: 1.1rem;
      }

      .content-panel {
        flex: 1;
        min-width: 0;
        padding: 0.2rem 0.2rem 1.2rem;
      }

      .page-body {
        margin-top: 1rem;
      }

      @media (max-width: 900px) {
        .app-shell {
          display: block;
          padding: 0.8rem;
          gap: 0;
        }

        .content-panel {
          padding: 0.1rem 0 0.8rem;
        }
      }
    `,
  ],
})
export class LayoutComponent implements OnInit {
  sidebarCollapsed = false;
  pageTitle = 'Dashboard';
  pageSubtitle = 'Operations overview';
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
      this.pageTitle = 'Administrative dashboard';
      this.pageSubtitle = 'Overview of school operations and key updates';
    } else if (url.includes('/teacher/dashboard')) {
      this.pageTitle = 'Academic dashboard';
      this.pageSubtitle = 'Teaching activity, class progress, and performance';
    } else if (url.includes('/admin/teachers')) {
      this.pageTitle = 'Teacher Management';
      this.pageSubtitle = 'Staff records, assignments, and coordination';
    } else if (url.includes('/admin/classes')) {
      this.pageTitle = 'Class Management';
      this.pageSubtitle = 'Class allocation and academic grouping';
    } else if (url.includes('/admin/subjects')) {
      this.pageTitle = 'Subject Management';
      this.pageSubtitle = 'Curriculum planning and subject oversight';
    } else if (url.includes('/admin/assignments')) {
      this.pageTitle = 'Teacher Assignments';
      this.pageSubtitle = 'Load distribution and teaching coverage';
    } else if (url.includes('/admin/marks')) {
      this.pageTitle = 'Mark Submissions';
      this.pageSubtitle = 'Review of assessment entries and approvals';
    } else if (url.includes('/admin/results')) {
      this.pageTitle = 'Results';
      this.pageSubtitle = 'Performance summaries and learner outcomes';
    } else if (url.includes('/admin/reports')) {
      this.pageTitle = 'Reports';
      this.pageSubtitle = 'School insights and reporting summaries';
    } else if (url.includes('/teacher/students')) {
      this.pageTitle = 'My Students';
      this.pageSubtitle = 'Student records and class tracking';
    } else if (url.includes('/teacher/marks')) {
      this.pageTitle = 'Enter Marks';
      this.pageSubtitle = 'Score recording and academic grading';
    } else if (url.includes('/teacher/submissions')) {
      this.pageTitle = 'My Submissions';
      this.pageSubtitle = 'Submitted work and review status';
    } else if (url.includes('/teacher/profile')) {
      this.pageTitle = 'Profile';
      this.pageSubtitle = 'Teacher profile and contact details';
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
