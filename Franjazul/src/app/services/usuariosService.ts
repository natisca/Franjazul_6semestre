
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Usuario {
  idUsuario: string;
  nombreUs: string;
  apellidoUs: string;
  apellido2Us?: string;
  emailUs: string;
  passwordUs: string;
  telefonoUs: number;
  perfilDeUsuario: {
    idPer: number;
    nombrePer?: string;
  };
  cargoDeUsuario: {
    nombreCargo: string;
    descripcionCargo?: string;
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
export class UsuariosService {
  private apiUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) { }

  obtenerTodos(): Observable<ApiResponse<Usuario[]>> {
    return this.http.get<ApiResponse<Usuario[]>>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  obtenerPorId(id: string): Observable<ApiResponse<Usuario>> {
    return this.http.get<ApiResponse<Usuario>>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  obtenerPorCargo(nombreCargo: string): Observable<ApiResponse<Usuario[]>> {
  return this.http.get<ApiResponse<Usuario[]>>(`${this.apiUrl}/por-cargo/${nombreCargo}`)
    .pipe(catchError(this.handleError));
}

  crear(usuario: Partial<Usuario>): Observable<ApiResponse<Usuario>> {
    return this.http.post<ApiResponse<Usuario>>(this.apiUrl, usuario)
      .pipe(catchError(this.handleError));
  }

  actualizar(id: string, usuario: Partial<Usuario>): Observable<ApiResponse<Usuario>> {
    return this.http.patch<ApiResponse<Usuario>>(`${this.apiUrl}/${id}`, usuario)
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
