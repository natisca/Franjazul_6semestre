
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface CitaServicio {
  citaEnIntermedio: number;
  servicioEnIntermedio: number;
  cantidadSer: number;
  cita?: {
    idCita: number;
    observacionesCita?: string;
  };
  servicio?: {
    idServicio: number;
    nombreSer?: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class CitaServicioService {
  private apiUrl = 'https://franjazul-api.onrender.com/api/cita-servicio';

  constructor(private http: HttpClient) { }

  obtenerTodos(): Observable<ApiResponse<CitaServicio[]>> {
    return this.http.get<ApiResponse<CitaServicio[]>>(this.apiUrl).pipe(catchError(this.handleError));
  }

  obtenerPorId(idCita: number, idServicio: number): Observable<ApiResponse<CitaServicio>> {
    return this.http.get<ApiResponse<CitaServicio>>(`${this.apiUrl}/${idCita}/${idServicio}`).pipe(catchError(this.handleError));
  }

  crear(citaServicio: Partial<CitaServicio>): Observable<ApiResponse<CitaServicio>> {
    return this.http.post<ApiResponse<CitaServicio>>(this.apiUrl, citaServicio).pipe(catchError(this.handleError));
  }

  actualizar(idCita: number, idServicio: number, citaServicio: Partial<CitaServicio>): Observable<ApiResponse<CitaServicio>> {
    return this.http.patch<ApiResponse<CitaServicio>>(`${this.apiUrl}/${idCita}/${idServicio}`, citaServicio).pipe(catchError(this.handleError));
  }

  eliminar(idCita: number, idServicio: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${idCita}/${idServicio}`).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error:', error);
    return throwError(() => error);
  }
  
}
