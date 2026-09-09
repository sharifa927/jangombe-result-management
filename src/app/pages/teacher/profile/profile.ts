import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-teacher-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-shell">
      <div class="profile-card card">
        <div class="avatar">AA</div>
        <div class="profile-copy">
          <h2>Asha Ali</h2>
          <p>Teacher</p>
        </div>
      </div>

      <div class="details-grid">
        <div class="card detail-card">
          <h3>Profile Information</h3>
          <ul>
            <li><span>Email</span><strong>teacher@jangombe.ac.tz</strong></li>
            <li><span>Phone</span><strong>+255 712 123 456</strong></li>
            <li><span>Role</span><strong>Class & Subject Teacher</strong></li>
          </ul>
        </div>
        <div class="card detail-card">
          <h3>Assignments</h3>
          <ul>
            <li><span>Classes</span><strong>Form 2A, Form 3B</strong></li>
            <li><span>Subjects</span><strong>Mathematics, Physics, Computer Science</strong></li>
          </ul>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .page-shell { display: flex; flex-direction: column; gap: 1.2rem; }
      .card { background: white; border: 1px solid rgba(148,163,184,.15); border-radius: 18px; box-shadow: 0 8px 22px rgba(15,23,42,.04); }
      .profile-card { display: flex; align-items: center; gap: 1rem; padding: 1.2rem; }
      .avatar { width: 70px; height: 70px; border-radius: 50%; display: grid; place-items: center; background: linear-gradient(135deg, #1d4ed8, #60a5fa); color: white; font-size: 1.4rem; font-weight: 800; }
      .profile-copy h2 { margin: 0; }
      .profile-copy p { margin: .2rem 0 0; color: #64748b; }
      .details-grid { display: grid; grid-template-columns: repeat(2, minmax(220px,1fr)); gap: 1rem; }
      .detail-card { padding: 1.2rem; }
      .detail-card h3 { margin-top: 0; }
      ul { list-style: none; padding: 0; margin: 0; }
      li { display: flex; justify-content: space-between; gap: 1rem; padding: .55rem 0; border-bottom: 1px solid #e2e8f0; }
      li span { color: #64748b; }
      @media (max-width: 760px) { .details-grid { grid-template-columns: 1fr; } }
    `,
  ],
})
export class TeacherProfileComponent {}
