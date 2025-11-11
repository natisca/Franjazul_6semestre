// src/app/components/modals/rol-modal/rol-modal.component.ts

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Rol } from '../../../services/rolesService';

@Component({
  selector: 'app-rol-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './rol-modal.html',
  styleUrls: ['./rol-modal.css']
})
export class RolModalComponent implements OnInit {
  @Input() rol: Rol | null = null;
  @Input() isOpen: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveRol = new EventEmitter<Partial<Rol>>();

  rolForm: FormGroup;
  isEditMode: boolean = false;

  constructor(private fb: FormBuilder) {
    this.rolForm = this.fb.group({
      nombreRol: ['', [Validators.required, Validators.maxLength(20)]],
      descripcionRol: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {
    if (this.rol) {
      this.isEditMode = true;
      this.rolForm.patchValue({
        nombreRol: this.rol.nombreRol,
        descripcionRol: this.rol.descripcionRol
      });
    }
  }

  onSubmit(): void {
    if (this.rolForm.valid) {
      this.saveRol.emit(this.rolForm.value);
    }
  }

  onClose(): void {
    this.closeModal.emit();
  }

  // Métodos de ayuda para validación
  get nombreRol() {
    return this.rolForm.get('nombreRol');
  }

  get descripcionRol() {
    return this.rolForm.get('descripcionRol');
  }
}
