import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cargo } from '../../../services/cargosService';

@Component({
  selector: 'app-cargo-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cargos-modal.html',
  styleUrls: ['./cargos-modal.css']
})
export class CargoModalComponent implements OnChanges {
  @Input() cargo: Cargo | null = null;
  @Input() isOpen: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveCargo = new EventEmitter<Partial<Cargo>>();

  cargoForm: FormGroup;
  isEditMode: boolean = false;

  constructor(private fb: FormBuilder) {
    this.cargoForm = this.fb.group({
      nombreCargo: ['', [Validators.required, Validators.maxLength(15)]],
      descripcionCargo: ['', [Validators.required, Validators.maxLength(30)]]
    });
  }

  // CAMBIA ngOnInit por ngOnChanges
  ngOnChanges(changes: SimpleChanges): void {
    // Detectar cambios en el input 'cargo' o 'isOpen'
    if (changes['cargo'] || changes['isOpen']) {
      this.actualizarFormulario();
    }
  }

  // NUEVO: Método para actualizar el formulario según el modo
  private actualizarFormulario(): void {
    if (this.cargo && this.isOpen) {
      // Modo EDICIÓN
      this.isEditMode = true;
      this.cargoForm.patchValue({
        nombreCargo: this.cargo.nombreCargo,
        descripcionCargo: this.cargo.descripcionCargo
      });
      // En modo edición, el nombre no se puede cambiar (es la PK)
      this.cargoForm.get('nombreCargo')?.disable();
    } else if (this.isOpen) {
      // Modo CREACIÓN
      this.isEditMode = false;
      this.cargoForm.reset();
      this.cargoForm.get('nombreCargo')?.enable();
    }
  }

  onSubmit(): void {
    if (this.cargoForm.valid) {
      // Si está en modo edición, usar getRawValue para obtener el campo deshabilitado
      const formValue = this.isEditMode ? this.cargoForm.getRawValue() : this.cargoForm.value;
      
      // Convertir nombreCargo a mayúsculas
      if (formValue.nombreCargo) {
        formValue.nombreCargo = formValue.nombreCargo.toUpperCase().trim();
      }
      
      this.saveCargo.emit(formValue);
    }
  }

  onClose(): void {
    this.cargoForm.reset();
    this.closeModal.emit();
  }

  get nombreCargo() {
    return this.cargoForm.get('nombreCargo');
  }

  get descripcionCargo() {
    return this.cargoForm.get('descripcionCargo');
  }
}