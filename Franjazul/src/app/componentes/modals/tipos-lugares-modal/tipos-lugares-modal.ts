
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TipoLugar } from '../../../services/tipoLugarService';

@Component({
  selector: 'app-tipo-lugar-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tipos-lugares-modal.html',
  styleUrls: ['./tipos-lugares-modal.css']
})
export class TipoLugarModalComponent implements OnInit {
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

  ngOnInit(): void {
    if (this.tipoLugar) {
      this.isEditMode = true;
      this.tipoLugarForm.patchValue({
        nombreTl: this.tipoLugar.nombreTl
      });
    }
  }

  onSubmit(): void {
    if (this.tipoLugarForm.valid) {
      this.saveTipoLugar.emit(this.tipoLugarForm.value);
    }
  }

  onClose(): void {
    this.closeModal.emit();
  }

  get nombreTl() {
    return this.tipoLugarForm.get('nombreTl');
  }
}
