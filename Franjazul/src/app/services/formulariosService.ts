
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Formulario {
  idForm: number;
  tituloForm: string;
  urlForm: string;
  esPadre: number;
  orden: number;
  formRecursivo?: {
    idForm: number;
    tituloForm?: string;
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
export class FormulariosService {
  private apiUrl = 'http://localhost:8080/api/formularios';

  constructor(private http: HttpClient) { }

  obtenerTodos(): Observable<ApiResponse<Formulario[]>> {
    return this.http.get<ApiResponse<Formulario[]>>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  obtenerPorId(id: number): Observable<ApiResponse<Formulario>> {
    return this.http.get<ApiResponse<Formulario>>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  crear(formulario: Partial<Formulario>): Observable<ApiResponse<Formulario>> {
    return this.http.post<ApiResponse<Formulario>>(this.apiUrl, formulario)
      .pipe(catchError(this.handleError));
  }

  actualizar(id: number, formulario: Partial<Formulario>): Observable<ApiResponse<Formulario>> {
    return this.http.patch<ApiResponse<Formulario>>(`${this.apiUrl}/${id}`, formulario)
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
