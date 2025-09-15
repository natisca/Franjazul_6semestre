import { NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';


interface Particle {
  id: number;
  x: number;
  y: number;
}

@Component({
  selector: 'app-login',
  imports: [NgFor, NgIf, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})


export class login implements OnInit, OnDestroy {
  loginForm: FormGroup;
  showPassword: boolean = false;
  particles: Particle[] = [];
  private intervalId: any;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      showPassword: [false]
    });
  }

  ngOnInit(): void {
    // Crear animación de partículas
    this.intervalId = setInterval(() => {
      this.particles = [
        ...this.particles.slice(-4), // conservar últimas 4 partículas
        {
          id: Date.now(),
          x: Math.random() * 300,
          y: Math.random() * 200
        }
      ];
    }, 500);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Login attempt:', this.loginForm.value);
    }
  }
}