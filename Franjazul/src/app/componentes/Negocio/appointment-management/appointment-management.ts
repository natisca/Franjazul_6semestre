import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface AppointmentDetails {
  id: string;
  client: string;
  clientPhone: string;
  clientEmail: string;
  service: string;
  date: string;
  time: string;
  location: string;
  address: string;
  status: 'programada' | 'en-proceso' | 'completada' | 'cancelada';
  technician: string;
  technicianId: string;
  description: string;
  estimatedDuration: string;
  priority: 'baja' | 'media' | 'alta' | 'urgente';
  resources: string[];
  comments: string[];
}

@Component({
  selector: 'app-appointment-management',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './appointment-management.html',
  styleUrl: './appointment-management.css'
})
export class AppointmentManagement {

  @Input() appointmentId: string = 'APT-001';
  @Input() userRole: 'tecnico' | 'supervisor' | 'admin' = 'tecnico';
  @Input() userId: string = 'tech001';

  appointment: AppointmentDetails = {
    id: 'APT-001',
    client: 'Hotel Plaza Central',
    clientPhone: '+57 300 123 4567',
    clientEmail: 'gerencia@plazacentral.com',
    service: 'Fumigación Comercial',
    date: '2024-01-15',
    time: '09:00',
    location: 'Centro',
    address: 'Calle 5 #123, Centro, Bogotá',
    status: 'programada',
    technician: 'Carlos Ruiz',
    technicianId: 'tech001',
    description:
      'Fumigación preventiva en áreas comunes del hotel. Incluye lobby, restaurante y pasillos.',
    estimatedDuration: '3 horas',
    priority: 'media',
    resources: [
      'Insecticida líquido',
      'Equipo de aspersión',
      'Mascarillas N95',
      'Trajes de protección',
    ],
    comments: [
      'Cliente solicita realizar el trabajo temprano en la mañana',
      'Evitar el área del restaurante durante el desayuno (7:00-9:00 AM)',
    ],
  };

  newComment = '';
  requestedResources = '';
  newStatus = this.appointment.status;

  getStatusColor(status: string): string {
    switch (status) {
      case 'programada':
        return 'bg-blue-200 text-blue-800 border-blue-300';
      case 'en-proceso':
        return 'bg-yellow-200 text-yellow-800 border-yellow-300';
      case 'completada':
        return 'bg-green-200 text-green-800 border-green-300';
      case 'cancelada':
        return 'bg-red-200 text-red-800 border-red-300';
      default:
        return 'bg-gray-200 text-gray-800 border-gray-300';
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'baja':
        return 'bg-gray-200 text-gray-800 border-gray-300';
      case 'media':
        return 'bg-blue-200 text-blue-800 border-blue-300';
      case 'alta':
        return 'bg-orange-200 text-orange-800 border-orange-300';
      case 'urgente':
        return 'bg-red-200 text-red-800 border-red-300';
      default:
        return 'bg-gray-200 text-gray-800 border-gray-300';
    }
  }

  handleStatusChange() {
    this.appointment.status = this.newStatus;
    console.log(`Estado cambiado a: ${this.newStatus}`);
  }

  handleAddComment() {
    if (this.newComment.trim()) {
      this.appointment.comments.push(
        `${new Date().toLocaleString()}: ${this.newComment}`
      );
      console.log('Comentario agregado:', this.newComment);
      this.newComment = '';
    }
  }

  handleRequestResources() {
    if (this.requestedResources.trim()) {
      console.log('Recursos solicitados:', this.requestedResources);
      this.requestedResources = '';
    }
  }

  canModifyAppointment(): boolean {
    return (
      this.userRole === 'admin' ||
      this.userRole === 'supervisor' ||
      (this.userRole === 'tecnico' &&
        this.userId === this.appointment.technicianId)
    );
  }


}
