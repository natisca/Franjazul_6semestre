// src/app/services/citas.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Cita {
  idCita: number;
  observacionesCita: string;
  usuarioTecnico: { 
    idUsuario: string; 
    nombreUs?: string;
    apellidoUs?: string;
    apellido2Us?: string;
  };
  usuarioCreo: { 
    idUsuario: string; 
    nombreUs?: string;
    apellidoUs?: string;
    apellido2Us?: string;
  };
  franjaHoraria: { 
    idFranja: number; 
    fechaInicio?: string; 
    fechaFin?: string; 
  };
  lugar: { 
    idLugar: number; 
    nombreLugar?: string; 
  };
  estadoCita: { 
    nombreEc: string; 
    descripcionEc?: string; 
  };
}

export interface SolicitudCita {
  idUsuarioCliente: string;
  serviciosIds: number[];
  fechaInicio: string;
  fechaFin: string;
  nombreLugar: string;
  direccionLugar: string;
  idTipoLugar: number;
  idLugarPadre?: number;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  data?: never;
  message: string;
  error?: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

@Injectable({
  providedIn: 'root'
})
export class CitasService {
  private apiUrl = 'http://localhost:8080/api/citas';

  constructor(private http: HttpClient) { }

  obtenerTodos(): Observable<ApiResponse<Cita[]>> {
    return this.http.get<ApiResponse<Cita[]>>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  obtenerPorId(id: number): Observable<ApiResponse<Cita>> {
    return this.http.get<ApiResponse<Cita>>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  crear(cita: Partial<Cita>): Observable<ApiResponse<Cita>> {
    return this.http.post<ApiResponse<Cita>>(this.apiUrl, cita)
      .pipe(catchError(this.handleError));
  }

  solicitarCita(solicitud: SolicitudCita): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/solicitar`, solicitud);
  }

  actualizar(id: number, cita: Partial<Cita>): Observable<ApiResponse<Cita>> {
    return this.http.patch<ApiResponse<Cita>>(`${this.apiUrl}/${id}`, cita)
      .pipe(catchError(this.handleError));
  }

  eliminar(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error completo:', error);
    return throwError(() => error);
  }
}
