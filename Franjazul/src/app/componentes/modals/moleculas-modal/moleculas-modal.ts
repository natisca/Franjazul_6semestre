
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Molecula } from '../../../services/moleculasService';

@Component({
  selector: 'app-molecula-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './moleculas-modal.html',
  styleUrls: ['./moleculas-modal.css']
})
export class MoleculaModalComponent implements OnInit {
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

  ngOnInit(): void {
    if (this.molecula) {
      this.isEditMode = true;
      this.moleculaForm.patchValue({
        nombreMol: this.molecula.nombreMol,
        descripcionMol: this.molecula.descripcionMol
      });
      
      // En modo edición, el nombre no se puede cambiar (es la PK)
      this.moleculaForm.get('nombreMol')?.disable();
    }
  }

  onSubmit(): void {
    if (this.moleculaForm.valid) {
      const formValue = this.isEditMode ? this.moleculaForm.getRawValue() : this.moleculaForm.value;
      this.saveMolecula.emit(formValue);
    }
  }

  onClose(): void {
    this.closeModal.emit();
  }

  get nombreMol() {
    return this.moleculaForm.get('nombreMol');
  }

  get descripcionMol() {
    return this.moleculaForm.get('descripcionMol');
  }
}
