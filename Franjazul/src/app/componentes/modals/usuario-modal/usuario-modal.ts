import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Usuario } from '../../../services/usuariosService';
import { Perfil, PerfilesService } from '../../../services/perfilesService';
import { Cargo, CargosService } from '../../../services/cargosService';

@Component({
  selector: 'app-usuario-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usuario-modal.html',
  styleUrls: ['./usuario-modal.css']
})
export class UsuarioModalComponent implements OnInit, OnChanges {
  @Input() usuario: Usuario | null = null;
  @Input() isOpen: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveUsuario = new EventEmitter<Partial<Usuario>>();

  usuarioForm: FormGroup;
  isEditMode: boolean = false;
  perfiles: Perfil[] = [];
  cargos: Cargo[] = [];
  cargandoPerfiles: boolean = false;
  cargandoCargos: boolean = false;

  constructor(
    private fb: FormBuilder,
    private perfilesService: PerfilesService,
    private cargosService: CargosService
  ) {
    this.usuarioForm = this.fb.group({
      idUsuario: ['', [Validators.required, Validators.maxLength(10)]],
      nombreUs: ['', [Validators.required, Validators.maxLength(70)]],
      apellidoUs: ['', [Validators.required, Validators.maxLength(50)]],
      apellido2Us: [''],
      emailUs: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      telefonoUs: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      idPerfil: [null, [Validators.required]],
      nombreCargo: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.cargarPerfiles();
    this.cargarCargos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Se ejecuta cada vez que cambian los @Input
    if (changes['isOpen'] && this.isOpen) {
      this.inicializarFormulario();
    }
  }

  inicializarFormulario(): void {
    if (this.usuario) {
      // MODO EDICIÓN
      this.isEditMode = true;
      
      this.usuarioForm.patchValue({
        idUsuario: this.usuario.idUsuario,
        nombreUs: this.usuario.nombreUs,
        apellidoUs: this.usuario.apellidoUs,
        apellido2Us: this.usuario.apellido2Us || '',
        emailUs: this.usuario.emailUs,
        telefonoUs: this.usuario.telefonoUs,
        idPerfil: this.usuario.perfilDeUsuario?.idPer || null,
        nombreCargo: this.usuario.cargoDeUsuario?.nombreCargo || ''
      });
      
      // En modo edición, el ID no se puede cambiar
      this.usuarioForm.get('idUsuario')?.disable();
    } else {
      // MODO CREACIÓN
      this.isEditMode = false;
      
      // Resetear completamente el formulario
      this.usuarioForm.reset({
        idUsuario: '',
        nombreUs: '',
        apellidoUs: '',
        apellido2Us: '',
        emailUs: '',
        telefonoUs: '',
        idPerfil: null,
        nombreCargo: ''
      });
      
      // Asegurarse de que el ID esté habilitado
      this.usuarioForm.get('idUsuario')?.enable();
    }
  }

  cargarPerfiles(): void {
    this.cargandoPerfiles = true;
    this.perfilesService.obtenerTodos().subscribe({
      next: (response) => {
        if (response.success) {
          this.perfiles = response.data;
        }
        this.cargandoPerfiles = false;
      },
      error: () => {
        this.cargandoPerfiles = false;
      }
    });
  }

  cargarCargos(): void {
    this.cargandoCargos = true;
    this.cargosService.obtenerTodos().subscribe({
      next: (response) => {
        if (response.success) {
          this.cargos = response.data;
        }
        this.cargandoCargos = false;
      },
      error: () => {
        this.cargandoCargos = false;
      }
    });
  }

  onSubmit(): void {
    if (this.usuarioForm.valid) {
      const formValue = this.isEditMode ? this.usuarioForm.getRawValue() : this.usuarioForm.value;
      
      const usuarioData: Partial<Usuario> = {
        idUsuario: formValue.idUsuario,
        nombreUs: formValue.nombreUs,
        apellidoUs: formValue.apellidoUs,
        apellido2Us: formValue.apellido2Us || null,
        emailUs: formValue.emailUs,
        telefonoUs: formValue.telefonoUs,
        perfilDeUsuario: {
          idPer: formValue.idPerfil
        },
        cargoDeUsuario: {
          nombreCargo: formValue.nombreCargo
        }
      };

      // agregar la contraseña por defecto
      if (!this.isEditMode) {
        (usuarioData as any).passwordUs = 'franjazul123';
      }
      
      this.saveUsuario.emit(usuarioData);
    }
  }

  onClose(): void {
    this.usuarioForm.reset();
    this.closeModal.emit();
  }

  // Getters para validaciones
  get idUsuario() { return this.usuarioForm.get('idUsuario'); }
  get nombreUs() { return this.usuarioForm.get('nombreUs'); }
  get apellidoUs() { return this.usuarioForm.get('apellidoUs'); }
  get apellido2Us() { return this.usuarioForm.get('apellido2Us'); }
  get emailUs() { return this.usuarioForm.get('emailUs'); }
  get telefonoUs() { return this.usuarioForm.get('telefonoUs'); }
  get idPerfil() { return this.usuarioForm.get('idPerfil'); }
  get nombreCargo() { return this.usuarioForm.get('nombreCargo'); }
}
