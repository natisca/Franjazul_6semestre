
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CitaServicioService, CitaServicio } from '../../../../services/citaServicioService';
import { CitaServicioModalComponent } from '../../../modals/cita-servicios-modal/cita-servicios-modal'; 

@Component({
  selector: 'app-cita-servicio',
  standalone: true,
  imports: [CommonModule, CitaServicioModalComponent],
  templateUrl: './cita-servicios.html',
  styleUrls: ['./cita-servicios.css']
})
export class CitaServicioComponent implements OnInit {
  citasServicios: CitaServicio[] = [];
  cargando: boolean = false;
  error: string = '';
  isModalOpen: boolean = false;
  citaServicioSeleccionado: CitaServicio | null = null;

  constructor(private citaServicioService: CitaServicioService) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.citaServicioService.obtenerTodos().subscribe({
      next: (r) => {
        if (r.success) this.citasServicios = r.data;
        this.cargando = false;
      },
      error: () => {
        this.error = 'Error al cargar';
        this.cargando = false;
      }
    });
  }

  abrirModalNuevo(): void {
    this.citaServicioSeleccionado = null;
    this.isModalOpen = true;
  }

  abrirModalEditar(cs: CitaServicio): void {
    this.citaServicioSeleccionado = { ...cs };
    this.isModalOpen = true;
  }

  cerrarModal(): void {
    this.isModalOpen = false;
    this.citaServicioSeleccionado = null;
  }

  truncarTexto(texto: string | undefined, maxLength: number): string {
  if (!texto) return '';
  return texto.length > maxLength ? texto.substring(0, maxLength) + '...' : texto;
}

  guardar(data: Partial<CitaServicio>): void {
    if (this.citaServicioSeleccionado) {
      this.citaServicioService.actualizar(
        this.citaServicioSeleccionado.citaEnIntermedio,
        this.citaServicioSeleccionado.servicioEnIntermedio,
        data
      ).subscribe({
        next: () => {
          alert('✅ Actualizado');
          this.cerrarModal();
          this.cargar();
        },
        error: (err) => alert('❌ ' + (err.error?.message || 'Error'))
      });
    } else {
      this.citaServicioService.crear(data).subscribe({
        next: () => {
          alert('✅ Creado');
          this.cerrarModal();
          this.cargar();
        },
        error: (err) => alert('❌ ' + (err.error?.message || 'Error'))
      });
    }
  }

  eliminar(idCita: number, idServicio: number): void {
    if (confirm('¿Eliminar?')) {
      this.citaServicioService.eliminar(idCita, idServicio).subscribe({
        next: () => {
          alert('✅ Eliminado');
          this.cargar();
        },
        error: (err) => alert('❌ ' + (err.error?.message || 'Error'))
      });
    }
  }
}
