
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cargo } from '../../../services/cargosService';

@Component({
  selector: 'app-cargo-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cargos-modal.html',
  styleUrls: ['./cargos-modal.css']
})
export class CargoModalComponent implements OnInit {
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

  ngOnInit(): void {
    if (this.cargo) {
      this.isEditMode = true;
      this.cargoForm.patchValue({
        nombreCargo: this.cargo.nombreCargo,
        descripcionCargo: this.cargo.descripcionCargo
      });
      
      // En modo edición, el nombre no se puede cambiar (es la PK)
      this.cargoForm.get('nombreCargo')?.disable();
    }
  }

  onSubmit(): void {
    if (this.cargoForm.valid) {
      // Si está en modo edición, usar getRawValue para obtener el campo deshabilitado
      const formValue = this.isEditMode ? this.cargoForm.getRawValue() : this.cargoForm.value;
      this.saveCargo.emit(formValue);
    }
  }

  onClose(): void {
    this.closeModal.emit();
  }

  get nombreCargo() {
    return this.cargoForm.get('nombreCargo');
  }

  get descripcionCargo() {
    return this.cargoForm.get('descripcionCargo');
  }
}
