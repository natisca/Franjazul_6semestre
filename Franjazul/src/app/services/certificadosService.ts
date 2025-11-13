
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Certificado {
  codigoCer: string;
  fechaEmision: string;
  fechaVence: string;
  cita: {
    idCita: number;
    usuarioCreo?: {
      idUsuario: string;
      nombreUs?: string;
      apellidoUs?: string;
      apellido2Us?: string;
      cargoDeUsuario?: {
        nombreCargo?: string;
      };
    };
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class CertificadosService {
  private apiUrl = 'http://localhost:8080/api/certificados';

  constructor(private http: HttpClient) { }

  obtenerTodos(): Observable<ApiResponse<Certificado[]>> {
    return this.http.get<ApiResponse<Certificado[]>>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  obtenerPorId(codigo: string): Observable<ApiResponse<Certificado>> {
    return this.http.get<ApiResponse<Certificado>>(`${this.apiUrl}/${codigo}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error:', error);
    return throwError(() => error);
  }
}
