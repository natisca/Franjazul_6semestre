import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

interface Appointment {
  id: string;
  client: string;
  service: string;
  date: string;
  time: string;
  location: string;
  status: 'programada' | 'en-proceso' | 'completada';
  technician: string;
}

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './appointments.html',
  styleUrl: './appointments.css'
})

export class Appointments implements OnInit{
  appointments: Appointment[] = [];

  totalProgramadas = 0;
  totalEnProceso = 0;


   ngOnInit(): void {
    this.appointments = [
      {
        id: '1',
        client: 'Hotel Plaza Central',
        service: 'Fumigación Comercial',
        date: '2024-01-15',
        time: '09:00',
        location: 'Centro, Calle 5 #123',
        status: 'programada',
        technician: 'Carlos Ruiz',
      },
      {
        id: '2',
        client: 'Residencia Familia López',
        service: 'Control de Roedores',
        date: '2024-01-15',
        time: '14:30',
        location: 'Norte, Carrera 15 #45-67',
        status: 'programada',
        technician: 'Ana García',
      }
    ]

        // Ordenar por fecha
    this.appointments.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`).getTime();
      const dateB = new Date(`${b.date}T${b.time}`).getTime();
      return dateA - dateB;
    });

    this.calcularTotales();
  }

   calcularTotales(): void {
    this.totalProgramadas = this.appointments.filter(a => a.status === 'programada').length;
    this.totalEnProceso = this.appointments.filter(a => a.status === 'en-proceso').length;
  }

   getStatusColor(status: string): string {
    switch (status) {
      case 'programada':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'en-proceso':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completada':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'programada':
        return 'Programada';
      case 'en-proceso':
        return 'En Proceso';
      case 'completada':
        return 'Completada';
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


}
