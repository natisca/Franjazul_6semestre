
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PermisosService, Permiso } from '../../../../services/permisosService';
import { PermisoModalComponent } from '../../../modals/permiso-modal/permiso-modal'; 

@Component({
  selector: 'app-permisos',
  standalone: true,
  imports: [CommonModule, RouterModule, PermisoModalComponent],
  templateUrl: './permisos.html',
  styleUrls: ['./permisos.css']
})
export class Permisos implements OnInit {
  permisos: Permiso[] = [];
  cargando: boolean = false;
  error: string = '';
  
  // Estados del modal
  isModalOpen: boolean = false;
  permisoSeleccionado: Permiso | null = null;
  
  // Estado de operaciones
  guardando: boolean = false;

  constructor(private permisosService: PermisosService) {}

  ngOnInit(): void {
    this.cargarPermisos();
  }

  cargarPermisos(): void {
    this.cargando = true;
    this.error = '';
    
    this.permisosService.obtenerTodos().subscribe({
      next: (response) => {
        if (response.success) {
          this.permisos = response.data;
          console.log('Permisos cargados:', this.permisos);
        } else {
          this.mostrarError(response.message);
        }
        this.cargando = false;
      },
      error: (err) => {
        this.mostrarError('Error al cargar los permisos. Verifique que el servidor esté funcionando.');
        console.error('Error:', err);
        this.cargando = false;
      }
    });
  }

  // Abrir modal para crear nuevo permiso
  abrirModalNuevo(): void {
    this.permisoSeleccionado = null;
    this.isModalOpen = true;
  }

  // Abrir modal para editar permiso existente
  abrirModalEditar(permiso: Permiso): void {
    this.permisoSeleccionado = { ...permiso };
    this.isModalOpen = true;
  }

  // Cerrar modal
  cerrarModal(): void {
    this.isModalOpen = false;
    this.permisoSeleccionado = null;
  }

  // Guardar permiso (crear o actualizar)
  guardarPermiso(permisoData: Partial<Permiso>): void {
    this.guardando = true;

    if (this.permisoSeleccionado && this.permisoSeleccionado.idPerEnPerm && this.permisoSeleccionado.idFormEnPerm) {
      // Actualizar permiso existente
      this.permisosService.actualizar(
        this.permisoSeleccionado.idPerEnPerm,
        this.permisoSeleccionado.idFormEnPerm,
        permisoData
      ).subscribe({
        next: (response) => {
          if (response.success) {
            this.mostrarExito('Permiso actualizado correctamente');
            this.cerrarModal();
            this.cargarPermisos();
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
      // Crear nuevo permiso
      this.permisosService.crear(permisoData).subscribe({
        next: (response) => {
          if (response.success) {
            this.mostrarExito('Permiso creado correctamente');
            this.cerrarModal();
            this.cargarPermisos();
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

  // Eliminar permiso
  eliminarPermiso(permiso: Permiso): void {
    const nombrePerfil = permiso.perfil?.nombrePer || 'Desconocido';
    const nombreFormulario = permiso.formulario?.tituloForm || 'Desconocido';
    
    const confirmar = confirm(
      `¿Está seguro de que desea eliminar el permiso?\n\nPerfil: ${nombrePerfil}\nFormulario: ${nombreFormulario}\n\nEsta acción no se puede deshacer.`
    );
    
    if (!confirmar) {
      return;
    }

    this.permisosService.eliminar(permiso.idPerEnPerm, permiso.idFormEnPerm).subscribe({
      next: (response) => {
        if (response.success) {
          this.mostrarExito('Permiso eliminado correctamente');
          this.cargarPermisos();
        } else {
          this.mostrarError(response.message);
        }
      },
      error: (err) => {
        this.manejarErrorOperacion(err, 'eliminar');
      }
    });
  }

  // Obtener icono para el permiso
  obtenerIconoPermiso(valor: number, tipo: string): { icono: string; color: string; activo: boolean } {
    const activo = valor === 1;
    let color = activo ? 'text-green-500' : 'text-gray-300 dark:text-gray-600';
    let icono = '';

    switch (tipo) {
      case 'leer':
        icono = 'eye';
        color = activo ? 'text-blue-500' : color;
        break;
      case 'crear':
        icono = 'plus';
        color = activo ? 'text-green-500' : color;
        break;
      case 'editar':
        icono = 'pencil';
        color = activo ? 'text-yellow-500' : color;
        break;
      case 'borrar':
        icono = 'trash';
        color = activo ? 'text-red-500' : color;
        break;
    }

    return { icono, color, activo };
  }

  // Manejo de errores de operaciones
  private manejarErrorOperacion(err: any, operacion: string): void {
    console.error(`Error al ${operacion}:`, err);
    
    let mensajeError = `Error al ${operacion} el permiso.`;
    
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
