import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  hidePassword = true;

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  constructor() {
    // If already authenticated, redirect to calendar
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/calendar']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value as { email: string; password: string };
    const success = this.authService.login(email, password);

    if (success) {
      this.router.navigate(['/calendar']);
    } else {
      this.snackBar.open('Credenciales inválidas. Inténtalo de nuevo.', 'Cerrar', {
        duration: 3000
      });
    }
  }

  get emailError(): string {
    const control = this.loginForm.get('email');
    if (control?.hasError('required')) return 'El correo es obligatorio';
    if (control?.hasError('email')) return 'Introduce un correo válido';
    return '';
  }

  get passwordError(): string {
    const control = this.loginForm.get('password');
    if (control?.hasError('required')) return 'La contraseña es obligatoria';
    if (control?.hasError('minlength')) return 'Mínimo 4 caracteres requeridos';
    return '';
  }
}
