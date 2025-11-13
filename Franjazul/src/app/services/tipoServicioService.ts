
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface TipoServicio {
  nombreTps: string;
  descripcionTsp: string;
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
export class TipoServicioService {
  private apiUrl = 'http://localhost:8080/api/tipos-servicio';

  constructor(private http: HttpClient) { }

  obtenerTodos(): Observable<ApiResponse<TipoServicio[]>> {
    return this.http.get<ApiResponse<TipoServicio[]>>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  obtenerPorId(id: string): Observable<ApiResponse<TipoServicio>> {
    return this.http.get<ApiResponse<TipoServicio>>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  crear(tipoServicio: TipoServicio): Observable<ApiResponse<TipoServicio>> {
    return this.http.post<ApiResponse<TipoServicio>>(this.apiUrl, tipoServicio)
      .pipe(catchError(this.handleError));
  }

  actualizar(id: string, tipoServicio: Partial<TipoServicio>): Observable<ApiResponse<TipoServicio>> {
    return this.http.patch<ApiResponse<TipoServicio>>(`${this.apiUrl}/${id}`, tipoServicio)
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
