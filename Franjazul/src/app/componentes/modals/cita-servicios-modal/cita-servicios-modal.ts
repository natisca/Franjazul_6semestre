// src/app/components/modals/cita-servicio-modal/cita-servicio-modal.component.ts
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CitaServicio } from '../../../services/citaServicioService';
import { CitasService } from '../../../services/citasService';
import { ServiciosService } from '../../../services/serviciosService';

@Component({
  selector: 'app-cita-servicio-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cita-servicios-modal.html',
  styleUrls: ['./cita-servicios-modal.css']
})
export class CitaServicioModalComponent implements OnInit {
  @Input() citaServicio: CitaServicio | null = null;
  @Input() isOpen: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveCitaServicio = new EventEmitter<Partial<CitaServicio>>();

  citaServicioForm: FormGroup;
  isEditMode: boolean = false;
  citas: any[] = [];
  servicios: any[] = [];

  constructor(
    private fb: FormBuilder,
    private citasService: CitasService,
    private serviciosService: ServiciosService
  ) {
    this.citaServicioForm = this.fb.group({
      citaEnIntermedio: [null, [Validators.required]],
      servicioEnIntermedio: [null, [Validators.required]],
      cantidadSer: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.cargarDatos();
    
    if (this.citaServicio) {
      this.isEditMode = true;
      this.citaServicioForm.patchValue({
        citaEnIntermedio: this.citaServicio.citaEnIntermedio,
        servicioEnIntermedio: this.citaServicio.servicioEnIntermedio,
        cantidadSer: this.citaServicio.cantidadSer
      });
      
      // En modo edición, las PKs no se pueden cambiar
      this.citaServicioForm.get('citaEnIntermedio')?.disable();
      this.citaServicioForm.get('servicioEnIntermedio')?.disable();
    }
  }

  cargarDatos(): void {
    this.citasService.obtenerTodos().subscribe(r => { if (r.success) this.citas = r.data; });
    this.serviciosService.obtenerTodos().subscribe(r => { if (r.success) this.servicios = r.data; });
  }

  onSubmit(): void {
    if (this.citaServicioForm.valid) {
      const formValue = this.isEditMode ? this.citaServicioForm.getRawValue() : this.citaServicioForm.value;
      this.saveCitaServicio.emit(formValue);
    }
  }

  onClose(): void {
    this.closeModal.emit();
  }

  get citaEnIntermedio() { return this.citaServicioForm.get('citaEnIntermedio'); }
  get servicioEnIntermedio() { return this.citaServicioForm.get('servicioEnIntermedio'); }
  get cantidadSer() { return this.citaServicioForm.get('cantidadSer'); }
}
