
export interface ReporteCitaPorPeriodo {
  idCita: number;
  fechaInicio: string;
  fechaFin: string;
  cliente: string;
  emailCliente: string;
  tecnico: string;
  lugar: string;
  direccion: string;
  servicios: string;
  estado: string;
  observaciones: string;
}

export interface ReporteProductividadTecnico {
  idTecnico: string;
  nombreCompleto: string;
  email: string;
  telefono: string;
  totalCitasAsignadas: number;
  citasCompletadas: number;
  citasPendientes: number;
  citasCanceladas: number;
  citasReagendadas: number;
  porcentajeEfectividad: number;
  porcentajeCancelacion: number;
}

export interface ReporteServiciosSolicitados {
  idServicio: number;
  nombreServicio: string;
  descripcion: string;
  tipoServicio: string;
  molecula: string;
  vecesSolicitado: number;
  cantidadTotal: number;
  citasCompletadas: number;
  citasPendientes: number;
  porcentajeCompletado: number;
}

export interface FiltrosReporte {
  fechaInicio: string;
  fechaFin: string;
  estado?: string;
  idTecnico?: string;
  tipoServicio?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  total?: number;
  message: string;
}
