import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppointmentsService, CitaDetalle } from '../../../services/appointmentsService';
import { AuthService } from '../../../services/authService';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './appointments.html',
  styleUrl: './appointments.css'
})
export class Appointments implements OnInit {
  appointments: CitaDetalle[] = [];
  filteredAppointments: CitaDetalle[] = [];
  
  currentPage: number = 0;
  totalPages: number = 0;
  totalElements: number = 0;
  pageSize: number = 10;
  
  searchTerm: string = '';
  loading: boolean = false;
  errorMessage: string = '';
  
  idTecnico: string = '';

  Math = Math;

  constructor(
    private appointmentsService: AppointmentsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.idTecnico = currentUser.idUsuario;
      this.cargarCitas();
    }
  }

  cargarCitas(): void {
    this.loading = true;
    this.errorMessage = '';

    if (this.searchTerm.trim() !== '') {
      this.buscarCitas();
    } else {
      this.appointmentsService.obtenerCitasPorTecnico(this.idTecnico, this.currentPage, this.pageSize)
        .subscribe({
          next: (response) => {
            console.log('Citas obtenidas:', response);
            this.appointments = response.data;
            this.currentPage = response.currentPage;
            this.totalPages = response.totalPages;
            this.totalElements = response.totalElements;
            this.loading = false;
          },
          error: (error) => {
            console.error('Error al cargar citas:', error);
            this.errorMessage = 'Error al cargar las citas';
            this.loading = false;
          }
        });
    }
  }

  buscarCitas(): void {
    this.loading = true;
    this.errorMessage = '';

    this.appointmentsService.buscarCitasPorCliente(this.idTecnico, this.searchTerm, this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          console.log('Búsqueda realizada:', response);
          this.appointments = response.data;
          this.currentPage = response.currentPage;
          this.totalPages = response.totalPages;
          this.totalElements = response.totalElements;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error en búsqueda:', error);
          this.errorMessage = 'Error al buscar citas';
          this.loading = false;
        }
      });
  }

  onSearchChange(): void {
    this.currentPage = 0;
    this.cargarCitas();
  }

  cambiarPagina(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.cargarCitas();
    }
  }

  get totalProgramadas(): number {
    return this.appointments.filter(a => a.estadoCita === 'PENDIENTE').length;
  }

  get totalEnProceso(): number {
    return this.appointments.filter(a => a.estadoCita === 'REAGENDADA').length;
  }

  getStatusColor(status: string): string {
    switch (status.toUpperCase()) {
      case 'PENDIENTE':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'EN_PROCESO':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'COMPLETADA':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELADA':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  getStatusText(status: string): string {
    switch (status.toUpperCase()) {
      case 'PENDIENTE':
        return 'Pendiente';
      case 'EN_PROCESO':
        return 'En Proceso';
      case 'COMPLETADA':
        return 'Completada';
      case 'CANCELADA':
        return 'Cancelada';
      default:
        return status;
    }
  }

  getInitials(client: string): string {
    if (!client) return '';
    return client
      .split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-CO', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  getServiciosText(servicios: string[]): string {
    if (!servicios || servicios.length === 0) return 'Sin servicios';
    if (servicios.length === 1) return servicios[0];
    return `${servicios[0]} (+${servicios.length - 1} más)`;
  }

  get paginasArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }
}
