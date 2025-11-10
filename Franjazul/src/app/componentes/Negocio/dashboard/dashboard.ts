// src/app/dashboard/dashboard.component.ts

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { DashboardService } from '../../../services/dashboardService';
import { DashboardStats, IndicadorCumplimiento, ProximaCita } from '../../../interfaces/dashboard.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  providers: [DashboardService],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})

export class Dashboard implements OnInit {
  // Estadísticas principales
  stats: DashboardStats | null = null;
  
  // Indicadores de cumplimiento
  indicadores: IndicadorCumplimiento[] = [];
  
  // Próximas citas
  proximasCitas: ProximaCita[] = [];
  
  // Estados de carga
  cargandoStats = true;
  cargandoIndicadores = true;
  cargandoCitas = true;
  
  // Errores
  errorStats = false;
  errorIndicadores = false;
  errorCitas = false;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  // Cargar todos los datos del dashboard
  cargarDatos(): void {
    this.cargarEstadisticas();
    this.cargarIndicadores();
    this.cargarProximasCitas();
  }

  // Cargar estadísticas generales
  cargarEstadisticas(): void {
    this.cargandoStats = true;
    this.errorStats = false;

    this.dashboardService.obtenerEstadisticas().subscribe({
      next: (response) => {
        if (response.success) {
          this.stats = response.data;
        } else {
          this.errorStats = true;
          console.error('Error:', response.message);
        }
        this.cargandoStats = false;
      },
      error: (error) => {
        console.error('Error al cargar estadísticas:', error);
        this.errorStats = true;
        this.cargandoStats = false;
      }
    });
  }

  // Cargar indicadores de cumplimiento
  cargarIndicadores(): void {
    this.cargandoIndicadores = true;
    this.errorIndicadores = false;

    this.dashboardService.obtenerIndicadoresCumplimiento().subscribe({
      next: (response) => {
        if (response.success) {
          this.indicadores = response.data;
        } else {
          this.errorIndicadores = true;
          console.error('Error:', response.message);
        }
        this.cargandoIndicadores = false;
      },
      error: (error) => {
        console.error('Error al cargar indicadores:', error);
        this.errorIndicadores = true;
        this.cargandoIndicadores = false;
      }
    });
  }

  // Cargar próximas citas
  cargarProximasCitas(): void {
    this.cargandoCitas = true;
    this.errorCitas = false;

    this.dashboardService.obtenerProximasCitas(5).subscribe({
      next: (response) => {
        if (response.success) {
          this.proximasCitas = response.data;
        } else {
          this.errorCitas = true;
          console.error('Error:', response.message);
        }
        this.cargandoCitas = false;
      },
      error: (error) => {
        console.error('Error al cargar próximas citas:', error);
        this.errorCitas = true;
        this.cargandoCitas = false;
      }
    });
  }

  // Método para recargar datos
  recargarDatos(): void {
    this.cargarDatos();
  }

  // Obtener clase CSS según el estado de la cita
  obtenerClaseEstado(estado: string): string {
    const estadoUpper = estado.toUpperCase();
    if (estadoUpper === 'PROGRAMADA') {
      return 'bg-blue-100 text-blue-700';
    }
    if (estadoUpper === 'PENDIENTE') {
      return 'bg-yellow-100 text-yellow-700';
    }
    if (estadoUpper === 'COMPLETADA') {
      return 'bg-green-100 text-green-700';
    }
    return 'bg-gray-100 text-gray-700';
  }

  // Formatear variación porcentual
  formatearVariacion(variacion: number | undefined): string {
    if (variacion === undefined || variacion === null) {
      return '0';
    }
    return variacion >= 0 ? `+${variacion.toFixed(1)}` : variacion.toFixed(1);
  }

  // Verificar si la variación es positiva
  esVariacionPositiva(variacion: number | undefined): boolean {
    return (variacion !== undefined && variacion !== null && variacion >= 0);
  }
}
