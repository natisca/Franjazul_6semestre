// src/app/components/modals/permiso-modal/permiso-modal.component.ts

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Permiso } from '../../../services/permisosService';
import { Perfil, PerfilesService } from '../../../services/perfilesService';
import { Formulario, FormulariosService } from '../../../services/formulariosService';

@Component({
  selector: 'app-permiso-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './permiso-modal.html',
  styleUrls: ['./permiso-modal.css']
})
export class PermisoModalComponent implements OnInit {
  @Input() permiso: Permiso | null = null;
  @Input() isOpen: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() savePermiso = new EventEmitter<Partial<Permiso>>();

  permisoForm: FormGroup;
  isEditMode: boolean = false;
  perfiles: Perfil[] = [];
  formularios: Formulario[] = [];
  cargandoPerfiles: boolean = false;
  cargandoFormularios: boolean = false;

  constructor(
    private fb: FormBuilder,
    private perfilesService: PerfilesService,
    private formulariosService: FormulariosService
  ) {
    this.permisoForm = this.fb.group({
      idPerEnPerm: [null, [Validators.required]],
      idFormEnPerm: [null, [Validators.required]],
      puedeCrear: [0],
      puedeBorrar: [0],
      puedeEditar: [0],
      puedeLeer: [0]
    });
  }

  ngOnInit(): void {
    this.cargarPerfiles();
    this.cargarFormularios();
    
    if (this.permiso) {
      this.isEditMode = true;
      this.permisoForm.patchValue({
        idPerEnPerm: this.permiso.idPerEnPerm,
        idFormEnPerm: this.permiso.idFormEnPerm,
        puedeCrear: this.permiso.puedeCrear,
        puedeBorrar: this.permiso.puedeBorrar,
        puedeEditar: this.permiso.puedeEditar,
        puedeLeer: this.permiso.puedeLeer
      });
      
      // En modo edición, no se pueden cambiar las PKs
      this.permisoForm.get('idPerEnPerm')?.disable();
      this.permisoForm.get('idFormEnPerm')?.disable();
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

  cargarFormularios(): void {
    this.cargandoFormularios = true;
    this.formulariosService.obtenerTodos().subscribe({
      next: (response) => {
        if (response.success) {
          this.formularios = response.data;
        }
        this.cargandoFormularios = false;
      },
      error: () => {
        this.cargandoFormularios = false;
      }
    });
  }

  // Marcar/desmarcar todos los permisos
  toggleTodosPermisos(event: any): void {
    const value = event.target.checked ? 1 : 0;
    this.permisoForm.patchValue({
      puedeCrear: value,
      puedeBorrar: value,
      puedeEditar: value,
      puedeLeer: value
    });
  }

  // Verificar si todos están marcados
  get todosMarcados(): boolean {
    const form = this.permisoForm.value;
    return form.puedeCrear === 1 && form.puedeBorrar === 1 && 
           form.puedeEditar === 1 && form.puedeLeer === 1;
  }

  onSubmit(): void {
    if (this.permisoForm.valid) {
      const formValue = this.isEditMode ? this.permisoForm.getRawValue() : this.permisoForm.value;
      this.savePermiso.emit(formValue);
    }
  }

  onClose(): void {
    this.closeModal.emit();
  }

  get idPerEnPerm() { return this.permisoForm.get('idPerEnPerm'); }
  get idFormEnPerm() { return this.permisoForm.get('idFormEnPerm'); }
}
