import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Molecula } from '../../../services/moleculasService';

@Component({
  selector: 'app-molecula-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './moleculas-modal.html',
  styleUrls: ['./moleculas-modal.css']
})
export class MoleculaModalComponent implements OnChanges {
  @Input() molecula: Molecula | null = null;
  @Input() isOpen: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveMolecula = new EventEmitter<Partial<Molecula>>();

  moleculaForm: FormGroup;
  isEditMode: boolean = false;

  constructor(private fb: FormBuilder) {
    this.moleculaForm = this.fb.group({
      nombreMol: ['', [Validators.required, Validators.maxLength(20)]],
      descripcionMol: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  // ngOnInit por ngOnChanges
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['molecula'] || changes['isOpen']) {
      this.actualizarFormulario();
    }
  }

  // Método para actualizar el formulario según el modo
  private actualizarFormulario(): void {
    if (this.molecula && this.isOpen) {
      // Modo EDICIÓN
      this.isEditMode = true;
      this.moleculaForm.patchValue({
        nombreMol: this.molecula.nombreMol,
        descripcionMol: this.molecula.descripcionMol
      });
      
      // En modo edición, el nombre no se puede cambiar (es la PK)
      this.moleculaForm.get('nombreMol')?.disable();
    } else if (this.isOpen) {
      // Modo CREACIÓN
      this.isEditMode = false;
      this.moleculaForm.reset({
        nombreMol: '',
        descripcionMol: ''
      });
      
      // Habilitar todos los campos
      this.moleculaForm.get('nombreMol')?.enable();
    }
  }

  onSubmit(): void {
    if (this.moleculaForm.valid) {
      // Si está en modo edición, usar getRawValue para obtener el campo deshabilitado
      const formValue = this.isEditMode 
        ? this.moleculaForm.getRawValue() 
        : this.moleculaForm.value;
      
      // Trim en los valores
      if (formValue.nombreMol) {
        formValue.nombreMol = formValue.nombreMol.trim();
      }
      if (formValue.descripcionMol) {
        formValue.descripcionMol = formValue.descripcionMol.trim();
      }
      
      this.saveMolecula.emit(formValue);
    }
  }

  onClose(): void {
    this.moleculaForm.reset({
      nombreMol: '',
      descripcionMol: ''
    });
    this.closeModal.emit();
  }

  get nombreMol() {
    return this.moleculaForm.get('nombreMol');
  }

  get descripcionMol() {
    return this.moleculaForm.get('descripcionMol');
  }
}