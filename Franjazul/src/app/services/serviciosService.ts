
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Servicio {
  idServicio: number;
  nombreSer: string;
  descripcionSer: string;
  tipoServicio: {
    nombreTps: string;
    descripcionTsp?: string;
  };
  molecula?: {
    nombreMol: string;
    descripcionMol?: string;
  } | null;
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
export class ServiciosService {
  private apiUrl = 'https://franjazul-api.onrender.com/api/servicios';

  constructor(private http: HttpClient) { }

  obtenerTodos(): Observable<ApiResponse<Servicio[]>> {
    return this.http.get<ApiResponse<Servicio[]>>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  obtenerPorId(id: number): Observable<ApiResponse<Servicio>> {
    return this.http.get<ApiResponse<Servicio>>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  crear(servicio: Partial<Servicio>): Observable<ApiResponse<Servicio>> {
    return this.http.post<ApiResponse<Servicio>>(this.apiUrl, servicio)
      .pipe(catchError(this.handleError));
  }

  actualizar(id: number, servicio: Partial<Servicio>): Observable<ApiResponse<Servicio>> {
    return this.http.patch<ApiResponse<Servicio>>(`${this.apiUrl}/${id}`, servicio)
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
