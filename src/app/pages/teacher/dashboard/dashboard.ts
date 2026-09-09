import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardCardComponent } from '../../../components/dashboard-card/dashboard-card';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, DashboardCardComponent],
  template: `
    <section class="dashboard-shell">
      <div class="hero-card">
        <div>
          <p class="eyebrow">Teacher overview</p>
          <h2>Welcome back, Teacher Asha 👋</h2>
        </div>
      </div>

      <div class="stats-grid">
        <app-dashboard-card label="Assigned Classes" value="2" icon="🏫" trend="Active" tone="info"></app-dashboard-card>
        <app-dashboard-card label="Assigned Subjects" value="3" icon="📚" trend="Current" tone="success"></app-dashboard-card>
        <app-dashboard-card label="Students" value="86" icon="👨‍🎓" trend="+8" tone="warning"></app-dashboard-card>
        <app-dashboard-card label="Pending Marks" value="12" icon="📝" trend="Review" tone="danger"></app-dashboard-card>
        <app-dashboard-card label="Submitted Marks" value="48" icon="✅" trend="This term" tone="success"></app-dashboard-card>
      </div>

      <div class="content-grid">
        <div class="panel">
          <div class="panel-header">
            <h3>My Classes</h3>
          </div>

          <div class="class-list">
            <div class="class-card" *ngFor="let item of classes">
              <div>
                <h4>{{ item.name }}</h4>
                <p>{{ item.students }} Students</p>
              </div>
              <span>{{ item.role }}</span>
              <button type="button" (click)="goTo('/teacher/students')">View Class</button>
            </div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-header">
            <h3>My Subjects</h3>
          </div>
          <div class="subject-list">
            <div class="subject-item" *ngFor="let subject of subjects">
              <strong>{{ subject.name }}</strong>
              <button type="button" (click)="goTo('/teacher/marks')">Open</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .dashboard-shell { display: flex; flex-direction: column; gap: 1.2rem; }
      .hero-card { background: linear-gradient(135deg, #1d4ed8 0%, #0f172a 100%); color: white; border-radius: 20px; padding: 1.5rem; }
      .eyebrow { margin:0; text-transform: uppercase; letter-spacing: .12em; font-size: .7rem; opacity: .8; }
      h2 { margin: .4rem 0 0; font-size: clamp(1.5rem, 2.4vw, 2.3rem); }
      .stats-grid { display: grid; grid-template-columns: repeat(5, minmax(150px,1fr)); gap: 1rem; }
      .content-grid { display: grid; grid-template-columns: 1.3fr .7fr; gap: 1.2rem; }
      .panel { background: white; border: 1px solid rgba(148,163,184,.15); border-radius: 18px; box-shadow: 0 8px 22px rgba(15,23,42,.04); padding: 1.2rem; }
      .panel-header h3 { margin-top: 0; }
      .class-list, .subject-list { display: flex; flex-direction: column; gap: .8rem; }
      .class-card { display: grid; grid-template-columns: 1.3fr .7fr auto; align-items: center; gap: .7rem; border: 1px solid #e2e8f0; border-radius: 14px; padding: .9rem; }
      .class-card h4 { margin: 0; }
      .class-card p { margin: .25rem 0 0; color: #64748b; }
      .class-card span { background: #eff6ff; color: #1d4ed8; padding: .35rem .6rem; border-radius: 999px; font-size: .75rem; font-weight: 700; }
      .class-card button, .subject-item button { border: none; background: linear-gradient(135deg, #1d4ed8, #3b82f6); color: white; border-radius: 10px; padding: .55rem .8rem; cursor: pointer; }
      .subject-item { display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0; border-radius: 12px; padding: .8rem; }
      @media (max-width: 980px) { .stats-grid { grid-template-columns: repeat(2, minmax(150px,1fr)); } .content-grid { grid-template-columns: 1fr; } }
    `,
  ],
})
export class TeacherDashboardComponent {
  constructor(private readonly router: Router) {}

  goTo(route: string): void {
    this.router.navigateByUrl(route);
  }

  classes = [
    { name: 'Form 2A', students: 42, role: 'Class Teacher' },
    { name: 'Form 3B', students: 44, role: 'Subject Teacher' },
  ];

  subjects = [
    { name: 'Mathematics' },
    { name: 'Physics' },
    { name: 'Computer Science' },
  ];
}
