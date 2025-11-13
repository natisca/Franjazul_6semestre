
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
export class ServicioModalComponent implements OnInit {
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

  ngOnInit(): void {
    this.cargarTiposServicio();
    this.cargarMoleculas();
    
    if (this.servicio) {
      this.isEditMode = true;
      this.servicioForm.patchValue({
        nombreSer: this.servicio.nombreSer,
        descripcionSer: this.servicio.descripcionSer,
        nombreTps: this.servicio.tipoServicio.nombreTps,
        nombreMol: this.servicio.molecula?.nombreMol || null
      });
    }
  }

  cargarTiposServicio(): void {
    this.cargandoTipos = true;
    this.tipoServicioService.obtenerTodos().subscribe({
      next: (response) => {
        if (response.success) {
          this.tiposServicio = response.data;
        }
        this.cargandoTipos = false;
      },
      error: () => {
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
        }
        this.cargandoMoleculas = false;
      },
      error: () => {
        this.cargandoMoleculas = false;
      }
    });
  }

  onSubmit(): void {
    if (this.servicioForm.valid) {
      const formValue = this.servicioForm.value;
      
      const servicioData: Partial<Servicio> = {
        nombreSer: formValue.nombreSer,
        descripcionSer: formValue.descripcionSer,
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
    this.closeModal.emit();
  }

  get nombreSer() { return this.servicioForm.get('nombreSer'); }
  get descripcionSer() { return this.servicioForm.get('descripcionSer'); }
  get nombreTps() { return this.servicioForm.get('nombreTps'); }
  get nombreMol() { return this.servicioForm.get('nombreMol'); }
}
