import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SidebarComponent } from '../components/sidebar/sidebar';
import { TopbarComponent } from '../components/topbar/topbar';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, TopbarComponent],
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
export class LayoutComponent {
  sidebarCollapsed = false;

  constructor(
    public authService: AuthService,
    private router: Router,
  ) {}

  get pageTitle(): string {
    const url = this.router.url;
    if (url.includes('/admin/dashboard')) return 'Good morning, Admin';
    if (url.includes('/teacher/dashboard')) return 'Welcome back, Teacher Asha 👋';
    if (url.includes('/admin/teachers')) return 'Teacher Management';
    if (url.includes('/admin/classes')) return 'Class Management';
    if (url.includes('/admin/subjects')) return 'Subject Management';
    if (url.includes('/admin/assignments')) return 'Teacher Assignments';
    if (url.includes('/admin/marks')) return 'Mark Submissions';
    if (url.includes('/admin/results')) return 'Results';
    if (url.includes('/admin/reports')) return 'Reports';
    if (url.includes('/teacher/students')) return 'My Students';
    if (url.includes('/teacher/marks')) return 'Enter Marks';
    if (url.includes('/teacher/submissions')) return 'My Submissions';
    if (url.includes('/teacher/profile')) return 'Profile';
    return 'Dashboard';
  }

  get pageSubtitle(): string {
    const url = this.router.url;
    if (url.includes('/admin/dashboard')) return "Here's what's happening at Jang’ombe Secondary School today.";
    if (url.includes('/teacher/dashboard')) return 'Track your classes, subjects, and students.';
    if (url.includes('/teacher/students')) return 'Manage the students assigned to your class.';
    if (url.includes('/teacher/marks')) return 'Record marks and compute grade outcomes.';
    return 'School administration overview';
  }

  get navItems(): Array<{ route: string; label: string; icon: string; visible?: boolean }> {
    const user = this.authService.currentUser;
    if (!user) {
      return [];
    }

    if (user.role === 'ADMIN') {
      return [
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
    }

    return [
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
