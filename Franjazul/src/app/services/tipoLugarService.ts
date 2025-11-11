
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface TipoLugar {
  idTl: number;
  nombreTl: string;
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
export class TipoLugarService {
  private apiUrl = 'http://localhost:8080/api/tipos-lugar';

  constructor(private http: HttpClient) { }

  obtenerTodos(): Observable<ApiResponse<TipoLugar[]>> {
    return this.http.get<ApiResponse<TipoLugar[]>>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  obtenerPorId(id: number): Observable<ApiResponse<TipoLugar>> {
    return this.http.get<ApiResponse<TipoLugar>>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  crear(tipoLugar: Partial<TipoLugar>): Observable<ApiResponse<TipoLugar>> {
    return this.http.post<ApiResponse<TipoLugar>>(this.apiUrl, tipoLugar)
      .pipe(catchError(this.handleError));
  }

  actualizar(id: number, tipoLugar: Partial<TipoLugar>): Observable<ApiResponse<TipoLugar>> {
    return this.http.patch<ApiResponse<TipoLugar>>(`${this.apiUrl}/${id}`, tipoLugar)
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
