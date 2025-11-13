
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TipoServicio } from '../../../services/tipoServicioService';

@Component({
  selector: 'app-tipo-servicio-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tipo-servicios-modal.html',
  styleUrls: ['./tipo-servicios-modal.css']
})
export class TipoServicioModalComponent implements OnInit {
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

  ngOnInit(): void {
    if (this.tipoServicio) {
      this.isEditMode = true;
      this.tipoServicioForm.patchValue({
        nombreTps: this.tipoServicio.nombreTps,
        descripcionTsp: this.tipoServicio.descripcionTsp
      });
      
      // En modo edición, el nombre no se puede cambiar (es la PK)
      this.tipoServicioForm.get('nombreTps')?.disable();
    }
  }

  onSubmit(): void {
    if (this.tipoServicioForm.valid) {
      const formValue = this.isEditMode ? this.tipoServicioForm.getRawValue() : this.tipoServicioForm.value;
      this.saveTipoServicio.emit(formValue);
    }
  }

  onClose(): void {
    this.closeModal.emit();
  }

  get nombreTps() {
    return this.tipoServicioForm.get('nombreTps');
  }

  get descripcionTsp() {
    return this.tipoServicioForm.get('descripcionTsp');
  }
}
