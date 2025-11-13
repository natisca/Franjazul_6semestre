
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ServiciosService, Servicio } from '../../../../services/serviciosService';
import { ServicioModalComponent } from '../../../modals/servicios-modal/servicios-modal'; 

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, RouterModule, ServicioModalComponent],
  templateUrl: './servicios.html',
  styleUrls: ['./servicios.css']
})
export class ServiciosComponent implements OnInit {
  servicios: Servicio[] = [];
  cargando: boolean = false;
  error: string = '';
  isModalOpen: boolean = false;
  servicioSeleccionado: Servicio | null = null;

  constructor(private serviciosService: ServiciosService) {}

  ngOnInit(): void {
    this.cargarServicios();
  }

  cargarServicios(): void {
    this.cargando = true;
    this.error = '';
    this.serviciosService.obtenerTodos().subscribe({
      next: (response) => {
        if (response.success) {
          this.servicios = response.data;
        } else {
          this.mostrarError(response.message);
        }
        this.cargando = false;
      },
      error: (err) => {
        this.mostrarError('Error al cargar los servicios.');
        this.cargando = false;
      }
    });
  }

  abrirModalNuevo(): void {
    this.servicioSeleccionado = null;
    this.isModalOpen = true;
  }

  abrirModalEditar(servicio: Servicio): void {
    this.servicioSeleccionado = { ...servicio };
    this.isModalOpen = true;
  }

  cerrarModal(): void {
    this.isModalOpen = false;
    this.servicioSeleccionado = null;
  }

  guardarServicio(servicioData: Partial<Servicio>): void {
    if (this.servicioSeleccionado?.idServicio) {
      this.serviciosService.actualizar(this.servicioSeleccionado.idServicio, servicioData).subscribe({
        next: (response) => {
          if (response.success) {
            this.mostrarExito('Servicio actualizado');
            this.cerrarModal();
            this.cargarServicios();
          }
        },
        error: (err) => this.mostrarError(err.error?.message || 'Error al actualizar')
      });
    } else {
      this.serviciosService.crear(servicioData).subscribe({
        next: (response) => {
          if (response.success) {
            this.mostrarExito('Servicio creado');
            this.cerrarModal();
            this.cargarServicios();
          }
        },
        error: (err) => this.mostrarError(err.error?.message || 'Error al crear')
      });
    }
  }

  eliminarServicio(id: number, nombre: string): void {
    if (confirm(`¿Eliminar "${nombre}"?`)) {
      this.serviciosService.eliminar(id).subscribe({
        next: () => {
          this.mostrarExito('Servicio eliminado');
          this.cargarServicios();
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
