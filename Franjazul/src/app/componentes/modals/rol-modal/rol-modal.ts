import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Rol } from '../../../services/rolesService';

@Component({
  selector: 'app-rol-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './rol-modal.html',
  styleUrls: ['./rol-modal.css']
})
export class RolModalComponent implements OnChanges {
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

  //ngOnInit por ngOnChanges
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rol'] || changes['isOpen']) {
      this.actualizarFormulario();
    }
  }

  //Método para actualizar el formulario según el modo
  private actualizarFormulario(): void {
    if (this.rol && this.isOpen) {
      // Modo EDICIÓN
      this.isEditMode = true;
      this.rolForm.patchValue({
        nombreRol: this.rol.nombreRol,
        descripcionRol: this.rol.descripcionRol
      });
    } else if (this.isOpen) {
      // Modo CREACIÓN
      this.isEditMode = false;
      this.rolForm.reset({
        nombreRol: '',
        descripcionRol: ''
      });
    }
  }

  onSubmit(): void {
    if (this.rolForm.valid) {
      const formValue = this.rolForm.value;
      
      //Trim en los valores
      if (formValue.nombreRol) {
        formValue.nombreRol = formValue.nombreRol.trim();
      }
      if (formValue.descripcionRol) {
        formValue.descripcionRol = formValue.descripcionRol.trim();
      }
      
      this.saveRol.emit(formValue);
    }
  }

  onClose(): void {
    this.rolForm.reset({
      nombreRol: '',
      descripcionRol: ''
    });
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