import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/authService';

@Component({
  selector: 'app-cambio-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cambio-password.html',
  styleUrls: ['./cambio-password.css']
})
export class CambioPassword {
  cambioForm: FormGroup;
  showPasswordNueva: boolean = false;
  showConfirmPassword: boolean = false;
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.cambioForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      passwordNueva: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const passwordNueva = form.get('passwordNueva');
    const confirmPassword = form.get('confirmPassword');
    
    if (passwordNueva && confirmPassword && passwordNueva.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  togglePasswordNueva(): void {
    this.showPasswordNueva = !this.showPasswordNueva;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    if (this.cambioForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const datos = {
        email: this.cambioForm.value.email,
        passwordNueva: this.cambioForm.value.passwordNueva
      };

      console.log('Cambiando contraseña para email:', datos.email);

      this.authService.cambiarPassword(datos).subscribe({
        next: (response) => {
          console.log('✅ Contraseña cambiada:', response);
          this.loading = false;
          this.successMessage = 'Contraseña cambiada exitosamente. Redirigiendo al login...';
          this.cambioForm.reset();
          
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          console.error('❌ Error al cambiar contraseña:', error);
          this.loading = false;
          this.errorMessage = error.error?.message || 'Error al cambiar la contraseña';
        }
      });
    } else {
      this.cambioForm.markAllAsTouched();
    }
  }

  navegarLogin(): void {
    this.router.navigate(['/login']);
  }

  get email() { return this.cambioForm.get('email'); }
  get passwordNueva() { return this.cambioForm.get('passwordNueva'); }
  get confirmPassword() { return this.cambioForm.get('confirmPassword'); }
}
