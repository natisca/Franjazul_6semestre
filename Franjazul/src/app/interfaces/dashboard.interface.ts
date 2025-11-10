// src/app/interfaces/dashboard.interface.ts

export interface DashboardStats {
  totalCitas: number;
  citasPendientes: number;
  citasCompletadas: number;
  citasCanceladas: number;
  totalTecnicos: number;
  totalCertificados: number;
  certificadosVencidos: number;
  certificadosVigentes: number;
  porcentajeCompletadas: number;
  variacionMesAnterior: number;
  serviciosActivos: number;
}

export interface IndicadorCumplimiento {
  nombreServicio: string;
  tipoServicio: string;
  totalVecesSolicitado: number;
  completadas: number;
  porcentajeCumplimiento: number;
}

export interface ProximaCita {
  idCita: number;
  lugar: string;
  direccion: string;
  fechaInicio: string;
  fechaFin: string;
  fechaFormato: string;
  horaInicio: string;
  horaFin: string;
  tecnicoResponsable: string;
  usuarioCreo: string;
  estado: string;
  descripcionEstado: string;
  observaciones: string;
  servicios: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}
