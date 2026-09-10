import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-page">
      <div class="login-card">
        <div class="brand-panel">
          <div class="school-logo">JS</div>
          <h1>JANG’OMBE SECONDARY SCHOOL</h1>
          <p>Result & Grade Management System</p>
          <div class="brand-pills">
            <span>Admin Portal</span>
            <span>Teacher Portal</span>
          </div>
        </div>

        <form class="login-form" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-header">
            <p class="eyebrow">Welcome back</p>
            <h2>Sign in</h2>
          </div>

          <label class="field">
            <span>Email or Username</span>
            <input type="text" formControlName="email" placeholder="admin@jangombe.ac.tz" />
          </label>

          <label class="field password-field">
            <span>Password</span>
            <div class="password-wrap">
              <input [type]="showPassword ? 'text' : 'password'" formControlName="password" placeholder="••••••••" />
              <button type="button" class="toggle-password" (click)="showPassword = !showPassword">
                {{ showPassword ? 'Hide' : 'Show' }}
              </button>
            </div>
          </label>

          <div class="form-row">
            <label class="remember-me"><input type="checkbox" formControlName="remember" /> Remember me</label>
            <a href="javascript:void(0)">Forgot password?</a>
          </div>

          <div class="error-box" *ngIf="errorMessage">{{ errorMessage }}</div>

          <button class="login-btn" type="submit" [disabled]="loginForm.invalid || loading">
            {{ loading ? 'Signing in...' : 'Login' }}
          </button>

          <div class="demo-credentials">
            <p>Demo accounts</p>
            <small>Admin: admin@jangombe.ac.tz / admin123</small>
            <small>Teacher: asha.ali@jangombe.school / school123</small>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .login-page {
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 2rem;
        background: radial-gradient(circle at top left, #e0ecff 0%, #f8fafc 28%, #eef4ff 100%);
      }
      .login-card {
        display: grid;
        grid-template-columns: 1.2fr 1fr;
        width: min(1100px, 100%);
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid rgba(148, 163, 184, 0.18);
        border-radius: 28px;
        box-shadow: 0 30px 70px rgba(15, 23, 42, 0.12);
        overflow: hidden;
      }
      .brand-panel {
        background: linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%);
        color: white;
        padding: 3rem 2.25rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .school-logo {
        width: 70px;
        height: 70px;
        display: grid;
        place-items: center;
        border-radius: 20px;
        background: rgba(255, 255, 255, 0.15);
        font-size: 1.6rem;
        font-weight: 800;
        margin-bottom: 1.2rem;
      }
      .brand-panel h1 {
        font-size: clamp(1.8rem, 3vw, 2.8rem);
        margin: 0;
        line-height: 1.2;
      }
      .brand-panel p {
        margin-top: 0.7rem;
        color: rgba(255,255,255,0.82);
        font-size: 1.05rem;
      }
      .brand-pills {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        margin-top: 1.5rem;
      }
      .brand-pills span {
        padding: 0.5rem 0.85rem;
        background: rgba(255,255,255,0.12);
        border-radius: 999px;
        font-size: 0.8rem;
      }
      .login-form {
        background: white;
        padding: 2.2rem 2rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .eyebrow {
        margin: 0;
        font-size: 0.7rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: #64748b;
      }
      h2 {
        margin: 0.4rem 0 1.5rem;
        font-size: 2rem;
      }
      .field {
        display: flex;
        flex-direction: column;
        gap: 0.45rem;
        margin-bottom: 1rem;
      }
      .field span {
        font-weight: 600;
        color: #334155;
      }
      input {
        width: 100%;
        border: 1px solid #d7e1ef;
        border-radius: 12px;
        padding: 0.9rem 1rem;
        font: inherit;
      }
      input:focus {
        outline: 3px solid rgba(59, 130, 246, 0.12);
        border-color: #3b82f6;
      }
      .password-wrap {
        display: flex;
        align-items: center;
        border: 1px solid #d7e1ef;
        border-radius: 12px;
        overflow: hidden;
      }
      .password-wrap input {
        border: 0;
        border-radius: 0;
      }
      .toggle-password {
        border: 0;
        background: transparent;
        color: #3b82f6;
        padding: 0 1rem;
        font-weight: 600;
        cursor: pointer;
      }
      .form-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        margin: 0.2rem 0 1rem;
      }
      .remember-me {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        color: #475569;
      }
      .form-row a {
        color: #2563eb;
        text-decoration: none;
      }
      .error-box {
        background: #fef2f2;
        color: #b91c1c;
        border: 1px solid #fecaca;
        border-radius: 10px;
        padding: 0.8rem 0.9rem;
        margin: 0 0 1rem;
      }
      .login-btn {
        border: 0;
        border-radius: 12px;
        background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%);
        color: white;
        font-weight: 700;
        padding: 1rem;
        cursor: pointer;
        transition: transform 0.2s ease;
      }
      .login-btn:hover:not(:disabled) {
        transform: translateY(-1px);
      }
      .login-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
      .demo-credentials {
        margin-top: 1.2rem;
        border-top: 1px solid #e2e8f0;
        padding-top: 1rem;
      }
      .demo-credentials p {
        margin: 0 0 0.5rem;
        font-weight: 700;
      }
      .demo-credentials small {
        display: block;
        color: #475569;
        margin-bottom: 0.2rem;
      }
      @media (max-width: 760px) {
        .login-card {
          grid-template-columns: 1fr;
        }
        .brand-panel {
          padding: 2rem 1.5rem;
        }
        .login-form {
          padding: 1.5rem 1.2rem;
        }
      }
    `,
  ],
})
export class LoginPageComponent {
  showPassword = false;
  loading = false;
  errorMessage = '';
  loginForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [true],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.errorMessage = 'Please enter a valid email and password.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    this.authService.login(email ?? '', password ?? '').subscribe((result) => {
      this.loading = false;

      if (!result) {
        this.errorMessage = 'Invalid credentials. Please try the demo login details shown below.';
        return;
      }

      const user = this.authService.currentUser;
      if (user?.role === 'ADMIN') {
        this.router.navigateByUrl('/admin/dashboard');
      } else {
        this.router.navigateByUrl('/teacher/dashboard');
      }
    });
  }
}
