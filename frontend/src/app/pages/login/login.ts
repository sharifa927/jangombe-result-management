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
    <main class="login-page">
      <div class="login-card">
        <div class="brand-panel">
          <img class="campus-photo" src="/school_photo.jpeg" alt="Jang'ombe Secondary School campus" />
          <div class="school-logo" aria-label="Jang'ombe School">JS</div>
          <div class="brand-copy">
            <span class="brand-kicker">School portal</span>
            <h1>JANG'OMBE<br />SECONDARY SCHOOL</h1>
            <p>RESULT AND GRADE MANAGEMENT SYSTEM</p>
          </div>
          <div class="brand-pills">
            <span>Admin</span>
            <span>Teachers</span>
          </div>
        </div>

        <form class="login-form" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-header">
            <p class="eyebrow">{{ isRegistering ? 'Teacher access' : 'Welcome back' }}</p>
            <h2>{{ isRegistering ? 'Create your account' : 'Sign in' }}</h2>
          </div>

          <div *ngIf="isRegistering" [formGroup]="registerForm">
            <label class="field">
              <span>First name</span>
              <input type="text" formControlName="firstName" autocomplete="given-name" [attr.aria-invalid]="registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched" />
              <small class="field-error" *ngIf="registerForm.get('firstName')?.hasError('required') && registerForm.get('firstName')?.touched" role="alert">First name is required.</small>
            </label>
            <label class="field">
              <span>Last name</span>
              <input type="text" formControlName="lastName" autocomplete="family-name" [attr.aria-invalid]="registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched" />
              <small class="field-error" *ngIf="registerForm.get('lastName')?.hasError('required') && registerForm.get('lastName')?.touched" role="alert">Last name is required.</small>
            </label>
            <label class="field">
              <span>Email (@gmail.com)</span>
              <input type="email" formControlName="email" autocomplete="email" placeholder="name@gmail.com" [attr.aria-invalid]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched" />
              <small class="field-error" *ngIf="registerForm.get('email')?.hasError('required') && registerForm.get('email')?.touched" role="alert">Email is required.</small>
              <small class="field-error" *ngIf="registerForm.get('email')?.hasError('email') && registerForm.get('email')?.touched" role="alert">Enter a valid email address.</small>
              <small class="field-error" *ngIf="registerForm.get('email')?.hasError('pattern') && registerForm.get('email')?.touched" role="alert">Use an @gmail.com email address.</small>
            </label>
            <label class="field">
              <span>Phone (optional)</span>
              <input type="tel" formControlName="phone" autocomplete="tel" />
            </label>
            <label class="field">
              <span>Password (8+ characters, including a capital letter)</span>
              <div class="password-wrap" [class.invalid]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
                <input [type]="showRegisterPassword ? 'text' : 'password'" formControlName="password" autocomplete="new-password" [attr.aria-invalid]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched" />
                <button type="button" class="toggle-password" [attr.aria-label]="showRegisterPassword ? 'Hide password' : 'Show password'" [title]="showRegisterPassword ? 'Hide password' : 'Show password'" (click)="showRegisterPassword = !showRegisterPassword">
                  <span class="eye-icon" [class.visible]="showRegisterPassword" aria-hidden="true"></span>
                </button>
              </div>
              <small class="field-error" *ngIf="registerForm.get('password')?.hasError('required') && registerForm.get('password')?.touched" role="alert">Password is required.</small>
              <small class="field-error" *ngIf="registerForm.get('password')?.hasError('minlength') && registerForm.get('password')?.touched" role="alert">Use at least 8 characters.</small>
              <small class="field-error" *ngIf="registerForm.get('password')?.hasError('maxlength') && registerForm.get('password')?.touched" role="alert">Use no more than 72 characters.</small>
              <small class="field-error" *ngIf="registerForm.get('password')?.hasError('pattern') && registerForm.get('password')?.touched" role="alert">Include at least one capital letter.</small>
            </label>
            <label class="field">
              <span>Confirm password</span>
              <div class="password-wrap" [class.invalid]="registerForm.get('confirmPassword')?.touched && registerForm.get('confirmPassword')?.value !== registerForm.get('password')?.value">
                <input [type]="showConfirmPassword ? 'text' : 'password'" formControlName="confirmPassword" autocomplete="new-password" [attr.aria-invalid]="registerForm.get('confirmPassword')?.touched && registerForm.get('confirmPassword')?.value !== registerForm.get('password')?.value" />
                <button type="button" class="toggle-password" [attr.aria-label]="showConfirmPassword ? 'Hide password' : 'Show password'" [title]="showConfirmPassword ? 'Hide password' : 'Show password'" (click)="showConfirmPassword = !showConfirmPassword">
                  <span class="eye-icon" [class.visible]="showConfirmPassword" aria-hidden="true"></span>
                </button>
              </div>
              <small class="field-error" *ngIf="registerForm.get('confirmPassword')?.hasError('required') && registerForm.get('confirmPassword')?.touched" role="alert">Please confirm your password.</small>
              <small class="field-error" *ngIf="registerForm.get('confirmPassword')?.touched && registerForm.get('confirmPassword')?.value && registerForm.get('confirmPassword')?.value !== registerForm.get('password')?.value" role="alert">Passwords do not match.</small>
            </label>
          </div>

          <ng-container *ngIf="!isRegistering">
          <label class="field">
            <span>Email or Username</span>
            <input type="text" formControlName="username" autocomplete="username" placeholder="Enter your email or username" [attr.aria-invalid]="loginForm.get('username')?.invalid && loginForm.get('username')?.touched" />
            <small class="field-error" *ngIf="loginForm.get('username')?.hasError('required') && loginForm.get('username')?.touched" role="alert">Email or username is required.</small>
          </label>

          <label class="field password-field">
            <span>Password</span>
            <div class="password-wrap" [class.invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
              <input [type]="showPassword ? 'text' : 'password'" formControlName="password" autocomplete="current-password" placeholder="Enter your password" [attr.aria-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" />
              <button type="button" class="toggle-password" [attr.aria-label]="showPassword ? 'Hide password' : 'Show password'" [title]="showPassword ? 'Hide password' : 'Show password'" (click)="showPassword = !showPassword">
                <span class="eye-icon" [class.visible]="showPassword" aria-hidden="true"></span>
              </button>
            </div>
            <small class="field-error" *ngIf="loginForm.get('password')?.hasError('required') && loginForm.get('password')?.touched" role="alert">Password is required.</small>
            <small class="field-error" *ngIf="loginForm.get('password')?.hasError('minlength') && loginForm.get('password')?.touched" role="alert">Password must be at least 6 characters.</small>
          </label>

          <div class="form-row">
            <label class="remember-me"><input type="checkbox" formControlName="remember" /> Remember me</label>
          </div>
          </ng-container>

          <div class="error-box" *ngIf="errorMessage">{{ errorMessage }}</div>
          <div class="success-box" *ngIf="successMessage">{{ successMessage }}</div>

          <button class="login-btn" type="button" *ngIf="isRegistering" [disabled]="loading" (click)="onRegister()">
            {{ loading ? 'Creating account...' : 'Register as teacher' }}
          </button>
          <button class="login-btn" type="submit" *ngIf="!isRegistering" [disabled]="loading">
            {{ loading ? 'Signing in...' : 'Login' }}
          </button>

          <button class="mode-toggle" type="button" (click)="toggleMode()">
            {{ isRegistering ? 'Already registered? Sign in' : 'New teacher? Create an account' }}
          </button>
        </form>
      </div>
    </main>
  `,
  styles: [
    `
      :host {
        display: block;
        --ink: #12384d;
        --blue: #126886;
        --green: #14785c;
        --mint: #b7f0d8;
        --line: #cfdee5;
      }

      .login-page {
        min-height: 100vh;
        min-height: 100svh;
        display: grid;
        place-items: center;
        padding: 2.5rem;
        background: linear-gradient(135deg, #eaf4fa 0%, #f5faf9 52%, #e5f4ed 100%);
        font-family: 'Trebuchet MS', 'Segoe UI', sans-serif;
      }

      .login-card {
        display: grid;
        grid-template-columns: minmax(0, 1.1fr) minmax(390px, .9fr);
        width: min(1120px, 100%);
        min-height: 650px;
        background: #fff;
        border: 1px solid rgba(18, 56, 77, .12);
        border-radius: 18px;
        box-shadow: 0 26px 76px rgba(18, 56, 77, .16);
        overflow: hidden;
      }

      .brand-panel {
        position: relative;
        isolation: isolate;
        background: #0b4960;
        color: white;
        padding: 2.75rem 3rem;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;
      }

      .brand-panel::before {
        position: absolute;
        z-index: -1;
        inset: 0;
        content: '';
        background: linear-gradient(180deg, rgba(6, 53, 83, .02) 0%, rgba(8, 68, 80, .08) 42%, rgba(5, 48, 65, .76) 100%), linear-gradient(110deg, rgba(8, 95, 113, .12), transparent 78%);
      }

      .campus-photo { position: absolute; z-index: -2; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 52%; }

      .school-logo {
        width: 58px;
        height: 58px;
        display: grid;
        place-items: center;
        border-radius: 16px;
        background: #c2f3df;
        color: #075b63;
        border: 1px solid rgba(255,255,255,.42);
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 1.35rem;
        font-weight: 800;
        box-shadow: 0 12px 30px rgba(8, 25, 20, .25);
      }

      .brand-copy { max-width: 480px; }
      .brand-kicker { display: inline-block; margin-bottom: .8rem; color: #aaf0d7; font-size: .74rem; font-weight: 800; text-transform: uppercase; letter-spacing: .12em; }
      .brand-panel h1 {
        max-width: 470px;
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 2.85rem;
        margin: 0;
        line-height: 1.1;
        font-weight: 500;
      }

      .brand-panel p {
        max-width: 370px;
        margin: 1rem 0 0;
        color: rgba(255,255,255,.84);
        font-size: .84rem;
        font-weight: 700;
        line-height: 1.6;
        letter-spacing: .06em;
      }

      .brand-pills {
        display: flex;
        flex-wrap: wrap;
        gap: 1.25rem;
        padding-top: 1rem;
        border-top: 1px solid rgba(255,255,255,.28);
        width: 100%;
      }

      .brand-pills span {
        color: rgba(255,255,255,.88);
        font-size: .76rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: .08em;
      }

      .login-form {
        background: #fff;
        padding: 3.5rem clamp(2rem, 4.5vw, 4.25rem);
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .form-header { margin-bottom: 1.1rem; }
      .eyebrow {
        margin: 0;
        font-size: .7rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: .12em;
        color: var(--green);
      }

      h2 {
        margin: .45rem 0 0;
        color: var(--ink);
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 2.35rem;
        font-weight: 500;
        line-height: 1.1;
      }

      .field {
        display: flex;
        flex-direction: column;
        gap: .5rem;
        margin-bottom: 1.15rem;
      }

      .field span {
        color: #29495b;
        font-size: .84rem;
        font-weight: 700;
      }

      input {
        width: 100%;
        min-height: 50px;
        border: 1px solid var(--line);
        border-radius: 8px;
        padding: .85rem .95rem;
        font: inherit;
        color: var(--ink);
        background: #f7fafb;
        transition: border-color .18s ease, box-shadow .18s ease, background .18s ease;
      }

      input::placeholder { color: #87968b; font-size: .86rem; }
      input:focus { outline: none; border-color: #168477; box-shadow: 0 0 0 3px rgba(22, 132, 119, .15); background: #fff; }
      .field > input[aria-invalid='true'] { border-color: #c62828; box-shadow: 0 0 0 3px rgba(198, 40, 40, .1); background: #fffafa; }
      .field-error { color: #b42318; font-size: .76rem; font-weight: 700; line-height: 1.4; }
      input[type='checkbox'] { width: 17px; min-height: 17px; height: 17px; margin: 0; accent-color: var(--green); }
      .password-wrap:focus-within { border-color: #168477; box-shadow: 0 0 0 3px rgba(22, 132, 119, .15); background: #fff; }
      .password-wrap.invalid { border-color: #c62828; box-shadow: 0 0 0 3px rgba(198, 40, 40, .1); background: #fffafa; }
      .password-wrap:focus-within input { box-shadow: none; }

      .password-wrap {
        display: flex;
        align-items: center;
        border: 1px solid var(--line);
        border-radius: 8px;
        overflow: hidden;
        background: #f7fafb;
        transition: border-color .18s ease, box-shadow .18s ease, background .18s ease;
      }

      .password-wrap input {
        border: 0;
        border-radius: 0;
        background: transparent;
      }

      .toggle-password {
        border: 0;
        background: transparent;
        color: var(--blue);
        padding: 0 .9rem;
        cursor: pointer;
      }

      .toggle-password:focus-visible, .mode-toggle:focus-visible, .login-btn:focus-visible { outline: 3px solid rgba(22, 132, 119, .34); outline-offset: 3px; }
      .eye-icon { position: relative; display: block; width: 18px; height: 13px; color: currentColor; }
      .eye-icon::before { content: ''; position: absolute; left: 2px; top: 1px; width: 12px; height: 10px; border: 1.5px solid currentColor; border-radius: 75% 15%; transform: rotate(45deg); }
      .eye-icon::after { content: ''; position: absolute; left: 7px; top: 4px; width: 4px; height: 4px; border-radius: 50%; background: currentColor; }
      .eye-icon:not(.visible) { overflow: hidden; }
      .eye-icon:not(.visible)::before { border-color: transparent currentColor currentColor transparent; }
      .form-row {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: .8rem;
        margin: .2rem 0 1.25rem;
      }

      .remember-me {
        display: inline-flex;
        align-items: center;
        gap: .55rem;
        color: #4c6672;
        font-size: .83rem;
      }

      .error-box {
        background: #fff3ef;
        color: #a63b27;
        border: 1px solid #f2c6b9;
        border-radius: 8px;
        padding: .8rem .9rem;
        margin: 0 0 1rem;
      }

      .success-box {
        background: #edf7ef;
        color: #17634c;
        border: 1px solid #b6dfcf;
        border-radius: 8px;
        padding: .8rem .9rem;
        margin: 0 0 1rem;
      }

      .mode-toggle {
        border: 0;
        background: transparent;
        color: var(--blue);
        padding: 1rem 0 0;
        font: inherit;
        font-size: .85rem;
        font-weight: 700;
        cursor: pointer;
      }

      .login-btn {
        border: 0;
        min-height: 52px;
        border-radius: 9px;
        background: linear-gradient(105deg, #126b88 0%, #14785c 100%);
        color: white;
        font-weight: 700;
        padding: .95rem 1rem;
        cursor: pointer;
        transition: transform .18s ease, background .18s ease, box-shadow .18s ease;
        box-shadow: 0 10px 22px rgba(18, 104, 134, .2);
      }

      .login-btn:hover:not(:disabled) { transform: translateY(-1px); background: linear-gradient(105deg, #0d5b77 0%, #0f674e 100%); box-shadow: 0 13px 26px rgba(18, 104, 134, .27); }
      .login-btn:disabled {
        opacity: .58;
        cursor: not-allowed;
      }

      @media (max-width: 900px) {
        .login-page { padding: 1.25rem; }
        .login-card { grid-template-columns: minmax(0, 1fr) minmax(350px, .95fr); min-height: 600px; }
        .brand-panel { padding: 2.25rem; }
        .brand-panel h1 { font-size: 2.35rem; }
        .login-form { padding: 2.5rem 2rem; }
      }

      @media (max-width: 760px) {
        .login-card {
          grid-template-columns: 1fr;
          width: min(520px, 100%);
          min-height: 0;
        }
        .brand-panel {
          min-height: 280px;
          padding: 1.5rem;
        }
        .school-logo { width: 48px; height: 48px; border-radius: 13px; }
        .brand-panel h1 { font-size: 1.85rem; }
        .brand-kicker { margin-bottom: .5rem; }
        .brand-panel p { margin-top: .65rem; font-size: .9rem; }
        .brand-pills { gap: .9rem; padding-top: .75rem; }
        .brand-pills span { font-size: .66rem; }
        .login-form {
          padding: 2rem 1.5rem 1.6rem;
        }
        h2 { font-size: 2rem; }
      }

      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after { scroll-behavior: auto !important; transition-duration: .01ms !important; animation-duration: .01ms !important; }
      }
    `,
  ],
})
export class LoginPageComponent {
  isRegistering = false;
  showPassword = false;
  showRegisterPassword = false;
  showConfirmPassword = false;
  loading = false;
  errorMessage = '';
  successMessage = '';
  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [true],
    });
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[A-Z0-9._%+-]+@gmail\.com$/i), Validators.maxLength(50)]],
      phone: ['', [Validators.maxLength(30)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(72), Validators.pattern(/[A-Z]/)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  toggleMode(): void {
    this.isRegistering = !this.isRegistering;
    this.errorMessage = '';
    this.successMessage = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onRegister(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { firstName, lastName, email, phone, password, confirmPassword } = this.registerForm.value;
    if (password !== confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.authService.registerTeacher({ firstName, lastName, email, phone: phone ?? '', password }).subscribe({
      next: () => {
        this.loading = false;
        this.isRegistering = false;
        this.loginForm.patchValue({ username: email, password: '' });
        this.registerForm.reset();
        this.successMessage = 'Account created. Sign in after your administrator assigns your subjects and classes.';
      },
      error: (error: { error?: string }) => {
        this.loading = false;
        this.errorMessage = typeof error.error === 'string' ? error.error : 'Could not create the account. Check your details and try again.';
      },
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.errorMessage = 'Please enter a valid username and password.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const { username, password } = this.loginForm.value;

    this.authService.login(username ?? '', password ?? '').subscribe((result) => {
      this.loading = false;

      if (!result) {
        this.errorMessage = 'Invalid username or password.';
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
