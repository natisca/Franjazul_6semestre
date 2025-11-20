import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { AppointmentsService, CitaDetalle } from '../../../services/appointmentsService';
import { EstadoCita, EstadoCitaService } from '../../../services/estadoCitaService';
import { AuthService } from '../../../services/authService';
import { isSuccessResponse } from '../../../models/api-response';

@Component({
  selector: 'app-appointment-management',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './appointment-management.html',
  styleUrl: './appointment-management.css'
})
export class AppointmentManagement implements OnInit {

  idCita: number = 0;
  cita: CitaDetalle | null = null;
  estadosDisponibles: EstadoCita[] = [];
  
  // Formulario
  observaciones: string = '';
  estadoSeleccionado: string = '';
  fechaSeleccionada: string = '';
  horarioSeleccionado: string = '';
  
  // Control de cambio de franja
  franjaOriginal: { inicio: string, fin: string } = { inicio: '', fin: '' };
  cambioFranja: boolean = false;
  
  // Servicios completados (solo frontend)
  serviciosCompletados: Set<string> = new Set();
  
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  horariosDisponibles: { inicio: string, fin: string, label: string }[] = [
    { inicio: '08:00', fin: '10:00', label: '8:00 AM - 10:00 AM' },
    { inicio: '10:00', fin: '12:00', label: '10:00 AM - 12:00 PM' },
    { inicio: '12:00', fin: '14:00', label: '12:00 PM - 2:00 PM' },
    { inicio: '14:00', fin: '16:00', label: '2:00 PM - 4:00 PM' },
    { inicio: '16:00', fin: '18:00', label: '4:00 PM - 6:00 PM' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appointmentsService: AppointmentsService,
    private estadosCitaService: EstadoCitaService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idCita = +params['id'];
      if (this.idCita) {
        this.cargarDetalleCita();
        this.cargarEstados();
      }
    });

    const serviciosGuardados = localStorage.getItem(`cita_${this.idCita}_servicios`);
    if (serviciosGuardados) {
      this.serviciosCompletados = new Set(JSON.parse(serviciosGuardados));
    }
  }

  cargarDetalleCita(): void {
    this.loading = true;
    this.errorMessage = '';

    this.appointmentsService.obtenerDetalleCita(this.idCita).subscribe({
      next: (response) => {
        console.log('Detalle cita:', response);
        
        if (isSuccessResponse(response)) {
          this.cita = response.data;
          this.observaciones = this.cita.observacionesCita;
          this.estadoSeleccionado = this.cita.estadoCita;
          
          this.franjaOriginal = {
            inicio: this.formatTimeOnly(this.cita.fechaInicio),
            fin: this.formatTimeOnly(this.cita.fechaFin)
          };
          
          this.fechaSeleccionada = this.formatDateForInput(this.cita.fechaInicio);
          this.horarioSeleccionado = this.franjaOriginal.inicio;
        } else {
          this.errorMessage = response.message;
        }
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar detalle:', error);
        this.errorMessage = 'Error al cargar el detalle de la cita';
        this.loading = false;
      }
    });
  }

  cargarEstados(): void {
    this.estadosCitaService.obtenerEstadosDisponibles().subscribe({
      next: (response) => {
        console.log('Estados disponibles:', response);
        
        if (isSuccessResponse(response)) {
          this.estadosDisponibles = response.data;
        }
      },
      error: (error) => {
        console.error('Error al cargar estados:', error);
      }
    });
  }

  onFechaHoraChange(): void {
    if (!this.cita) return;
    
    const horarioNuevo = this.horarioSeleccionado;
    const fechaNueva = this.fechaSeleccionada;
    const fechaOriginal = this.formatDateForInput(this.cita.fechaInicio);
    
    this.cambioFranja = (fechaNueva !== fechaOriginal || horarioNuevo !== this.franjaOriginal.inicio);
  }

  toggleServicioCompletado(servicio: string): void {
    if (this.serviciosCompletados.has(servicio)) {
      this.serviciosCompletados.delete(servicio);
    } else {
      this.serviciosCompletados.add(servicio);
    }
    
    localStorage.setItem(
      `cita_${this.idCita}_servicios`, 
      JSON.stringify(Array.from(this.serviciosCompletados))
    );
  }

  isServicioCompletado(servicio: string): boolean {
    return this.serviciosCompletados.has(servicio);
  }

  actualizarCita(): void {
    if (!this.cita) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const horario = this.horariosDisponibles.find(h => h.inicio === this.horarioSeleccionado);
    if (!horario) {
      this.errorMessage = 'Horario inválido';
      this.loading = false;
      return;
    }

    const fechaInicio = `${this.fechaSeleccionada}T${horario.inicio}:00`;
    const fechaFin = `${this.fechaSeleccionada}T${horario.fin}:00`;

    const datos = {
      idCita: this.idCita,
      observacionesCita: this.observaciones,
      estadoCita: this.cambioFranja ? null : this.estadoSeleccionado,
      fechaInicio: this.cambioFranja ? fechaInicio : null,
      fechaFin: this.cambioFranja ? fechaFin : null
    };

    console.log('Actualizando cita:', datos);

    this.appointmentsService.actualizarCita(datos).subscribe({
      next: (response) => {
        console.log('✅ Cita actualizada:', response);
        this.loading = false;
        
        if (isSuccessResponse(response)) {
          this.successMessage = 'Cita actualizada exitosamente';
          setTimeout(() => {
            this.router.navigate(['/appointments']);
          }, 2000);
        } else {
          this.errorMessage = response.message;
        }
      },
      error: (error) => {
        console.error('❌ Error al actualizar:', error);
        this.loading = false;
        this.errorMessage = error.error?.message || 'Error al actualizar la cita';
      }
    });
  }

  volver(): void {
    this.router.navigate(['/appointments']);
  }

  getStatusColor(status: string): string {
    switch (status.toUpperCase()) {
      case 'PENDIENTE':
        return 'bg-blue-200 text-blue-800 border-blue-300';
      case 'COMPLETADA':
        return 'bg-green-200 text-green-800 border-green-300';
      case 'CANCELADA':
        return 'bg-red-200 text-red-800 border-red-300';
      case 'REAGENDADA':
        return 'bg-purple-200 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-200 text-gray-800 border-gray-300';
    }
  }

  getStatusText(status: string): string {
    switch (status.toUpperCase()) {
      case 'PENDIENTE':
        return 'Pendiente';
      case 'COMPLETADA':
        return 'Completada';
      case 'CANCELADA':
        return 'Cancelada';
      case 'REAGENDADA':
        return 'Reagendada';
      default:
        return status;
    }
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

  formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  formatTimeOnly(dateString: string): string {
    const date = new Date(dateString);
    return date.toTimeString().substring(0, 5);
  }

  get minDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }
}
