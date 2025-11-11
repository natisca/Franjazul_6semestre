
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface EstadoCita {
  nombreEc: string;
  descripcionEc: string;
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
export class EstadoCitaService {
  private apiUrl = 'http://localhost:8080/api/estado-cita';

  constructor(private http: HttpClient) { }

  obtenerTodos(): Observable<ApiResponse<EstadoCita[]>> {
    return this.http.get<ApiResponse<EstadoCita[]>>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  obtenerPorId(id: string): Observable<ApiResponse<EstadoCita>> {
    return this.http.get<ApiResponse<EstadoCita>>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  crear(estadoCita: EstadoCita): Observable<ApiResponse<EstadoCita>> {
    return this.http.post<ApiResponse<EstadoCita>>(this.apiUrl, estadoCita)
      .pipe(catchError(this.handleError));
  }

  actualizar(id: string, estadoCita: Partial<EstadoCita>): Observable<ApiResponse<EstadoCita>> {
    return this.http.patch<ApiResponse<EstadoCita>>(`${this.apiUrl}/${id}`, estadoCita)
      .pipe(catchError(this.handleError));
  }

  eliminar(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error completo:', error);
    return throwError(() => error);
  }
}
