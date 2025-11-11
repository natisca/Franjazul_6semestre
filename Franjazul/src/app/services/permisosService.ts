
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Permiso {
  idPerEnPerm: number;
  idFormEnPerm: number;
  perfil?: {
    idPer: number;
    nombrePer: string;
  };
  formulario?: {
    idForm: number;
    tituloForm: string;
  };
  puedeCrear: number;
  puedeBorrar: number;
  puedeEditar: number;
  puedeLeer: number;
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
export class PermisosService {
  private apiUrl = 'http://localhost:8080/api/permisos';

  constructor(private http: HttpClient) { }

  obtenerTodos(): Observable<ApiResponse<Permiso[]>> {
    return this.http.get<ApiResponse<Permiso[]>>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  obtenerPorId(idPerfil: number, idFormulario: number): Observable<ApiResponse<Permiso>> {
    return this.http.get<ApiResponse<Permiso>>(`${this.apiUrl}/${idPerfil}/${idFormulario}`)
      .pipe(catchError(this.handleError));
  }

  obtenerPorPerfil(idPerfil: number): Observable<ApiResponse<Permiso[]>> {
    return this.http.get<ApiResponse<Permiso[]>>(`${this.apiUrl}/perfil/${idPerfil}`)
      .pipe(catchError(this.handleError));
  }

  obtenerPorFormulario(idFormulario: number): Observable<ApiResponse<Permiso[]>> {
    return this.http.get<ApiResponse<Permiso[]>>(`${this.apiUrl}/formulario/${idFormulario}`)
      .pipe(catchError(this.handleError));
  }

  crear(permiso: Partial<Permiso>): Observable<ApiResponse<Permiso>> {
    return this.http.post<ApiResponse<Permiso>>(this.apiUrl, permiso)
      .pipe(catchError(this.handleError));
  }

  actualizar(idPerfil: number, idFormulario: number, permiso: Partial<Permiso>): Observable<ApiResponse<Permiso>> {
    return this.http.patch<ApiResponse<Permiso>>(`${this.apiUrl}/${idPerfil}/${idFormulario}`, permiso)
      .pipe(catchError(this.handleError));
  }

  eliminar(idPerfil: number, idFormulario: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${idPerfil}/${idFormulario}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error completo:', error);
    return throwError(() => error);
  }
}
