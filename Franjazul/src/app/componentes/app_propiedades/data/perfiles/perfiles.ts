// src/app/pages/perfiles/perfiles.component.ts

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PerfilesService, Perfil } from '../../../../services/perfilesService'; 
import { PerfilModalComponent } from '../../../modals/perfil-modal/perfil-modal'; 

@Component({
  selector: 'app-perfiles',
  standalone: true,
  imports: [CommonModule, RouterModule, PerfilModalComponent],
  templateUrl: './perfiles.html',
  styleUrls: ['./perfiles.css']
})
export class Perfiles implements OnInit {
  perfiles: Perfil[] = [];
  cargando: boolean = false;
  error: string = '';
  
  // Estados del modal
  isModalOpen: boolean = false;
  perfilSeleccionado: Perfil | null = null;
  
  // Estado de operaciones
  guardando: boolean = false;

  constructor(private perfilesService: PerfilesService) {}

  ngOnInit(): void {
    this.cargarPerfiles();
  }

  cargarPerfiles(): void {
    this.cargando = true;
    this.error = '';
    
    this.perfilesService.obtenerTodos().subscribe({
      next: (response) => {
        if (response.success) {
          this.perfiles = response.data;
          console.log('Perfiles cargados:', this.perfiles);
        } else {
          this.mostrarError(response.message);
        }
        this.cargando = false;
      },
      error: (err) => {
        this.mostrarError('Error al cargar los perfiles. Verifique que el servidor esté funcionando.');
        console.error('Error:', err);
        this.cargando = false;
      }
    });
  }

  // Abrir modal para crear nuevo perfil
  abrirModalNuevo(): void {
    this.perfilSeleccionado = null;
    this.isModalOpen = true;
  }

  // Abrir modal para editar perfil existente
  abrirModalEditar(perfil: Perfil): void {
    this.perfilSeleccionado = { ...perfil };
    this.isModalOpen = true;
  }

  // Cerrar modal
  cerrarModal(): void {
    this.isModalOpen = false;
    this.perfilSeleccionado = null;
  }

  // Guardar perfil (crear o actualizar)
  guardarPerfil(perfilData: Partial<Perfil>): void {
    this.guardando = true;

    if (this.perfilSeleccionado && this.perfilSeleccionado.idPer) {
      // Actualizar perfil existente
      this.perfilesService.actualizar(this.perfilSeleccionado.idPer, perfilData).subscribe({
        next: (response) => {
          if (response.success) {
            this.mostrarExito('Perfil actualizado correctamente');
            this.cerrarModal();
            this.cargarPerfiles();
          } else {
            this.mostrarError(response.message);
          }
          this.guardando = false;
        },
        error: (err) => {
          this.manejarErrorOperacion(err, 'actualizar');
          this.guardando = false;
        }
      });
    } else {
      // Crear nuevo perfil
      this.perfilesService.crear(perfilData).subscribe({
        next: (response) => {
          if (response.success) {
            this.mostrarExito('Perfil creado correctamente');
            this.cerrarModal();
            this.cargarPerfiles();
          } else {
            this.mostrarError(response.message);
          }
          this.guardando = false;
        },
        error: (err) => {
          this.manejarErrorOperacion(err, 'crear');
          this.guardando = false;
        }
      });
    }
  }

  // Eliminar perfil
  eliminarPerfil(id: number): void {
    const confirmar = confirm('¿Está seguro de que desea eliminar este perfil?\n\nEsta acción no se puede deshacer.');
    
    if (!confirmar) {
      return;
    }

    this.perfilesService.eliminar(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.mostrarExito('Perfil eliminado correctamente');
          this.cargarPerfiles();
        } else {
          this.mostrarError(response.message);
        }
      },
      error: (err) => {
        this.manejarErrorOperacion(err, 'eliminar');
      }
    });
  }

  // Manejo de errores de operaciones
  private manejarErrorOperacion(err: any, operacion: string): void {
    console.error(`Error al ${operacion}:`, err);
    
    let mensajeError = `Error al ${operacion} el perfil.`;
    
    if (err.error?.message) {
      mensajeError = err.error.message;
    } else if (err.status === 0) {
      mensajeError = 'No se puede conectar con el servidor. Verifica tu conexión.';
    } else if (err.status === 404) {
      mensajeError = 'El recurso solicitado no fue encontrado.';
    } else if (err.status === 500) {
      mensajeError = 'Error interno del servidor. Contacta al administrador.';
    }
    
    this.mostrarError(mensajeError);
  }

  // Mostrar mensaje de error
  private mostrarError(mensaje: string): void {
    this.error = mensaje;
    alert('❌ ' + mensaje);
  }

  // Mostrar mensaje de éxito
  private mostrarExito(mensaje: string): void {
    alert('✅ ' + mensaje);
  }
}
