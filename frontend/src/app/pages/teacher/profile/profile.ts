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
          <p class="eyebrow">Teacher profile</p>
          <h2>Asha Ali</h2>
          <p class="role">Class & Subject Teacher</p>
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
      .card { background: linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%); border: 1px solid rgba(148,163,184,.15); border-radius: 22px; box-shadow: 0 12px 30px rgba(15,23,42,.04); }
      .profile-card { display: flex; align-items: center; gap: 1rem; padding: 1.3rem; background: linear-gradient(135deg, #0b1835 0%, #1636a8 52%, #60a5fa 100%); color: white; }
      .eyebrow { margin: 0; text-transform: uppercase; letter-spacing: .12em; font-size: .7rem; opacity: .8; }
      .avatar { width: 76px; height: 76px; border-radius: 50%; display: grid; place-items: center; background: rgba(255,255,255,0.18); border: 1px solid rgba(255,255,255,0.2); color: white; font-size: 1.4rem; font-weight: 800; }
      .profile-copy h2 { margin: .25rem 0 0; font-size: clamp(1.7rem, 2vw, 2.2rem); }
      .role { margin: .25rem 0 0; color: rgba(255,255,255,0.82); }
      .details-grid { display: grid; grid-template-columns: repeat(2, minmax(220px,1fr)); gap: 1rem; }
      .detail-card { padding: 1.2rem; }
      .detail-card h3 { margin-top: 0; }
      ul { list-style: none; padding: 0; margin: 0; }
      li { display: flex; justify-content: space-between; gap: 1rem; padding: .65rem 0; border-bottom: 1px solid #e2e8f0; }
      li span { color: #64748b; }
      @media (max-width: 760px) { .details-grid { grid-template-columns: 1fr; } }
    `,
  ],
})
export class TeacherProfileComponent {}
