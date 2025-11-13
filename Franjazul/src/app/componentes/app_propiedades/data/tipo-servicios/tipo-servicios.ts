
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TipoServicioService, TipoServicio } from '../../../../services/tipoServicioService'; 
import { TipoServicioModalComponent } from '../../../modals/tipo-servicios-modal/tipo-servicios-modal';

@Component({
  selector: 'app-tipo-servicio',
  standalone: true,
  imports: [CommonModule, RouterModule, TipoServicioModalComponent],
  templateUrl: './tipo-servicios.html',
  styleUrls: ['./tipo-servicios.css']
})
export class TipoServicioComponent implements OnInit {
  tiposServicio: TipoServicio[] = [];
  cargando: boolean = false;
  error: string = '';
  isModalOpen: boolean = false;
  tipoServicioSeleccionado: TipoServicio | null = null;

  constructor(private tipoServicioService: TipoServicioService) {}

  ngOnInit(): void {
    this.cargarTiposServicio();
  }

  cargarTiposServicio(): void {
    this.cargando = true;
    this.error = '';
    this.tipoServicioService.obtenerTodos().subscribe({
      next: (response) => {
        if (response.success) {
          this.tiposServicio = response.data;
        } else {
          this.mostrarError(response.message);
        }
        this.cargando = false;
      },
      error: (err) => {
        this.mostrarError('Error al cargar los tipos de servicio.');
        this.cargando = false;
      }
    });
  }

  abrirModalNuevo(): void {
    this.tipoServicioSeleccionado = null;
    this.isModalOpen = true;
  }

  abrirModalEditar(tipoServicio: TipoServicio): void {
    this.tipoServicioSeleccionado = { ...tipoServicio };
    this.isModalOpen = true;
  }

  cerrarModal(): void {
    this.isModalOpen = false;
    this.tipoServicioSeleccionado = null;
  }

  guardarTipoServicio(tipoServicioData: Partial<TipoServicio>): void {
    if (this.tipoServicioSeleccionado?.nombreTps) {
      this.tipoServicioService.actualizar(this.tipoServicioSeleccionado.nombreTps, {
        descripcionTsp: tipoServicioData.descripcionTsp
      }).subscribe({
        next: (response) => {
          if (response.success) {
            this.mostrarExito('Tipo de servicio actualizado correctamente');
            this.cerrarModal();
            this.cargarTiposServicio();
          }
        },
        error: (err) => this.mostrarError(err.error?.message || 'Error al actualizar')
      });
    } else {
      const tipoServicioACrear: TipoServicio = {
        nombreTps: tipoServicioData.nombreTps || '',
        descripcionTsp: tipoServicioData.descripcionTsp || ''
      };
      this.tipoServicioService.crear(tipoServicioACrear).subscribe({
        next: (response) => {
          if (response.success) {
            this.mostrarExito('Tipo de servicio creado correctamente');
            this.cerrarModal();
            this.cargarTiposServicio();
          }
        },
        error: (err) => this.mostrarError(err.error?.message || 'Error al crear')
      });
    }
  }

  eliminarTipoServicio(nombreTps: string): void {
    if (confirm(`¿Eliminar "${nombreTps}"?`)) {
      this.tipoServicioService.eliminar(nombreTps).subscribe({
        next: () => {
          this.mostrarExito('Tipo de servicio eliminado');
          this.cargarTiposServicio();
        },
        error: (err) => this.mostrarError(err.error?.message || 'Error al eliminar')
      });
    }
  }

  private mostrarError(mensaje: string): void {
    this.error = mensaje;
    alert('❌ ' + mensaje);
  }

  private mostrarExito(mensaje: string): void {
    alert('✅ ' + mensaje);
  }
}
