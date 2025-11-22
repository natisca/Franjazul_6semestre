import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cita } from '../../../services/citasService';
import { UsuariosService } from '../../../services/usuariosService';
import { FranjasHorariasService } from '../../../services/franjasHorariasService';
import { LugaresService } from '../../../services/lugaresService';
import { EstadoCitaService } from '../../../services/estadoCitaService';

@Component({
  selector: 'app-cita-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './citas-modal.html',
  styleUrls: ['./citas-modal.css']
})
export class CitaModalComponent implements OnInit, OnChanges {
  @Input() cita: Cita | null = null;
  @Input() isOpen: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveCita = new EventEmitter<Partial<Cita>>();

  citaForm: FormGroup;
  isEditMode: boolean = false;
  
  // Separar técnicos y clientes
  tecnicos: any[] = [];
  clientes: any[] = [];
  
  franjas: any[] = [];
  lugares: any[] = [];
  estados: any[] = [];
  cargandoDatos: boolean = false;

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private franjasService: FranjasHorariasService,
    private lugaresService: LugaresService,
    private estadoCitaService: EstadoCitaService
  ) {
    this.citaForm = this.fb.group({
      observacionesCita: ['', [Validators.required, Validators.maxLength(300)]],
      idUsuarioTecnico: [null, Validators.required],
      idUsuarioCreo: [null, Validators.required],
      idFranja: [null, Validators.required],
      idLugar: [null, Validators.required],
      nombreEc: [null, Validators.required]
    });
  }

  // ✅ Se mantiene ngOnInit para cargar datos de selects
  ngOnInit(): void {
    this.cargarDatos();
  }

  // ✅ AGREGADO: Detectar cambios en los inputs
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cita'] || changes['isOpen']) {
      this.actualizarFormulario();
    }
  }

  // ✅ NUEVO: Método para actualizar el formulario según el modo
  private actualizarFormulario(): void {
    if (this.cita && this.isOpen) {
      // Modo EDICIÓN
      this.isEditMode = true;
      this.citaForm.patchValue({
        observacionesCita: this.cita.observacionesCita,
        idUsuarioTecnico: this.cita.usuarioTecnico?.idUsuario || null,
        idUsuarioCreo: this.cita.usuarioCreo?.idUsuario || null,
        idFranja: this.cita.franjaHoraria?.idFranja || null,
        idLugar: this.cita.lugar?.idLugar || null,
        nombreEc: this.cita.estadoCita?.nombreEc || null
      });
    } else if (this.isOpen) {
      // Modo CREACIÓN
      this.isEditMode = false;
      this.citaForm.reset({
        observacionesCita: '',
        idUsuarioTecnico: null,
        idUsuarioCreo: null,
        idFranja: null,
        idLugar: null,
        nombreEc: null
      });
    }
  }

  cargarDatos(): void {
    this.cargandoDatos = true;
    
    // Cargar técnicos (usuarios con cargo TECNICO)
    this.usuariosService.obtenerPorCargo('TECNICO').subscribe({
      next: (r) => { 
        if (r.success) {
          this.tecnicos = r.data;
          console.log('✅ Técnicos cargados:', this.tecnicos.length);
        }
      },
      error: (err) => console.error('❌ Error cargando técnicos:', err)
    });
    
    // Cargar clientes (usuarios con cargo CLIENTE)
    this.usuariosService.obtenerPorCargo('CLIENTE').subscribe({
      next: (r) => { 
        if (r.success) {
          this.clientes = r.data;
          console.log('✅ Clientes cargados:', this.clientes.length);
        }
      },
      error: (err) => console.error('❌ Error cargando clientes:', err)
    });
    
    this.franjasService.obtenerTodos().subscribe({
      next: (r) => { 
        if (r.success) {
          this.franjas = r.data;
          console.log('✅ Franjas cargadas:', this.franjas.length);
        }
      },
      error: (err) => console.error('❌ Error cargando franjas:', err)
    });
    
    this.lugaresService.obtenerTodos().subscribe({
      next: (r) => { 
        if (r.success) {
          this.lugares = r.data;
          console.log('✅ Lugares cargados:', this.lugares.length);
        }
      },
      error: (err) => console.error('❌ Error cargando lugares:', err)
    });
    
    this.estadoCitaService.obtenerTodos().subscribe({
      next: (r) => { 
        if (r.success) {
          this.estados = r.data;
          console.log('✅ Estados cargados:', this.estados.length);
        }
        this.cargandoDatos = false;
      },
      error: (err) => {
        console.error('❌ Error cargando estados:', err);
        this.cargandoDatos = false;
      }
    });
  }

  obtenerNombreCompleto(usuario: any): string {
    if (!usuario) return '';
    const partes = [
      usuario.nombreUs,
      usuario.apellidoUs,
      usuario.apellido2Us
    ].filter(p => p);
    return partes.join(' ');
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '';
    return new Date(fecha).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  onSubmit(): void {
    if (this.citaForm.valid) {
      const v = this.citaForm.value;
      const citaData: Partial<Cita> = {
        observacionesCita: v.observacionesCita?.trim(),
        usuarioTecnico: { idUsuario: v.idUsuarioTecnico },
        usuarioCreo: { idUsuario: v.idUsuarioCreo },
        franjaHoraria: { idFranja: v.idFranja },
        lugar: { idLugar: v.idLugar },
        estadoCita: { nombreEc: v.nombreEc }
      };
      this.saveCita.emit(citaData);
    }
  }

  onClose(): void {
    this.citaForm.reset({
      observacionesCita: '',
      idUsuarioTecnico: null,
      idUsuarioCreo: null,
      idFranja: null,
      idLugar: null,
      nombreEc: null
    });
    this.closeModal.emit();
  }

  get observacionesCita() { 
    return this.citaForm.get('observacionesCita'); 
  }
  
  get idUsuarioTecnico() { 
    return this.citaForm.get('idUsuarioTecnico'); 
  }
  
  get idUsuarioCreo() { 
    return this.citaForm.get('idUsuarioCreo'); 
  }
  
  get idFranja() { 
    return this.citaForm.get('idFranja'); 
  }
  
  get idLugar() { 
    return this.citaForm.get('idLugar'); 
  }
  
  get nombreEc() { 
    return this.citaForm.get('nombreEc'); 
  }
}