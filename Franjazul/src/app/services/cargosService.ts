
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Cargo {
  nombreCargo: string;
  descripcionCargo: string;
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
export class CargosService {
  private apiUrl = 'https://franjazul-api.onrender.com/api/cargos';

  constructor(private http: HttpClient) { }

  obtenerTodos(): Observable<ApiResponse<Cargo[]>> {
    return this.http.get<ApiResponse<Cargo[]>>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  obtenerPorId(id: string): Observable<ApiResponse<Cargo>> {
    return this.http.get<ApiResponse<Cargo>>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  crear(cargo: Cargo): Observable<ApiResponse<Cargo>> {
    return this.http.post<ApiResponse<Cargo>>(this.apiUrl, cargo)
      .pipe(catchError(this.handleError));
  }

  actualizar(id: string, cargo: Partial<Cargo>): Observable<ApiResponse<Cargo>> {
    return this.http.patch<ApiResponse<Cargo>>(`${this.apiUrl}/${id}`, cargo)
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
