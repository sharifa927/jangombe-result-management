import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login/login';
import { LayoutComponent } from './layout/layout';
import { authGuard, adminGuard, teacherGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'admin/dashboard', canActivate: [adminGuard], loadComponent: () => import('./pages/admin/dashboard/dashboard').then((m) => m.AdminDashboardComponent) },
      { path: 'admin/teachers', canActivate: [adminGuard], loadComponent: () => import('./pages/admin/teachers/teachers').then((m) => m.TeacherManagementComponent) },
      { path: 'admin/classes', canActivate: [adminGuard], loadComponent: () => import('./pages/admin/classes/classes').then((m) => m.ClassManagementComponent) },
      { path: 'admin/subjects', canActivate: [adminGuard], loadComponent: () => import('./pages/admin/subjects/subjects').then((m) => m.SubjectManagementComponent) },
      { path: 'admin/assignments', canActivate: [adminGuard], loadComponent: () => import('./pages/admin/assignments/assignments').then((m) => m.AssignmentManagementComponent) },
      { path: 'admin/marks', canActivate: [adminGuard], loadComponent: () => import('./pages/admin/marks/marks').then((m) => m.AdminMarksComponent) },
      { path: 'admin/results', canActivate: [adminGuard], loadComponent: () => import('./pages/admin/results/results').then((m) => m.AdminResultsComponent) },
      { path: 'admin/submission-review/:id', canActivate: [adminGuard], loadComponent: () => import('./pages/admin/submission-review/submission-review').then((m) => m.SubmissionReviewComponent) },
      { path: 'teacher/dashboard', canActivate: [teacherGuard], loadComponent: () => import('./pages/teacher/dashboard/dashboard').then((m) => m.TeacherDashboardComponent) },
      { path: 'teacher/classes', canActivate: [teacherGuard], loadComponent: () => import('./pages/teacher/classes/classes').then((m) => m.TeacherClassesComponent) },
      { path: 'teacher/students', canActivate: [teacherGuard], loadComponent: () => import('./pages/teacher/students/students').then((m) => m.TeacherStudentsComponent) },
      { path: 'teacher/marks', canActivate: [teacherGuard], loadComponent: () => import('./pages/teacher/marks/marks').then((m) => m.TeacherMarksComponent) },
      { path: 'teacher/submissions', canActivate: [teacherGuard], loadComponent: () => import('./pages/teacher/submissions/submissions').then((m) => m.TeacherSubmissionsComponent) },
      { path: 'teacher/profile', canActivate: [teacherGuard], loadComponent: () => import('./pages/teacher/profile/profile').then((m) => m.TeacherProfileComponent) },
    ],
  },
  { path: '**', redirectTo: '/login' },
];
