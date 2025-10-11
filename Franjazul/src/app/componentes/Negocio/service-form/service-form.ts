import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-service-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './service-form.html'
})

export class ServiceForm {

  // constructor(private fb: FormBuilder) {}

  private fb = new FormBuilder;

  @Output() close = new EventEmitter<void>();

  form = this.fb.group({
    nombre: ['', Validators.required],
    apellido1: ['', Validators.required],
    apellido2: [''],
    direccion: ['', Validators.required],
    cedula: ['', Validators.required],
    tipoLugar: ['', Validators.required],
    telefono: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
  });

  tiposLugar = ['Residencia', 'Comercial', 'Industrial'];

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log('Datos del formulario:', this.form.value);
    this.close.emit();
  }

  cerrarFormulario() {
    this.close.emit();
  }

}
