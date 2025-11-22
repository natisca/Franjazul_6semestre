import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TipoLugar } from '../../../services/tipoLugarService';

@Component({
  selector: 'app-tipo-lugar-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tipos-lugares-modal.html',
  styleUrls: ['./tipos-lugares-modal.css']
})
export class TipoLugarModalComponent implements OnChanges {
  @Input() tipoLugar: TipoLugar | null = null;
  @Input() isOpen: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveTipoLugar = new EventEmitter<Partial<TipoLugar>>();

  tipoLugarForm: FormGroup;
  isEditMode: boolean = false;

  constructor(private fb: FormBuilder) {
    this.tipoLugarForm = this.fb.group({
      nombreTl: ['', [Validators.required, Validators.maxLength(50)]]
    });
  }

  // ngOnInit por ngOnChanges
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tipoLugar'] || changes['isOpen']) {
      this.actualizarFormulario();
    }
  }

  // Método para actualizar el formulario según el modo
  private actualizarFormulario(): void {
    if (this.tipoLugar && this.isOpen) {
      // Modo EDICIÓN
      this.isEditMode = true;
      this.tipoLugarForm.patchValue({
        nombreTl: this.tipoLugar.nombreTl
      });
    } else if (this.isOpen) {
      // Modo CREACIÓN
      this.isEditMode = false;
      this.tipoLugarForm.reset({
        nombreTl: ''
      });
    }
  }

  onSubmit(): void {
    if (this.tipoLugarForm.valid) {
      const formValue = this.tipoLugarForm.value;
      
      //Trim en el valor
      if (formValue.nombreTl) {
        formValue.nombreTl = formValue.nombreTl.trim();
      }
      
      this.saveTipoLugar.emit(formValue);
    }
  }

  onClose(): void {
    this.tipoLugarForm.reset({
      nombreTl: ''
    });
    this.closeModal.emit();
  }

  get nombreTl() {
    return this.tipoLugarForm.get('nombreTl');
  }
}