
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FranjaHoraria } from '../../../services/franjasHorariasService';

@Component({
  selector: 'app-franja-horaria-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './franjas-horarias-modal.html',
  styleUrls: ['./franjas-horarias-modal.css']
})
export class FranjaHorariaModalComponent implements OnInit {
  @Input() franjaHoraria: FranjaHoraria | null = null;
  @Input() isOpen: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveFranjaHoraria = new EventEmitter<Partial<FranjaHoraria>>();

  franjaHorariaForm: FormGroup;
  isEditMode: boolean = false;

  constructor(private fb: FormBuilder) {
    this.franjaHorariaForm = this.fb.group({
      fechaInicio: ['', [Validators.required]],
      fechaFin: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (this.franjaHoraria) {
      this.isEditMode = true;
      
      // Convertir de ISO string a formato datetime-local (YYYY-MM-DDThh:mm)
      const fechaInicio = this.franjaHoraria.fechaInicio.substring(0, 16);
      const fechaFin = this.franjaHoraria.fechaFin.substring(0, 16);
      
      this.franjaHorariaForm.patchValue({
        fechaInicio: fechaInicio,
        fechaFin: fechaFin
      });
    }
  }

  onSubmit(): void {
    if (this.franjaHorariaForm.valid) {
      const formValue = this.franjaHorariaForm.value;
      
      // Convertir a formato ISO para el backend
      const franjaHorariaData: Partial<FranjaHoraria> = {
        fechaInicio: formValue.fechaInicio + ':00', // Agregar segundos
        fechaFin: formValue.fechaFin + ':00'
      };
      
      this.saveFranjaHoraria.emit(franjaHorariaData);
    }
  }

  onClose(): void {
    this.closeModal.emit();
  }

  get fechaInicio() {
    return this.franjaHorariaForm.get('fechaInicio');
  }

  get fechaFin() {
    return this.franjaHorariaForm.get('fechaFin');
  }
}
