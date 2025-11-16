import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/authService';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class Registro {
  registroForm: FormGroup;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registroForm = this.fb.group({
      idUsuario: ['', [Validators.required, Validators.maxLength(10)]],
      nombreUs: ['', [Validators.required, Validators.maxLength(70)]],
      apellidoUs: ['', [Validators.required, Validators.maxLength(50)]],
      apellido2Us: ['', Validators.maxLength(50)],
      emailUs: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      passwordUs: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      telefonoUs: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('passwordUs');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    if (this.registroForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const { confirmPassword, ...datos } = this.registroForm.value;
      datos.telefonoUs = parseInt(datos.telefonoUs);

      console.log('Registrando usuario:', datos);

      this.authService.registrar(datos).subscribe({
        next: (response) => {
          console.log('✅ Registro exitoso:', response);
          this.loading = false;
        },
        error: (error) => {
          console.error('❌ Error en registro:', error);
          this.loading = false;
          this.errorMessage = error.error?.message || 'Error al registrar el usuario';
        }
      });
    } else {
      this.registroForm.markAllAsTouched();
    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  get idUsuario() { return this.registroForm.get('idUsuario'); }
  get nombreUs() { return this.registroForm.get('nombreUs'); }
  get apellidoUs() { return this.registroForm.get('apellidoUs'); }
  get apellido2Us() { return this.registroForm.get('apellido2Us'); }
  get emailUs() { return this.registroForm.get('emailUs'); }
  get passwordUs() { return this.registroForm.get('passwordUs'); }
  get confirmPassword() { return this.registroForm.get('confirmPassword'); }
  get telefonoUs() { return this.registroForm.get('telefonoUs'); }
}
