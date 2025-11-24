
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface FranjaHoraria {
  idFranja: number;
  fechaInicio: string; 
  fechaFin: string;
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
export class FranjasHorariasService {
  private apiUrl = 'https://franjazul-api.onrender.com/api/franjas-horarias';

  constructor(private http: HttpClient) { }

  obtenerTodos(): Observable<ApiResponse<FranjaHoraria[]>> {
    return this.http.get<ApiResponse<FranjaHoraria[]>>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  obtenerPorId(id: number): Observable<ApiResponse<FranjaHoraria>> {
    return this.http.get<ApiResponse<FranjaHoraria>>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  crear(franjaHoraria: Partial<FranjaHoraria>): Observable<ApiResponse<FranjaHoraria>> {
    return this.http.post<ApiResponse<FranjaHoraria>>(this.apiUrl, franjaHoraria)
      .pipe(catchError(this.handleError));
  }

  actualizar(id: number, franjaHoraria: Partial<FranjaHoraria>): Observable<ApiResponse<FranjaHoraria>> {
    return this.http.patch<ApiResponse<FranjaHoraria>>(`${this.apiUrl}/${id}`, franjaHoraria)
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
