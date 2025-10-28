import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Rol {
  idRol: number;
  nombreRol: string;
  descripcionRol: string;
}

export interface ApiResponse {
  success: boolean;
  data?: any;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private apiUrl = 'http://localhost:8080/api/roles';

  constructor(private http: HttpClient) { }

  obtenerTodos(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/${id}`);
  }

  crear(rol: Rol): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.apiUrl, rol);
  }

  actualizar(id: number, rol: Partial<Rol>): Observable<ApiResponse> {
    return this.http.patch<ApiResponse>(`${this.apiUrl}/${id}`, rol);
  }

  eliminar(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${id}`);
  }
}