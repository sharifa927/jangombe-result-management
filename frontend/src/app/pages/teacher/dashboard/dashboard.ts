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
      .dashboard-shell {
        display: flex;
        flex-direction: column;
        gap: 1.2rem;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
        gap: 1rem;
      }

      .content-grid {
        display: grid;
        grid-template-columns: 1.3fr 0.7fr;
        gap: 1.2rem;
      }

      .panel {
        background: linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,250,252,0.96) 100%);
        border: 1px solid rgba(148,163,184,0.15);
        border-radius: 24px;
        box-shadow: var(--shadow-soft);
        padding: 1.2rem;
      }

      .panel-header h3 {
        margin-top: 0;
      }

      .class-list, .subject-list {
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
      }

      .class-card {
        display: grid;
        grid-template-columns: 1.3fr 0.7fr auto;
        align-items: center;
        gap: 0.7rem;
        border: 1px solid #e2e8f0;
        border-radius: 14px;
        padding: 0.9rem;
        background: rgba(248,250,252,0.6);
      }

      .class-card h4 {
        margin: 0;
      }

      .class-card p {
        margin: 0.25rem 0 0;
        color: #64748b;
      }

      .class-card span {
        background: #eff6ff;
        color: #1d4ed8;
        padding: 0.35rem 0.6rem;
        border-radius: 999px;
        font-size: 0.75rem;
        font-weight: 700;
      }

      .class-card button, .subject-item button {
        border: none;
        background: linear-gradient(135deg, #1d4ed8, #3b82f6);
        color: white;
        border-radius: 10px;
        padding: 0.55rem 0.8rem;
        cursor: pointer;
      }

      .subject-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 0.8rem;
        background: rgba(248,250,252,0.6);
      }

      @media (max-width: 980px) {
        .stats-grid {
          grid-template-columns: repeat(2, minmax(150px, 1fr));
        }

        .content-grid {
          grid-template-columns: 1fr;
        }
      }
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
