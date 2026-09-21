import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teacher-classes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-shell">
      <div class="page-header">
        <div>
          <p class="eyebrow">My Classes</p>
          <h2>Assigned Classes</h2>
        </div>
      </div>

      <div class="summary-grid">
        <div class="mini-card">
          <span class="label">Teaching groups</span>
          <strong>{{ classes.length }}</strong>
        </div>
        <div class="mini-card">
          <span class="label">Total students</span>
          <strong>{{ totalStudents }}</strong>
        </div>
      </div>

      <div class="class-grid">
        <div class="class-card card" *ngFor="let item of classes">
          <div class="card-head">
            <span class="class-tag">{{ item.role }}</span>
            <h3>{{ item.name }}</h3>
          </div>

          <div class="meta-row">
            <div>
              <span class="meta-label">Students</span>
              <strong>{{ item.students }}</strong>
            </div>
            <div>
              <span class="meta-label">Status</span>
              <strong>Active</strong>
            </div>
          </div>

          <p>Academic records, attendance, and class performance remain up to date.</p>
          <button type="button" (click)="openClass(item.name)">Open class</button>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .page-shell { display: flex; flex-direction: column; gap: 1.2rem; }
      .page-header { margin-bottom: .2rem; }
      .eyebrow { margin: 0; font-size: .72rem; text-transform: uppercase; letter-spacing: .12em; color: #64748b; }
      h2 { margin: .25rem 0 0; font-size: clamp(1.5rem, 2vw, 2rem); }
      .summary-grid { display: grid; grid-template-columns: repeat(2, minmax(160px, 1fr)); gap: 1rem; }
      .mini-card { background: linear-gradient(135deg, #f8fbff 0%, #edf4ff 100%); border: 1px solid rgba(148,163,184,.18); border-radius: 18px; padding: 1rem 1.1rem; }
      .label { display: block; font-size: .74rem; color: #64748b; text-transform: uppercase; letter-spacing: .08em; }
      .mini-card strong { display: block; margin-top: .35rem; font-size: 1.7rem; letter-spacing: -.04em; }
      .class-grid { display: grid; grid-template-columns: repeat(2, minmax(220px, 1fr)); gap: 1rem; }
      .card { background: linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%); border: 1px solid rgba(148,163,184,.15); border-radius: 22px; box-shadow: 0 12px 30px rgba(15,23,42,.04); padding: 1.25rem; }
      .card-head { display: flex; flex-direction: column; gap: .5rem; }
      .class-tag { display: inline-flex; width: fit-content; background: linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%); color: #1d4ed8; padding: .4rem .7rem; border-radius: 999px; font-size: .72rem; font-weight: 700; }
      .class-card h3 { margin: .2rem 0 0; font-size: 1.4rem; }
      .meta-row { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .8rem; margin: 1rem 0; }
      .meta-label { display: block; color: #64748b; font-size: .74rem; margin-bottom: .2rem; }
      .meta-row strong { font-size: 1.2rem; }
      .class-card p { color: #475569; line-height: 1.6; margin: .5rem 0 1rem; }
      .class-card button { border: 0; background: linear-gradient(135deg, #1d4ed8, #3b82f6); color: white; border-radius: 12px; padding: .72rem 1rem; cursor: pointer; font-weight: 700; }
      @media (max-width: 760px) { .summary-grid, .class-grid { grid-template-columns: 1fr; } }
    `,
  ],
})
export class TeacherClassesComponent {
  constructor(private readonly router: Router) {}

  classes = [
    { name: 'Form 2A', students: 42, role: 'Class Teacher' },
    { name: 'Form 3B', students: 44, role: 'Subject Teacher' },
  ];

  get totalStudents(): number {
    return this.classes.reduce((sum, item) => sum + item.students, 0);
  }

  openClass(className: string): void {
    this.router.navigateByUrl('/teacher/students');
    console.log('Opened class', className);
  }
}
