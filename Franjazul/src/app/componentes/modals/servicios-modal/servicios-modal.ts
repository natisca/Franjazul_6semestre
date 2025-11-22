import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Servicio } from '../../../services/serviciosService';
import { TipoServicioService, TipoServicio } from '../../../services/tipoServicioService'; 
import { Molecula, MoleculasService } from '../../../services/moleculasService';

@Component({
  selector: 'app-servicio-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './servicios-modal.html',
  styleUrls: ['./servicios-modal.css']
})
export class ServicioModalComponent implements OnInit, OnChanges {
  @Input() servicio: Servicio | null = null;
  @Input() isOpen: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveServicio = new EventEmitter<Partial<Servicio>>();

  servicioForm: FormGroup;
  isEditMode: boolean = false;
  tiposServicio: TipoServicio[] = [];
  moleculas: Molecula[] = [];
  cargandoTipos: boolean = false;
  cargandoMoleculas: boolean = false;

  constructor(
    private fb: FormBuilder,
    private tipoServicioService: TipoServicioService,
    private moleculasService: MoleculasService
  ) {
    this.servicioForm = this.fb.group({
      nombreSer: ['', [Validators.required, Validators.maxLength(20)]],
      descripcionSer: ['', [Validators.required, Validators.maxLength(150)]],
      nombreTps: [null, [Validators.required]],
      nombreMol: [null]
    });
  }

  // ngOnInit para cargar datos de selects
  ngOnInit(): void {
    this.cargarTiposServicio();
    this.cargarMoleculas();
  }

  // Detectar cambios en los inputs
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['servicio'] || changes['isOpen']) {
      this.actualizarFormulario();
    }
  }

  // Método para actualizar el formulario según el modo
  private actualizarFormulario(): void {
    if (this.servicio && this.isOpen) {
      // Modo EDICIÓN
      this.isEditMode = true;
      this.servicioForm.patchValue({
        nombreSer: this.servicio.nombreSer,
        descripcionSer: this.servicio.descripcionSer,
        nombreTps: this.servicio.tipoServicio?.nombreTps || null,
        nombreMol: this.servicio.molecula?.nombreMol || null
      });
    } else if (this.isOpen) {
      // Modo CREACIÓN
      this.isEditMode = false;
      this.servicioForm.reset({
        nombreSer: '',
        descripcionSer: '',
        nombreTps: null,
        nombreMol: null
      });
    }
  }

  cargarTiposServicio(): void {
    this.cargandoTipos = true;
    this.tipoServicioService.obtenerTodos().subscribe({
      next: (response) => {
        if (response.success) {
          this.tiposServicio = response.data;
          console.log('✅ Tipos de servicio cargados:', this.tiposServicio.length);
        }
        this.cargandoTipos = false;
      },
      error: (error) => {
        console.error('❌ Error cargando tipos de servicio:', error);
        this.cargandoTipos = false;
      }
    });
  }

  cargarMoleculas(): void {
    this.cargandoMoleculas = true;
    this.moleculasService.obtenerTodos().subscribe({
      next: (response) => {
        if (response.success) {
          this.moleculas = response.data;
          console.log('✅ Moléculas cargadas:', this.moleculas.length);
        }
        this.cargandoMoleculas = false;
      },
      error: (error) => {
        console.error('❌ Error cargando moléculas:', error);
        this.cargandoMoleculas = false;
      }
    });
  }

  get cargandoDatos(): boolean {
    return this.cargandoTipos || this.cargandoMoleculas;
  }

  onSubmit(): void {
    if (this.servicioForm.valid) {
      const formValue = this.servicioForm.value;
      
      const servicioData: Partial<Servicio> = {
        nombreSer: formValue.nombreSer?.trim(),
        descripcionSer: formValue.descripcionSer?.trim(),
        tipoServicio: {
          nombreTps: formValue.nombreTps
        },
        molecula: formValue.nombreMol ? {
          nombreMol: formValue.nombreMol
        } : null
      };
      
      this.saveServicio.emit(servicioData);
    }
  }

  onClose(): void {
    this.servicioForm.reset({
      nombreSer: '',
      descripcionSer: '',
      nombreTps: null,
      nombreMol: null
    });
    this.closeModal.emit();
  }

  get nombreSer() { 
    return this.servicioForm.get('nombreSer'); 
  }
  
  get descripcionSer() { 
    return this.servicioForm.get('descripcionSer'); 
  }
  
  get nombreTps() { 
    return this.servicioForm.get('nombreTps'); 
  }
  
  get nombreMol() { 
    return this.servicioForm.get('nombreMol'); 
  }
}