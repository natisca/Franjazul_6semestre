import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EstadoCita } from '../../../services/estadoCitaService';

@Component({
  selector: 'app-estado-cita-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './estado-cita-modal.html',
  styleUrls: ['./estado-cita-modal.css']
})
export class EstadoCitaModalComponent implements OnChanges {
  @Input() estadoCita: EstadoCita | null = null;
  @Input() isOpen: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveEstadoCita = new EventEmitter<Partial<EstadoCita>>();

  estadoCitaForm: FormGroup;
  isEditMode: boolean = false;

  constructor(private fb: FormBuilder) {
    this.estadoCitaForm = this.fb.group({
      nombreEc: ['', [Validators.required, Validators.maxLength(10)]],
      descripcionEc: ['', [Validators.required, Validators.maxLength(30)]]
    });
  }

  // CAMBIA ngOnInit por ngOnChanges
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['estadoCita'] || changes['isOpen']) {
      this.actualizarFormulario();
    }
  }

  // NUEVO: Método para actualizar el formulario según el modo
  private actualizarFormulario(): void {
    if (this.estadoCita && this.isOpen) {
      // Modo EDICIÓN
      this.isEditMode = true;
      this.estadoCitaForm.patchValue({
        nombreEc: this.estadoCita.nombreEc,
        descripcionEc: this.estadoCita.descripcionEc
      });
      
      // En modo edición, el nombre no se puede cambiar (es la PK)
      this.estadoCitaForm.get('nombreEc')?.disable();
    } else if (this.isOpen) {
      // Modo CREACIÓN
      this.isEditMode = false;
      this.estadoCitaForm.reset({
        nombreEc: '',
        descripcionEc: ''
      });
      
      // Habilitar todos los campos
      this.estadoCitaForm.get('nombreEc')?.enable();
    }
  }

  onSubmit(): void {
    if (this.estadoCitaForm.valid) {
      // Si está en modo edición, usar getRawValue para obtener el campo deshabilitado
      const formValue = this.isEditMode 
        ? this.estadoCitaForm.getRawValue() 
        : this.estadoCitaForm.value;
      
      // Convertir nombreEc a mayúsculas y trim
      if (formValue.nombreEc) {
        formValue.nombreEc = formValue.nombreEc.toUpperCase().trim();
      }
      if (formValue.descripcionEc) {
        formValue.descripcionEc = formValue.descripcionEc.trim();
      }
      
      this.saveEstadoCita.emit(formValue);
    }
  }

  onClose(): void {
    this.estadoCitaForm.reset({
      nombreEc: '',
      descripcionEc: ''
    });
    this.closeModal.emit();
  }

  get nombreEc() {
    return this.estadoCitaForm.get('nombreEc');
  }

  get descripcionEc() {
    return this.estadoCitaForm.get('descripcionEc');
  }
}