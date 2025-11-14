import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/authService';

interface Particle {
  id: number;
  x: number;
  y: number;
}

const CreateParticule = (id: number) => {
  return {
    id,
    x: Math.random() * 300,
    y: Math.random() * 200
  }
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit, OnDestroy {
  loginForm: FormGroup;
  showPassword: boolean = false;
  particles: Particle[] = [CreateParticule(1), CreateParticule(2), CreateParticule(3), CreateParticule(4)];
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  // ngOnInit(): void {
  //   this.intervalId = setInterval(() => {
  //     this.particles = [
  //       ...this.particles.slice(-4),
  //       {
  //         id: Date.now(),
  //         x: Math.random() * 300,
  //         y: Math.random() * 200
  //       }
  //     ];
  //   }, 500);
  // }

  ngOnInit(): void {
    // this.intervalId = setInterval(() => {
    //   this.particles.forEach((_,index)=>{
    //     const particle = document.getElementById("particle"+(index+1))
    //     if(particle){
    //       particle.style.x = (Math.random() * 300).toString()
    //       particle.style.y = (Math.random() * 200).toString()
    //     }
    //   })
    // }, 500);
  }

  // ngOnDestroy(): void {
  //   if (this.intervalId) {
  //     clearInterval(this.intervalId);
  //   }
  // }

  ngOnDestroy(): void {

  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      const credentials = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      console.log('Intentando login con:', credentials);

      this.authService.login(credentials).subscribe({
        next: (response) => {
          console.log('✅ Login exitoso:', response);
          this.loading = false;
        },
        error: (error) => {
          console.error('❌ Error en login:', error);
          this.loading = false;
          this.errorMessage = error.error?.message || 'Credenciales inválidas';
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}




