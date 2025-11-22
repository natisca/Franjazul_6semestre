import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TipoServicio } from '../../../services/tipoServicioService';

@Component({
  selector: 'app-tipo-servicio-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tipo-servicios-modal.html',
  styleUrls: ['./tipo-servicios-modal.css']
})
export class TipoServicioModalComponent implements OnChanges {
  @Input() tipoServicio: TipoServicio | null = null;
  @Input() isOpen: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveTipoServicio = new EventEmitter<Partial<TipoServicio>>();

  tipoServicioForm: FormGroup;
  isEditMode: boolean = false;

  constructor(private fb: FormBuilder) {
    this.tipoServicioForm = this.fb.group({
      nombreTps: ['', [Validators.required, Validators.maxLength(30)]],
      descripcionTsp: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tipoServicio'] || changes['isOpen']) {
      this.actualizarFormulario();
    }
  }

  //Método para actualizar el formulario según el modo
  private actualizarFormulario(): void {
    if (this.tipoServicio && this.isOpen) {
      // Modo EDICIÓN
      this.isEditMode = true;
      this.tipoServicioForm.patchValue({
        nombreTps: this.tipoServicio.nombreTps,
        descripcionTsp: this.tipoServicio.descripcionTsp
      });
      
      // En modo edición, el nombre no se puede cambiar (es la PK)
      this.tipoServicioForm.get('nombreTps')?.disable();
    } else if (this.isOpen) {
      // Modo CREACIÓN
      this.isEditMode = false;
      this.tipoServicioForm.reset({
        nombreTps: '',
        descripcionTsp: ''
      });
      
      // Habilitar todos los campos
      this.tipoServicioForm.get('nombreTps')?.enable();
    }
  }

  onSubmit(): void {
    if (this.tipoServicioForm.valid) {
      // Si está en modo edición, usar getRawValue para obtener el campo deshabilitado
      const formValue = this.isEditMode 
        ? this.tipoServicioForm.getRawValue() 
        : this.tipoServicioForm.value;
      
      // Trim en los valores
      if (formValue.nombreTps) {
        formValue.nombreTps = formValue.nombreTps.trim();
      }
      if (formValue.descripcionTsp) {
        formValue.descripcionTsp = formValue.descripcionTsp.trim();
      }
      
      this.saveTipoServicio.emit(formValue);
    }
  }

  onClose(): void {
    this.tipoServicioForm.reset({
      nombreTps: '',
      descripcionTsp: ''
    });
    this.closeModal.emit();
  }

  get nombreTps() {
    return this.tipoServicioForm.get('nombreTps');
  }

  get descripcionTsp() {
    return this.tipoServicioForm.get('descripcionTsp');
  }
}