import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  idUsuario: string;
  nombreCompleto: string;
  email: string;
  cargo: string;
  idPerfil: number;
  nombrePerfil: string;
}

export interface RegistroRequest {
  idUsuario: string;
  nombreUs: string;
  apellidoUs: string;
  apellido2Us?: string;
  emailUs: string;
  passwordUs: string;
  telefonoUs: number;
}

export interface CambioPasswordRequest {
  email: string;
  passwordNueva: string;
}


export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/usuarios';
  private currentUserSubject: BehaviorSubject<LoginResponse | null>;
  public currentUser: Observable<LoginResponse | null>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<LoginResponse | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): LoginResponse | null {
    return this.currentUserSubject.value;
  }

  login(credentials: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            localStorage.setItem('currentUser', JSON.stringify(response.data));
            localStorage.setItem('token', response.data.token);
            this.currentUserSubject.next(response.data);
            this.redirectByCargo(response.data.cargo);
          }
        })
      );
  }

    registrar(datos: RegistroRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.apiUrl}/registrar`, datos)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            localStorage.setItem('currentUser', JSON.stringify(response.data));
            localStorage.setItem('token', response.data.token);
            this.currentUserSubject.next(response.data);
            this.router.navigate(['/']);
          }
        })
      );
  }

  cambiarPassword(datos: CambioPasswordRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/cambiar-password`, datos);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCargo(): string | null {
    return this.currentUserValue?.cargo || null;
  }

  hasCargo(cargo: string): boolean {
    return this.getCargo()?.toUpperCase() === cargo.toUpperCase();
  }

  isCliente(): boolean {
    return this.hasCargo('CLIENTE');
  }

  isTecnico(): boolean {
    return this.hasCargo('TECNICO');
  }

  isAdministrador(): boolean {
    return this.hasCargo('ADMINISTRADOR');
  }

  private redirectByCargo(cargo: string): void {
    const cargoUpper = cargo.toUpperCase();
    
    if (cargoUpper === 'CLIENTE') {
      this.router.navigate(['/']);
    } else if (cargoUpper === 'TECNICO' || cargoUpper === 'ADMINISTRADOR') {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/']);
    }
  }
}