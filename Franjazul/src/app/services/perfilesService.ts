
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Perfil {
  idPer: number;
  nombrePer: string;
  descripcionPer: string;
  rol: {
    idRol: number;
    nombreRol?: string;
    descripcionRol?: string;
  };
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
export class PerfilesService {
  private apiUrl = 'http://localhost:8080/api/perfiles';

  constructor(private http: HttpClient) { }

  obtenerTodos(): Observable<ApiResponse<Perfil[]>> {
    return this.http.get<ApiResponse<Perfil[]>>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  obtenerPorId(id: number): Observable<ApiResponse<Perfil>> {
    return this.http.get<ApiResponse<Perfil>>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  obtenerPorRol(idRol: number): Observable<ApiResponse<Perfil[]>> {
    return this.http.get<ApiResponse<Perfil[]>>(`${this.apiUrl}/rol/${idRol}`)
      .pipe(catchError(this.handleError));
  }

  crear(perfil: Partial<Perfil>): Observable<ApiResponse<Perfil>> {
    return this.http.post<ApiResponse<Perfil>>(this.apiUrl, perfil)
      .pipe(catchError(this.handleError));
  }

  actualizar(id: number, perfil: Partial<Perfil>): Observable<ApiResponse<Perfil>> {
    return this.http.patch<ApiResponse<Perfil>>(`${this.apiUrl}/${id}`, perfil)
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
