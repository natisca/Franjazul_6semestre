
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ReporteCitaPorPeriodo,
  ReporteProductividadTecnico,
  ReporteServiciosSolicitados,
  ApiResponse
} from '../interfaces/reportes.interface';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private apiUrl = 'http://localhost:8080/api/reportes';

  constructor(private http: HttpClient) {}

  // ==================== OBTENER DATOS JSON ====================

  obtenerReporteCitasPorPeriodo(
    fechaInicio: string,
    fechaFin: string,
    estado?: string,
    idTecnico?: string
  ): Observable<ApiResponse<ReporteCitaPorPeriodo[]>> {
    let params = new HttpParams()
      .set('fechaInicio', fechaInicio)
      .set('fechaFin', fechaFin);

    if (estado) params = params.set('estado', estado);
    if (idTecnico) params = params.set('idTecnico', idTecnico);

    return this.http.get<ApiResponse<ReporteCitaPorPeriodo[]>>(
      `${this.apiUrl}/citas-por-periodo`,
      { params }
    );
  }

  obtenerReporteProductividadTecnicos(
    fechaInicio: string,
    fechaFin: string,
    idTecnico?: string
  ): Observable<ApiResponse<ReporteProductividadTecnico[]>> {
    let params = new HttpParams()
      .set('fechaInicio', fechaInicio)
      .set('fechaFin', fechaFin);

    if (idTecnico) params = params.set('idTecnico', idTecnico);

    return this.http.get<ApiResponse<ReporteProductividadTecnico[]>>(
      `${this.apiUrl}/productividad-tecnicos`,
      { params }
    );
  }

  obtenerReporteServiciosSolicitados(
    fechaInicio: string,
    fechaFin: string,
    tipoServicio?: string
  ): Observable<ApiResponse<ReporteServiciosSolicitados[]>> {
    let params = new HttpParams()
      .set('fechaInicio', fechaInicio)
      .set('fechaFin', fechaFin);

    if (tipoServicio) params = params.set('tipoServicio', tipoServicio);

    return this.http.get<ApiResponse<ReporteServiciosSolicitados[]>>(
      `${this.apiUrl}/servicios-solicitados`,
      { params }
    );
  }

  // ==================== DESCARGAR EXCEL ====================

  descargarCitasExcel(
    fechaInicio: string,
    fechaFin: string,
    estado?: string,
    idTecnico?: string
  ): Observable<Blob> {
    let params = new HttpParams()
      .set('fechaInicio', fechaInicio)
      .set('fechaFin', fechaFin);

    if (estado) params = params.set('estado', estado);
    if (idTecnico) params = params.set('idTecnico', idTecnico);

    return this.http.get(`${this.apiUrl}/citas-por-periodo/excel`, {
      params,
      responseType: 'blob'
    });
  }

  descargarProductividadExcel(
    fechaInicio: string,
    fechaFin: string,
    idTecnico?: string
  ): Observable<Blob> {
    let params = new HttpParams()
      .set('fechaInicio', fechaInicio)
      .set('fechaFin', fechaFin);

    if (idTecnico) params = params.set('idTecnico', idTecnico);

    return this.http.get(`${this.apiUrl}/productividad-tecnicos/excel`, {
      params,
      responseType: 'blob'
    });
  }

  descargarServiciosExcel(
    fechaInicio: string,
    fechaFin: string,
    tipoServicio?: string
  ): Observable<Blob> {
    let params = new HttpParams()
      .set('fechaInicio', fechaInicio)
      .set('fechaFin', fechaFin);

    if (tipoServicio) params = params.set('tipoServicio', tipoServicio);

    return this.http.get(`${this.apiUrl}/servicios-solicitados/excel`, {
      params,
      responseType: 'blob'
    });
  }
}
