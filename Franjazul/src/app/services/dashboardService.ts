// src/app/services/dashboard.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  DashboardStats, 
  IndicadorCumplimiento, 
  ProximaCita, 
  ApiResponse 
} from '../interfaces/dashboard.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'https://franjazul-api.onrender.com/api/dashboard';

  constructor(private http: HttpClient) {}

  // Obtener estadísticas generales
  obtenerEstadisticas(): Observable<ApiResponse<DashboardStats>> {
    return this.http.get<ApiResponse<DashboardStats>>(`${this.apiUrl}/estadisticas`);
  }

  // Obtener indicadores de cumplimiento
  obtenerIndicadoresCumplimiento(): Observable<ApiResponse<IndicadorCumplimiento[]>> {
    return this.http.get<ApiResponse<IndicadorCumplimiento[]>>(`${this.apiUrl}/indicadores-cumplimiento`);
  }

  // Obtener próximas citas
  obtenerProximasCitas(cantidad: number = 5): Observable<ApiResponse<ProximaCita[]>> {
    return this.http.get<ApiResponse<ProximaCita[]>>(`${this.apiUrl}/proximas-citas?cantidad=${cantidad}`);
  }
}
