
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportesService } from '../../../services/reportesService';
import { UsuariosService } from '../../../services/usuariosService';
import { EstadoCitaService } from '../../../services/estadoCitaService';
import { TipoServicioService } from '../../../services/tipoServicioService';
import { ReporteCitaPorPeriodo, ReporteProductividadTecnico, ReporteServiciosSolicitados } from '../../../interfaces/reportes.interface';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css'
})
export class Reportes implements OnInit {
  // Reporte activo
  reporteActivo: 'citas' | 'productividad' | 'servicios' = 'citas';

  // Estados de carga
  cargandoDatos = false;
  descargandoExcel = false;

  // Filtros comunes
  fechaInicio: string = '';
  fechaFin: string = '';

  // Filtros específicos
  estadoSeleccionado: string = '';
  tecnicoSeleccionado: string = '';
  tipoServicioSeleccionado: string = '';

  // Datos de los reportes
  datosCitas: ReporteCitaPorPeriodo[] = [];
  datosProductividad: ReporteProductividadTecnico[] = [];
  datosServicios: ReporteServiciosSolicitados[] = [];

  // Listas para filtros
  tecnicos: any[] = [];
  estadosCita: any[] = [];
  tiposServicio: any[] = [];

  // Mensajes
  mensaje: string = '';
  tipoMensaje: 'success' | 'error' | '' = '';

  constructor(
    private reportesService: ReportesService,
    private usuariosService: UsuariosService,
    private estadoCitaService: EstadoCitaService,
    private tipoServicioService: TipoServicioService
  ) {
    // Configurar fechas por defecto (último mes)
    const hoy = new Date();
    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);

    this.fechaFin = this.formatearFechaParaInput(hoy);
    this.fechaInicio = this.formatearFechaParaInput(hace30Dias);
  }

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales(): void {
    // Cargar técnicos
    this.usuariosService.obtenerTodos().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.tecnicos = response.data.filter((u: any) => u.cargoDeUsuario?.nombreCargo === 'TECNICO');
        }
      },
      error: (error) => console.error('Error cargando técnicos:', error)
    });

    // Cargar estados de cita
    this.estadoCitaService.obtenerTodos().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.estadosCita = response.data;
        }
      },
      error: (error) => console.error('Error cargando estados:', error)
    });

    // Cargar tipos de servicio
    this.tipoServicioService.obtenerTodos().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.tiposServicio = response.data;
        }
      },
      error: (error) => console.error('Error cargando tipos de servicio:', error)
    });
  }

  cambiarReporte(tipo: 'citas' | 'productividad' | 'servicios'): void {
    this.reporteActivo = tipo;
    this.limpiarDatos();
    this.limpiarMensaje();
  }

  generarReporte(): void {
    if (!this.validarFechas()) {
      this.mostrarMensaje('Por favor selecciona las fechas de inicio y fin', 'error');
      return;
    }

    this.cargandoDatos = true;
    this.limpiarMensaje();

    const fechaInicioISO = this.convertirAISO8601(this.fechaInicio);
    const fechaFinISO = this.convertirAISO8601(this.fechaFin);

    switch (this.reporteActivo) {
      case 'citas':
        this.generarReporteCitas(fechaInicioISO, fechaFinISO);
        break;
      case 'productividad':
        this.generarReporteProductividad(fechaInicioISO, fechaFinISO);
        break;
      case 'servicios':
        this.generarReporteServicios(fechaInicioISO, fechaFinISO);
        break;
    }
  }

  generarReporteCitas(fechaInicio: string, fechaFin: string): void {
    this.reportesService.obtenerReporteCitasPorPeriodo(
      fechaInicio,
      fechaFin,
      this.estadoSeleccionado || undefined,
      this.tecnicoSeleccionado || undefined
    ).subscribe({
      next: (response) => {
        this.cargandoDatos = false;
        if (response.success) {
          this.datosCitas = response.data;
          this.mostrarMensaje(`Se encontraron ${response.total} registros`, 'success');
        } else {
          this.mostrarMensaje(response.message, 'error');
        }
      },
      error: (error) => {
        this.cargandoDatos = false;
        this.mostrarMensaje('Error al generar el reporte: ' + error.message, 'error');
      }
    });
  }

  generarReporteProductividad(fechaInicio: string, fechaFin: string): void {
    this.reportesService.obtenerReporteProductividadTecnicos(
      fechaInicio,
      fechaFin,
      this.tecnicoSeleccionado || undefined
    ).subscribe({
      next: (response) => {
        this.cargandoDatos = false;
        if (response.success) {
          this.datosProductividad = response.data;
          this.mostrarMensaje(`Se encontraron ${response.total} registros`, 'success');
        } else {
          this.mostrarMensaje(response.message, 'error');
        }
      },
      error: (error) => {
        this.cargandoDatos = false;
        this.mostrarMensaje('Error al generar el reporte: ' + error.message, 'error');
      }
    });
  }

  generarReporteServicios(fechaInicio: string, fechaFin: string): void {
    this.reportesService.obtenerReporteServiciosSolicitados(
      fechaInicio,
      fechaFin,
      this.tipoServicioSeleccionado || undefined
    ).subscribe({
      next: (response) => {
        this.cargandoDatos = false;
        if (response.success) {
          this.datosServicios = response.data;
          this.mostrarMensaje(`Se encontraron ${response.total} registros`, 'success');
        } else {
          this.mostrarMensaje(response.message, 'error');
        }
      },
      error: (error) => {
        this.cargandoDatos = false;
        this.mostrarMensaje('Error al generar el reporte: ' + error.message, 'error');
      }
    });
  }

  descargarExcel(): void {
    if (!this.validarFechas()) {
      this.mostrarMensaje('Por favor selecciona las fechas de inicio y fin', 'error');
      return;
    }

    this.descargandoExcel = true;
    this.limpiarMensaje();

    const fechaInicioISO = this.convertirAISO8601(this.fechaInicio);
    const fechaFinISO = this.convertirAISO8601(this.fechaFin);

    let descarga$;

    switch (this.reporteActivo) {
      case 'citas':
        descarga$ = this.reportesService.descargarCitasExcel(
          fechaInicioISO,
          fechaFinISO,
          this.estadoSeleccionado || undefined,
          this.tecnicoSeleccionado || undefined
        );
        break;
      case 'productividad':
        descarga$ = this.reportesService.descargarProductividadExcel(
          fechaInicioISO,
          fechaFinISO,
          this.tecnicoSeleccionado || undefined
        );
        break;
      case 'servicios':
        descarga$ = this.reportesService.descargarServiciosExcel(
          fechaInicioISO,
          fechaFinISO,
          this.tipoServicioSeleccionado || undefined
        );
        break;
      default:
        this.descargandoExcel = false;
        return;
    }

    descarga$.subscribe({
      next: (blob) => {
        this.descargandoExcel = false;
        this.descargarArchivo(blob, this.generarNombreArchivo());
        this.mostrarMensaje('Reporte descargado exitosamente', 'success');
      },
      error: (error) => {
        this.descargandoExcel = false;
        this.mostrarMensaje('Error al descargar el reporte: ' + error.message, 'error');
      }
    });
  }

  descargarArchivo(blob: Blob, nombreArchivo: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nombreArchivo;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  generarNombreArchivo(): string {
    const fecha = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const hora = new Date().toTimeString().slice(0, 5).replace(/:/g, '');
    
    const prefijos = {
      'citas': 'reporte_citas',
      'productividad': 'reporte_productividad',
      'servicios': 'reporte_servicios'
    };

    return `${prefijos[this.reporteActivo]}_${fecha}_${hora}.xlsx`;
  }

  limpiarFiltros(): void {
    this.estadoSeleccionado = '';
    this.tecnicoSeleccionado = '';
    this.tipoServicioSeleccionado = '';
    this.limpiarDatos();
    this.limpiarMensaje();
  }

  limpiarDatos(): void {
    this.datosCitas = [];
    this.datosProductividad = [];
    this.datosServicios = [];
  }

  validarFechas(): boolean {
    if (!this.fechaInicio || !this.fechaFin) {
      return false;
    }

    const inicio = new Date(this.fechaInicio);
    const fin = new Date(this.fechaFin);

    if (inicio > fin) {
      this.mostrarMensaje('La fecha de inicio no puede ser mayor a la fecha de fin', 'error');
      return false;
    }

    return true;
  }

  convertirAISO8601(fecha: string): string {
    // Convierte "2024-11-19" a "2024-11-19T00:00:00"
    return fecha + 'T00:00:00';
  }

  formatearFechaParaInput(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  formatearFecha(fecha: string | null): string {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  mostrarMensaje(texto: string, tipo: 'success' | 'error'): void {
    this.mensaje = texto;
    this.tipoMensaje = tipo;

    setTimeout(() => {
      this.limpiarMensaje();
    }, 5000);
  }

  limpiarMensaje(): void {
    this.mensaje = '';
    this.tipoMensaje = '';
  }

  get hayDatos(): boolean {
    switch (this.reporteActivo) {
      case 'citas':
        return this.datosCitas.length > 0;
      case 'productividad':
        return this.datosProductividad.length > 0;
      case 'servicios':
        return this.datosServicios.length > 0;
      default:
        return false;
    }
  }
}

