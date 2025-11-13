
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Lugar {
  idLugar: number;
  nombreLugar: string;
  direccionLugar: string;
  tipoLugar: {
    idTl: number;
    nombreTl?: string;
  };
  lugarPadre?: {
    idLugar: number;
    nombreLugar?: string;
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
export class LugaresService {
  private apiUrl = 'http://localhost:8080/api/lugares';

  constructor(private http: HttpClient) { }

  obtenerTodos(): Observable<ApiResponse<Lugar[]>> {
    return this.http.get<ApiResponse<Lugar[]>>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  obtenerPorId(id: number): Observable<ApiResponse<Lugar>> {
    return this.http.get<ApiResponse<Lugar>>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  crear(lugar: Partial<Lugar>): Observable<ApiResponse<Lugar>> {
    return this.http.post<ApiResponse<Lugar>>(this.apiUrl, lugar)
      .pipe(catchError(this.handleError));
  }

  actualizar(id: number, lugar: Partial<Lugar>): Observable<ApiResponse<Lugar>> {
    return this.http.patch<ApiResponse<Lugar>>(`${this.apiUrl}/${id}`, lugar)
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
