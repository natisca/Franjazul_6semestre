import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from './serviciosService';

export interface CitaDetalle {
  idCita: number;
  observacionesCita: string;
  nombreCliente: string;
  idCliente: string;
  nombreTecnico: string;
  idTecnico: string;
  fechaInicio: string;
  fechaFin: string;
  nombreLugar: string;
  direccionLugar: string;
  estadoCita: string;
  descripcionEstado: string;
  servicios: string[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
  private apiUrl = 'https://franjazul-api.onrender.com/api/citas';

  constructor(private http: HttpClient) { }

  obtenerCitasPorTecnico(idTecnico: string, page: number = 0, size: number = 10): Observable<PaginatedResponse<CitaDetalle>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PaginatedResponse<CitaDetalle>>(`${this.apiUrl}/tecnico/${idTecnico}`, { params });
  }

  buscarCitasPorCliente(idTecnico: string, busqueda: string, page: number = 0, size: number = 10): Observable<PaginatedResponse<CitaDetalle>> {
    const params = new HttpParams()
      .set('busqueda', busqueda)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PaginatedResponse<CitaDetalle>>(`${this.apiUrl}/tecnico/${idTecnico}/buscar`, { params });
  }


  
  
    //>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    //>>>>>>Endpoints para el TECNICO actualizar la cita<<<<<<<<<<<
    //>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<




  obtenerDetalleCita(idCita: number): Observable<ApiResponse<CitaDetalle>> {
    return this.http.get<ApiResponse<CitaDetalle>>(`${this.apiUrl}/${idCita}/detalle`);
  }

  actualizarCita(datos: any): Observable<ApiResponse<CitaDetalle>> {
    return this.http.patch<ApiResponse<CitaDetalle>>(`${this.apiUrl}/actualizar-tecnico`, datos);
  }

}
