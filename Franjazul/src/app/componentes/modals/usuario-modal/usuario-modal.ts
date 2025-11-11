
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
export class UsuarioModalComponent implements OnInit {
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
  mostrarPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private perfilesService: PerfilesService,
    private cargosService: CargosService
  ) {
    this.usuarioForm = this.fb.group({
      idUsuario: ['', [Validators.required, Validators.maxLength(10)]],
      nombreUs: ['', [Validators.required, Validators.maxLength(70)]],
      apellidoUs: ['', [Validators.required, Validators.maxLength(50)]],
      apellido2Us: ['', [Validators.maxLength(50)]],
      emailUs: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      passwordUs: ['', [Validators.required, Validators.maxLength(50)]],
      telefonoUs: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      idPerfil: [null, [Validators.required]],
      nombreCargo: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.cargarPerfiles();
    this.cargarCargos();
    
    if (this.usuario) {
      this.isEditMode = true;
      this.usuarioForm.patchValue({
        idUsuario: this.usuario.idUsuario,
        nombreUs: this.usuario.nombreUs,
        apellidoUs: this.usuario.apellidoUs,
        apellido2Us: this.usuario.apellido2Us,
        emailUs: this.usuario.emailUs,
        passwordUs: this.usuario.passwordUs,
        telefonoUs: this.usuario.telefonoUs,
        idPerfil: this.usuario.perfilDeUsuario.idPer,
        nombreCargo: this.usuario.cargoDeUsuario.nombreCargo
      });
      
      // En modo edición, el ID no se puede cambiar
      this.usuarioForm.get('idUsuario')?.disable();
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

  toggleMostrarPassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
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
        passwordUs: formValue.passwordUs,
        telefonoUs: Number(formValue.telefonoUs),
        perfilDeUsuario: {
          idPer: formValue.idPerfil
        },
        cargoDeUsuario: {
          nombreCargo: formValue.nombreCargo
        }
      };
      
      this.saveUsuario.emit(usuarioData);
    }
  }

  onClose(): void {
    this.closeModal.emit();
  }

  // Getters para validaciones
  get idUsuario() { return this.usuarioForm.get('idUsuario'); }
  get nombreUs() { return this.usuarioForm.get('nombreUs'); }
  get apellidoUs() { return this.usuarioForm.get('apellidoUs'); }
  get apellido2Us() { return this.usuarioForm.get('apellido2Us'); }
  get emailUs() { return this.usuarioForm.get('emailUs'); }
  get passwordUs() { return this.usuarioForm.get('passwordUs'); }
  get telefonoUs() { return this.usuarioForm.get('telefonoUs'); }
  get idPerfil() { return this.usuarioForm.get('idPerfil'); }
  get nombreCargo() { return this.usuarioForm.get('nombreCargo'); }
}
