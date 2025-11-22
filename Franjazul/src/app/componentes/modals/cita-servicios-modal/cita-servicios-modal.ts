// cita-servicios-modal.component.ts
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
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
export class CitaServicioModalComponent implements OnInit, OnChanges {
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

  // Se mantiene ngOnInit para cargar datos de selects
  ngOnInit(): void {
    this.cargarDatos();
  }

  // AGREGADO: Detectar cambios en los inputs
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['citaServicio'] || changes['isOpen']) {
      this.actualizarFormulario();
    }
  }

  // NUEVO: Método para actualizar el formulario según el modo
  private actualizarFormulario(): void {
    if (this.citaServicio && this.isOpen) {
      // Modo EDICIÓN
      this.isEditMode = true;
      this.citaServicioForm.patchValue({
        citaEnIntermedio: this.citaServicio.citaEnIntermedio,
        servicioEnIntermedio: this.citaServicio.servicioEnIntermedio,
        cantidadSer: this.citaServicio.cantidadSer
      });
      
      // En modo edición, las PKs no se pueden cambiar
      this.citaServicioForm.get('citaEnIntermedio')?.disable();
      this.citaServicioForm.get('servicioEnIntermedio')?.disable();
    } else if (this.isOpen) {
      // Modo CREACIÓN
      this.isEditMode = false;
      this.citaServicioForm.reset({
        citaEnIntermedio: null,
        servicioEnIntermedio: null,
        cantidadSer: 1
      });
      
      // Habilitar todos los campos
      this.citaServicioForm.get('citaEnIntermedio')?.enable();
      this.citaServicioForm.get('servicioEnIntermedio')?.enable();
    }
  }

  cargarDatos(): void {
    this.citasService.obtenerTodos().subscribe({
      next: (r) => {
        if (r.success) {
          this.citas = r.data;
        }
      },
      error: (error) => {
        console.error('Error al cargar citas:', error);
      }
    });

    this.serviciosService.obtenerTodos().subscribe({
      next: (r) => {
        if (r.success) {
          this.servicios = r.data;
        }
      },
      error: (error) => {
        console.error('Error al cargar servicios:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.citaServicioForm.valid) {
      const formValue = this.isEditMode 
        ? this.citaServicioForm.getRawValue() 
        : this.citaServicioForm.value;
      
      this.saveCitaServicio.emit(formValue);
    }
  }

  onClose(): void {
    this.citaServicioForm.reset({
      citaEnIntermedio: null,
      servicioEnIntermedio: null,
      cantidadSer: 1
    });
    this.closeModal.emit();
  }

  get citaEnIntermedio() { 
    return this.citaServicioForm.get('citaEnIntermedio'); 
  }
  
  get servicioEnIntermedio() { 
    return this.citaServicioForm.get('servicioEnIntermedio'); 
  }
  
  get cantidadSer() { 
    return this.citaServicioForm.get('cantidadSer'); 
  }
}
