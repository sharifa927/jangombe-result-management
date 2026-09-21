import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-shell">
      <div class="page-header">
        <div>
          <p class="eyebrow">Preferences</p>
          <h2>Settings</h2>
        </div>
      </div>

      <div class="settings-grid">
        <div class="card">
          <h3>School Information</h3>
          <ul>
            <li>School name: Jang’ombe Secondary School</li>
            <li>Academic year: 2026</li>
            <li>Term: Term 1</li>
          </ul>
        </div>
        <div class="card">
          <h3>System Defaults</h3>
          <ul>
            <li>Mark entry window: Active</li>
            <li>Email notifications: Enabled</li>
            <li>Result publishing: Locked</li>
          </ul>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .page-shell { display: flex; flex-direction: column; gap: 1.2rem; }
      .page-header { margin-bottom: .3rem; }
      .eyebrow { margin: 0; font-size: .72rem; text-transform: uppercase; letter-spacing: .12em; color: #64748b; }
      h2 { margin: .25rem 0 0; font-size: clamp(1.5rem, 2vw, 2rem); }
      .settings-grid { display: grid; grid-template-columns: repeat(2, minmax(220px,1fr)); gap: 1rem; }
      .card { background: linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%); border: 1px solid rgba(148,163,184,.15); border-radius: 22px; box-shadow: 0 12px 30px rgba(15,23,42,.04); padding: 1.2rem; }
      ul { margin: 0; padding-left: 1.2rem; color: #475569; line-height: 1.8; }
      @media (max-width: 760px) { .settings-grid { grid-template-columns: 1fr; } }
    `,
  ],
})
export class AdminSettingsComponent {}
