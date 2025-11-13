
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Molecula {
  nombreMol: string;
  descripcionMol: string;
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
export class MoleculasService {
  private apiUrl = 'http://localhost:8080/api/moleculas';

  constructor(private http: HttpClient) { }

  obtenerTodos(): Observable<ApiResponse<Molecula[]>> {
    return this.http.get<ApiResponse<Molecula[]>>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  obtenerPorId(id: string): Observable<ApiResponse<Molecula>> {
    return this.http.get<ApiResponse<Molecula>>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  crear(molecula: Molecula): Observable<ApiResponse<Molecula>> {
    return this.http.post<ApiResponse<Molecula>>(this.apiUrl, molecula)
      .pipe(catchError(this.handleError));
  }

  actualizar(id: string, molecula: Partial<Molecula>): Observable<ApiResponse<Molecula>> {
    return this.http.patch<ApiResponse<Molecula>>(`${this.apiUrl}/${id}`, molecula)
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
