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

      <div class="class-grid">
        <div class="class-card card" *ngFor="let item of classes">
          <div class="card-head">
            <span class="class-tag">{{ item.role }}</span>
            <h3>{{ item.name }}</h3>
          </div>
          <p>{{ item.students }} Students</p>
          <button type="button" (click)="openClass(item.name)">View Class</button>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .page-shell { display: flex; flex-direction: column; gap: 1.2rem; }
      .page-header { margin-bottom: .4rem; }
      .eyebrow { margin: 0; font-size: .72rem; text-transform: uppercase; letter-spacing: .12em; color: #64748b; }
      h2 { margin: .25rem 0 0; }
      .class-grid { display: grid; grid-template-columns: repeat(2, minmax(200px, 1fr)); gap: 1rem; }
      .card { background: white; border: 1px solid rgba(148,163,184,.15); border-radius: 18px; box-shadow: 0 8px 22px rgba(15,23,42,.04); padding: 1.2rem; }
      .card-head { display: flex; flex-direction: column; gap: .5rem; }
      .class-tag { display: inline-flex; width: fit-content; background: #eff6ff; color: #1d4ed8; padding: .35rem .6rem; border-radius: 999px; font-size: .72rem; font-weight: 700; }
      .class-card h3 { margin: .2rem 0 0; }
      .class-card p { color: #64748b; }
      .class-card button { border: 0; background: linear-gradient(135deg, #1d4ed8, #3b82f6); color: white; border-radius: 10px; padding: .6rem .9rem; cursor: pointer; }
      @media (max-width: 760px) { .class-grid { grid-template-columns: 1fr; } }
    `,
  ],
})
export class TeacherClassesComponent {
  constructor(private readonly router: Router) {}

  classes = [
    { name: 'Form 2A', students: 42, role: 'Class Teacher' },
    { name: 'Form 3B', students: 44, role: 'Subject Teacher' },
  ];

  openClass(className: string): void {
    this.router.navigateByUrl('/teacher/students');
    console.log('Opened class', className);
  }
}
