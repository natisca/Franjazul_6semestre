
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RolesService, Rol } from '../../../../services/rolesService';
import { RolModalComponent } from '../../../modals/rol-modal/rol-modal'; 

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, RouterModule, RolModalComponent],
  templateUrl: './roles.html',
  styleUrls: ['./roles.css']
})

export class Roles implements OnInit {
  roles: Rol[] = [];
  cargando: boolean = false;
  error: string = '';
  
  // Estados del modal
  isModalOpen: boolean = false;
  rolSeleccionado: Rol | null = null;
  
  // Estado de operaciones
  guardando: boolean = false;

  constructor(private rolesService: RolesService) {}

  ngOnInit(): void {
    this.cargarRoles();
  }

  cargarRoles(): void {
    this.cargando = true;
    this.error = '';
    
    this.rolesService.obtenerTodos().subscribe({
      next: (response) => {
        if (response.success) {
          this.roles = response.data;
          console.log('Roles cargados:', this.roles);
        } else {
          this.mostrarError(response.message);
        }
        this.cargando = false;
      },
      error: (err) => {
        this.mostrarError('Error al cargar los roles. Verifique que el servidor esté funcionando.');
        console.error('Error:', err);
        this.cargando = false;
      }
    });
  }

  // Abrir modal para crear nuevo rol
  abrirModalNuevo(): void {
    this.rolSeleccionado = null;
    this.isModalOpen = true;
  }

  // Abrir modal para editar rol existente
  abrirModalEditar(rol: Rol): void {
    this.rolSeleccionado = { ...rol }; // Clonar para no modificar el original
    this.isModalOpen = true;
  }

  // Cerrar modal
  cerrarModal(): void {
    this.isModalOpen = false;
    this.rolSeleccionado = null;
  }

  // Guardar rol (crear o actualizar)
  guardarRol(rolData: Partial<Rol>): void {
    this.guardando = true;

    if (this.rolSeleccionado && this.rolSeleccionado.idRol) {
      // Actualizar rol existente
      this.rolesService.actualizar(this.rolSeleccionado.idRol, rolData).subscribe({
        next: (response) => {
          if (response.success) {
            this.mostrarExito('Rol actualizado correctamente');
            this.cerrarModal();
            this.cargarRoles();
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
      // Crear nuevo rol
      this.rolesService.crear(rolData as Rol).subscribe({
        next: (response) => {
          if (response.success) {
            this.mostrarExito('Rol creado correctamente');
            this.cerrarModal();
            this.cargarRoles();
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

  // Eliminar rol
  eliminarRol(id: number): void {
    const confirmar = confirm('¿Está seguro de que desea eliminar este rol?\n\nEsta acción no se puede deshacer.');
    
    if (!confirmar) {
      return;
    }

    this.rolesService.eliminar(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.mostrarExito('Rol eliminado correctamente');
          this.cargarRoles();
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
    
    let mensajeError = `Error al ${operacion} el rol.`;
    
    if (err.error?.message) {
      mensajeError = err.error.message;
    } else if (err.error?.error) {
      // Mapear errores comunes
      switch(err.error.error) {
        case 'DataIntegrityViolationException':
          mensajeError = 'Error de integridad de datos. Verifica que el nombre del rol no esté duplicado o que no existan dependencias.';
          break;
        case 'RuntimeException':
          mensajeError = err.error.message || 'Error en el servidor al procesar la solicitud.';
          break;
        default:
          mensajeError = `Error en el servidor: ${err.error.error}`;
      }
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
