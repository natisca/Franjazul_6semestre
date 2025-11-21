import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CitasService, Cita } from '../../../../services/citasService';
import { CitaModalComponent } from '../../../modals/citas-modal/citas-modal';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, CitaModalComponent, FormsModule],
  templateUrl: './citas.html',
  styleUrls: ['./citas.css']
})
export class CitasComponent implements OnInit {
  citas: Cita[] = [];
  citasFiltradas: Cita[] = [];
  citasPaginadas: Cita[] = [];
  cargando: boolean = false;
  error: string = '';
  
  // Paginación
  paginaActual: number = 1;
  registrosPorPagina: number = 5;
  totalPaginas: number = 0;
  
  // Filtrado
  terminoBusqueda: string = '';
  estadoFiltro: string = '';
  
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
          this.aplicarFiltros();
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

  // ==================== FILTRADO ====================
  
  aplicarFiltros(): void {
    const termino = this.terminoBusqueda.toLowerCase().trim();
    
    this.citasFiltradas = this.citas.filter(cita => {
      // Filtro por término de búsqueda
      const cumpleTermino = termino === '' || 
        cita.idCita.toString().includes(termino) ||
        this.obtenerNombreCompleto(cita.usuarioTecnico).toLowerCase().includes(termino) ||
        this.obtenerNombreCompleto(cita.usuarioCreo).toLowerCase().includes(termino) ||
        (cita.lugar.nombreLugar && cita.lugar.nombreLugar.toLowerCase().includes(termino)) ||
        (cita.lugar.nombreLugar && cita.lugar.nombreLugar.toLowerCase().includes(termino)) ||
        cita.estadoCita.nombreEc.toLowerCase().includes(termino) ||
        (cita.observacionesCita && cita.observacionesCita.toLowerCase().includes(termino));
      
      // Filtro por estado
      const cumpleEstado = this.estadoFiltro === '' || cita.estadoCita.nombreEc === this.estadoFiltro;
      
      return cumpleTermino && cumpleEstado;
    });
    
    // Resetear a la primera página cuando se filtra
    this.paginaActual = 1;
    this.calcularPaginacion();
  }

  limpiarFiltros(): void {
    this.terminoBusqueda = '';
    this.estadoFiltro = '';
    this.aplicarFiltros();
  }

  get estadosUnicos(): string[] {
    const estados = this.citas.map(c => c.estadoCita.nombreEc);
    return [...new Set(estados)].sort();
  }

  // ==================== PAGINACIÓN ====================
  
  calcularPaginacion(): void {
    this.totalPaginas = Math.ceil(this.citasFiltradas.length / this.registrosPorPagina);
    
    if (this.paginaActual > this.totalPaginas && this.totalPaginas > 0) {
      this.paginaActual = this.totalPaginas;
    }
    
    this.actualizarCitasPaginadas();
  }

  actualizarCitasPaginadas(): void {
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    const fin = inicio + this.registrosPorPagina;
    this.citasPaginadas = this.citasFiltradas.slice(inicio, fin);
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      this.actualizarCitasPaginadas();
    }
  }

  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.actualizarCitasPaginadas();
    }
  }

  paginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.actualizarCitasPaginadas();
    }
  }

  obtenerPaginas(): number[] {
    const paginas: number[] = [];
    const maxPaginasVisibles = 5;
    
    let inicio = Math.max(1, this.paginaActual - Math.floor(maxPaginasVisibles / 2));
    let fin = Math.min(this.totalPaginas, inicio + maxPaginasVisibles - 1);
    
    if (fin - inicio < maxPaginasVisibles - 1) {
      inicio = Math.max(1, fin - maxPaginasVisibles + 1);
    }
    
    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }
    
    return paginas;
  }

  get indiceInicio(): number {
    return (this.paginaActual - 1) * this.registrosPorPagina + 1;
  }

  get indiceFin(): number {
    return Math.min(this.paginaActual * this.registrosPorPagina, this.citasFiltradas.length);
  }

  // ==================== MODAL ====================

  abrirModalNuevo(): void {
    this.citaSeleccionada = null;
    this.isModalOpen = true;
  }

  abrirModalEditar(cita: Cita): void {
    this.citaSeleccionada = { ...cita };
    this.isModalOpen = true;
  }

  cerrarModal(): void {
    this.isModalOpen = false;
    this.citaSeleccionada = null;
  }

  guardarCita(citaData: Partial<Cita>): void {
    this.guardando = true;

    if (this.citaSeleccionada && this.citaSeleccionada.idCita) {
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

  // ==================== UTILIDADES ====================

  obtenerNombreCompleto(usuario: any): string {
    if (!usuario) return '';
    const partes = [
      usuario.nombreUs,
      usuario.apellidoUs,
      usuario.apellido2Us
    ].filter(p => p);
    return partes.join(' ');
  }

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

  getEstadoColor(estado: string): string {
    const colores: { [key: string]: string } = {
      'PENDIENTE': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'COMPLETADA': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'CANCELADA': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'REAGENDADA': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    };
    return colores[estado] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }

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

  private mostrarError(mensaje: string): void {
    this.error = mensaje;
    alert('❌ ' + mensaje);
  }

  private mostrarExito(mensaje: string): void {
    alert('✅ ' + mensaje);
  }
}
