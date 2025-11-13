// src/app/pages/citas/citas.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CitasService, Cita } from '../../../../services/citasService';
import { CitaModalComponent } from '../../../modals/citas-modal/citas-modal'; 

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, CitaModalComponent],
  templateUrl: './citas.html',
  styleUrls: ['./citas.css']
})
export class CitasComponent implements OnInit {
  citas: Cita[] = [];
  cargando: boolean = false;
  error: string = '';
  
  // Estados del modal
  isModalOpen: boolean = false;
  citaSeleccionada: Cita | null = null;
  
  // Estado de operaciones
  guardando: boolean = false;

  constructor(private citasService: CitasService) {}

  ngOnInit(): void {
    this.cargarCitas();
  }

  cargarCitas(): void {
    this.cargando = true;
    this.error = '';
    
    this.citasService.obtenerTodos().subscribe({
      next: (response) => {
        if (response.success) {
          this.citas = response.data;
          console.log('Citas cargadas:', this.citas);
        } else {
          this.mostrarError(response.message);
        }
        this.cargando = false;
      },
      error: (err) => {
        this.mostrarError('Error al cargar las citas. Verifique que el servidor esté funcionando.');
        console.error('Error:', err);
        this.cargando = false;
      }
    });
  }

  // Abrir modal para crear nueva cita
  abrirModalNuevo(): void {
    this.citaSeleccionada = null;
    this.isModalOpen = true;
  }

  // Abrir modal para editar cita existente
  abrirModalEditar(cita: Cita): void {
    this.citaSeleccionada = { ...cita };
    this.isModalOpen = true;
  }

  // Cerrar modal
  cerrarModal(): void {
    this.isModalOpen = false;
    this.citaSeleccionada = null;
  }

  // Guardar cita (crear o actualizar)
  guardarCita(citaData: Partial<Cita>): void {
    this.guardando = true;

    if (this.citaSeleccionada && this.citaSeleccionada.idCita) {
      // Actualizar cita existente
      this.citasService.actualizar(this.citaSeleccionada.idCita, citaData).subscribe({
        next: (response) => {
          if (response.success) {
            this.mostrarExito('Cita actualizada correctamente');
            this.cerrarModal();
            this.cargarCitas();
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
      // Crear nueva cita
      this.citasService.crear(citaData).subscribe({
        next: (response) => {
          if (response.success) {
            this.mostrarExito('Cita creada correctamente');
            this.cerrarModal();
            this.cargarCitas();
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

  // Eliminar cita
  eliminarCita(id: number): void {
    const confirmar = confirm(
      `¿Está seguro de que desea eliminar la cita #${id}?\n\nEsta acción no se puede deshacer.`
    );
    
    if (!confirmar) {
      return;
    }

    this.citasService.eliminar(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.mostrarExito('Cita eliminada correctamente');
          this.cargarCitas();
        } else {
          this.mostrarError(response.message);
        }
      },
      error: (err) => {
        this.manejarErrorOperacion(err, 'eliminar');
      }
    });
  }

  // Obtener nombre completo del usuario
  obtenerNombreCompleto(usuario: any): string {
    if (!usuario) return '';
    const partes = [
      usuario.nombreUs,
      usuario.apellidoUs,
      usuario.apellido2Us
    ].filter(p => p);
    return partes.join(' ');
  }

  // Formatear fecha
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

  // Manejo de errores de operaciones
  private manejarErrorOperacion(err: any, operacion: string): void {
    console.error(`Error al ${operacion}:`, err);
    
    let mensajeError = `Error al ${operacion} la cita.`;
    
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