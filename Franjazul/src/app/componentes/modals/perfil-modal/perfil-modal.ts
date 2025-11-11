
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Perfil } from '../../../services/perfilesService'; 
import { Rol, RolesService } from '../../../services/rolesService';

@Component({
  selector: 'app-perfil-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil-modal.html',
  styleUrls: ['./perfil-modal.css']
})
export class PerfilModalComponent implements OnInit {
  @Input() perfil: Perfil | null = null;
  @Input() isOpen: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() savePerfil = new EventEmitter<Partial<Perfil>>();

  perfilForm: FormGroup;
  isEditMode: boolean = false;
  roles: Rol[] = [];
  cargandoRoles: boolean = false;

  constructor(
    private fb: FormBuilder,
    private rolesService: RolesService
  ) {
    this.perfilForm = this.fb.group({
      nombrePer: ['', [Validators.required, Validators.maxLength(20)]],
      descripcionPer: ['', [Validators.required, Validators.maxLength(100)]],
      idRol: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.cargarRoles();
    
    if (this.perfil) {
      this.isEditMode = true;
      this.perfilForm.patchValue({
        nombrePer: this.perfil.nombrePer,
        descripcionPer: this.perfil.descripcionPer,
        idRol: this.perfil.rol.idRol
      });
    }
  }

  cargarRoles(): void {
    this.cargandoRoles = true;
    this.rolesService.obtenerTodos().subscribe({
      next: (response) => {
        if (response.success) {
          this.roles = response.data;
        }
        this.cargandoRoles = false;
      },
      error: () => {
        this.cargandoRoles = false;
      }
    });
  }

  onSubmit(): void {
    if (this.perfilForm.valid) {
      const formValue = this.perfilForm.value;
      const perfilData: Partial<Perfil> = {
        nombrePer: formValue.nombrePer,
        descripcionPer: formValue.descripcionPer,
        rol: {
          idRol: formValue.idRol
        }
      };
      this.savePerfil.emit(perfilData);
    }
  }

  onClose(): void {
    this.closeModal.emit();
  }

  get nombrePer() {
    return this.perfilForm.get('nombrePer');
  }

  get descripcionPer() {
    return this.perfilForm.get('descripcionPer');
  }

  get idRol() {
    return this.perfilForm.get('idRol');
  }
}
