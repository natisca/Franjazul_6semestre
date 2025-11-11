// src/app/pages/franjas-horarias/franjas-horarias.component.ts

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FranjasHorariasService, FranjaHoraria } from '../../../../services/franjasHorariasService'; 
import { FranjaHorariaModalComponent } from '../../../modals/franjas-horarias-modal/franjas-horarias-modal'; 

@Component({
  selector: 'app-franjas',
  standalone: true,
  imports: [CommonModule, RouterModule, FranjaHorariaModalComponent],
  templateUrl: './franjas.html',
  styleUrls: ['./franjas.css']
})
export class FranjasHorarias implements OnInit {
  franjasHorarias: FranjaHoraria[] = [];
  cargando: boolean = false;
  error: string = '';
  
  // Estados del modal
  isModalOpen: boolean = false;
  franjaHorariaSeleccionada: FranjaHoraria | null = null;
  
  // Estado de operaciones
  guardando: boolean = false;

  constructor(private franjasHorariasService: FranjasHorariasService) {}

  ngOnInit(): void {
    this.cargarFranjasHorarias();
  }

  cargarFranjasHorarias(): void {
    this.cargando = true;
    this.error = '';
    
    this.franjasHorariasService.obtenerTodos().subscribe({
      next: (response) => {
        if (response.success) {
          this.franjasHorarias = response.data;
          console.log('Franjas horarias cargadas:', this.franjasHorarias);
        } else {
          this.mostrarError(response.message);
        }
        this.cargando = false;
      },
      error: (err) => {
        this.mostrarError('Error al cargar las franjas horarias. Verifique que el servidor esté funcionando.');
        console.error('Error:', err);
        this.cargando = false;
      }
    });
  }

  // Abrir modal para crear nueva franja horaria
  abrirModalNuevo(): void {
    this.franjaHorariaSeleccionada = null;
    this.isModalOpen = true;
  }

  // Abrir modal para editar franja horaria existente
  abrirModalEditar(franjaHoraria: FranjaHoraria): void {
    this.franjaHorariaSeleccionada = { ...franjaHoraria };
    this.isModalOpen = true;
  }

  // Cerrar modal
  cerrarModal(): void {
    this.isModalOpen = false;
    this.franjaHorariaSeleccionada = null;
  }

  // Guardar franja horaria (crear o actualizar)
  guardarFranjaHoraria(franjaHorariaData: Partial<FranjaHoraria>): void {
    this.guardando = true;

    if (this.franjaHorariaSeleccionada && this.franjaHorariaSeleccionada.idFranja) {
      // Actualizar franja horaria existente
      this.franjasHorariasService.actualizar(this.franjaHorariaSeleccionada.idFranja, franjaHorariaData).subscribe({
        next: (response) => {
          if (response.success) {
            this.mostrarExito('Franja horaria actualizada correctamente');
            this.cerrarModal();
            this.cargarFranjasHorarias();
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
      // Crear nueva franja horaria
      this.franjasHorariasService.crear(franjaHorariaData).subscribe({
        next: (response) => {
          if (response.success) {
            this.mostrarExito('Franja horaria creada correctamente');
            this.cerrarModal();
            this.cargarFranjasHorarias();
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

  // Eliminar franja horaria
  eliminarFranjaHoraria(id: number): void {
    const confirmar = confirm(
      `¿Está seguro de que desea eliminar esta franja horaria?\n\nEsta acción no se puede deshacer.`
    );
    
    if (!confirmar) {
      return;
    }

    this.franjasHorariasService.eliminar(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.mostrarExito('Franja horaria eliminada correctamente');
          this.cargarFranjasHorarias();
        } else {
          this.mostrarError(response.message);
        }
      },
      error: (err) => {
        this.manejarErrorOperacion(err, 'eliminar');
      }
    });
  }

  // Formatear fecha para mostrar
  formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Calcular duración en horas
  calcularDuracion(fechaInicio: string, fechaFin: string): string {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const diffMs = fin.getTime() - inicio.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHrs > 0 && diffMins > 0) {
      return `${diffHrs}h ${diffMins}m`;
    } else if (diffHrs > 0) {
      return `${diffHrs}h`;
    } else {
      return `${diffMins}m`;
    }
  }

  // Manejo de errores de operaciones
  private manejarErrorOperacion(err: any, operacion: string): void {
    console.error(`Error al ${operacion}:`, err);
    
    let mensajeError = `Error al ${operacion} la franja horaria.`;
    
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
