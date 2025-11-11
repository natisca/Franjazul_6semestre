
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EstadoCita } from '../../../services/estadoCitaService';

@Component({
  selector: 'app-estado-cita-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './estado-cita-modal.html',
  styleUrls: ['./estado-cita-modal.css']
})
export class EstadoCitaModalComponent implements OnInit {
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

  ngOnInit(): void {
    if (this.estadoCita) {
      this.isEditMode = true;
      this.estadoCitaForm.patchValue({
        nombreEc: this.estadoCita.nombreEc,
        descripcionEc: this.estadoCita.descripcionEc
      });
      
      // En modo edición, el nombre no se puede cambiar (es la PK)
      this.estadoCitaForm.get('nombreEc')?.disable();
    }
  }

  onSubmit(): void {
    if (this.estadoCitaForm.valid) {
      const formValue = this.isEditMode ? this.estadoCitaForm.getRawValue() : this.estadoCitaForm.value;
      this.saveEstadoCita.emit(formValue);
    }
  }

  onClose(): void {
    this.closeModal.emit();
  }

  get nombreEc() {
    return this.estadoCitaForm.get('nombreEc');
  }

  get descripcionEc() {
    return this.estadoCitaForm.get('descripcionEc');
  }
}
