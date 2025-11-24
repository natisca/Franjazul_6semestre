
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Rol {
  idRol: number;
  nombreRol: string;
  descripcionRol: string;
}

// Respuesta exitosa siempre tiene data
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message: string;
}

// Respuesta con error no tiene data
export interface ApiErrorResponse {
  success: false;
  data?: never;
  message: string;
  error?: string;
}

// Union type para la respuesta
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private apiUrl = 'https://franjazul-api.onrender.com/api/roles';

  constructor(private http: HttpClient) { }

  // Obtener todos los roles
  obtenerTodos(): Observable<ApiResponse<Rol[]>> {
    return this.http.get<ApiResponse<Rol[]>>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Obtener rol por ID
  obtenerPorId(id: number): Observable<ApiResponse<Rol>> {
    return this.http.get<ApiResponse<Rol>>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Crear nuevo rol
  crear(rol: Partial<Rol>): Observable<ApiResponse<Rol>> {
    return this.http.post<ApiResponse<Rol>>(this.apiUrl, rol)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Actualizar rol existente
  actualizar(id: number, rol: Partial<Rol>): Observable<ApiResponse<Rol>> {
    return this.http.patch<ApiResponse<Rol>>(`${this.apiUrl}/${id}`, rol)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Eliminar rol
  eliminar(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Manejo centralizado de errores
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
      
      if (error.error?.message) {
        errorMessage = error.error.message;
      }
    }
    
    console.error('Error completo:', error);
    return throwError(() => error);
  }
}
