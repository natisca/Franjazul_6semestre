
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EstadoCitaService, EstadoCita } from '../../../../services/estadoCitaService'; 
import { EstadoCitaModalComponent } from '../../../modals/estado-cita-modal/estado-cita-modal'; 
@Component({
  selector: 'app-estado-cita',
  standalone: true,
  imports: [CommonModule, RouterModule, EstadoCitaModalComponent],
  templateUrl: './estado-cita.html',
  styleUrls: ['./estado-cita.css']
})

export class EstadoCitas implements OnInit {
  estadosCita: EstadoCita[] = [];
  cargando: boolean = false;
  error: string = '';
  
  // Estados del modal
  isModalOpen: boolean = false;
  estadoCitaSeleccionado: EstadoCita | null = null;
  
  // Estado de operaciones
  guardando: boolean = false;

  constructor(private estadoCitaService: EstadoCitaService) {}

  ngOnInit(): void {
    this.cargarEstadosCita();
  }

  cargarEstadosCita(): void {
    this.cargando = true;
    this.error = '';
    
    this.estadoCitaService.obtenerTodos().subscribe({
      next: (response) => {
        if (response.success) {
          this.estadosCita = response.data;
          console.log('Estados de cita cargados:', this.estadosCita);
        } else {
          this.mostrarError(response.message);
        }
        this.cargando = false;
      },
      error: (err) => {
        this.mostrarError('Error al cargar los estados de cita. Verifique que el servidor esté funcionando.');
        console.error('Error:', err);
        this.cargando = false;
      }
    });
  }

  // Abrir modal para crear nuevo estado de cita
  abrirModalNuevo(): void {
    this.estadoCitaSeleccionado = null;
    this.isModalOpen = true;
  }

  // Abrir modal para editar estado de cita existente
  abrirModalEditar(estadoCita: EstadoCita): void {
    this.estadoCitaSeleccionado = { ...estadoCita };
    this.isModalOpen = true;
  }

  // Cerrar modal
  cerrarModal(): void {
    this.isModalOpen = false;
    this.estadoCitaSeleccionado = null;
  }

  // Guardar estado de cita (crear o actualizar)
  guardarEstadoCita(estadoCitaData: Partial<EstadoCita>): void {
    this.guardando = true;

    if (this.estadoCitaSeleccionado && this.estadoCitaSeleccionado.nombreEc) {
      // Actualizar estado de cita existente
      // Solo se puede actualizar la descripción
      this.estadoCitaService.actualizar(this.estadoCitaSeleccionado.nombreEc, {
        descripcionEc: estadoCitaData.descripcionEc
      }).subscribe({
        next: (response) => {
          if (response.success) {
            this.mostrarExito('Estado de cita actualizado correctamente');
            this.cerrarModal();
            this.cargarEstadosCita();
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
      // Crear nuevo estado de cita
      // Convertir nombre a mayúsculas
      const estadoCitaACrear: EstadoCita = {
        nombreEc: estadoCitaData.nombreEc?.toUpperCase() || '',
        descripcionEc: estadoCitaData.descripcionEc || ''
      };

      this.estadoCitaService.crear(estadoCitaACrear).subscribe({
        next: (response) => {
          if (response.success) {
            this.mostrarExito('Estado de cita creado correctamente');
            this.cerrarModal();
            this.cargarEstadosCita();
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

  // Eliminar estado de cita
  eliminarEstadoCita(nombreEc: string): void {
    const confirmar = confirm(
      `¿Está seguro de que desea eliminar el estado "${nombreEc}"?\n\nEsta acción no se puede deshacer.`
    );
    
    if (!confirmar) {
      return;
    }

    this.estadoCitaService.eliminar(nombreEc).subscribe({
      next: (response) => {
        if (response.success) {
          this.mostrarExito('Estado de cita eliminado correctamente');
          this.cargarEstadosCita();
        } else {
          this.mostrarError(response.message);
        }
      },
      error: (err) => {
        this.manejarErrorOperacion(err, 'eliminar');
      }
    });
  }

  // Obtener color del badge según el estado
  obtenerColorBadge(nombreEc: string): string {
    const nombre = nombreEc.toUpperCase();
    
    if (nombre.includes('PENDIENTE')) {
      return 'bg-blue-100 text-blue-800 dark:bg-yellow-900 dark:text-yellow-200';
    } else if (nombre.includes('CONFIRMADA') || nombre.includes('ACTIVA')) {
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    } else if (nombre.includes('CANCELADA') || nombre.includes('RECHAZADA')) {
      return 'bg-blue-100 text-blue-800 dark:bg-red-900 dark:text-red-200';
    } else if (nombre.includes('COMPLETADA') || nombre.includes('FINALIZADA')) {
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    } else {
      return 'bg-blue-100 text-blue-800 dark:bg-gray-900 dark:text-gray-200';
    }
  }

  // Manejo de errores de operaciones
  private manejarErrorOperacion(err: any, operacion: string): void {
    console.error(`Error al ${operacion}:`, err);
    
    let mensajeError = `Error al ${operacion} el estado de cita.`;
    
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
