import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ServiceForm } from '../service-form/service-form';
import { AuthService } from '../../../services/authService';

interface Service {
  icon: string;
  title: string;
  description: string;
  image: string;
  features: string[];
  price: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ServiceForm],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class home {

  mostrarForm = false;

  services: Service[] = [
    {
      icon: 'bug-ant',
      title: 'Fumigación Residencial',
      description: 'Protección completa para tu hogar contra todo tipo de plagas domésticas.',
      image: 'images/living-room-930804_640.jpg',
      features: ['Cucarachas', 'Hormigas', 'Arañas', 'Mosquitos'],
      price: 'Desde $80.000',
    },
    {
      icon: 'building-office',
      title: 'Control Comercial',
      description: 'Soluciones especializadas para restaurantes, hoteles y oficinas.',
      image: 'images/restaurant-826738_640.jpg',
      features: ['Reportes mensuales', 'Seguimiento'],
      price: 'Desde $80.000',
    },
    {
      icon: 'shield-check',
      title: 'Desinfección',
      description: 'Eliminación de virus, bacterias y microorganismos patógenos.',
      image: 'images/vaccine-5895477_640.jpg',
      features: ['COVID-19', 'Bacterias', 'Hongos', 'Virus'],
      price: 'Desde $80.000',
    },
    {
      icon: 'home-modern',
      title: 'Control de Roedores',
      description: 'Eliminación segura y efectiva de ratas y ratones con productos fisicos o quimicos.',
      image: 'images/mouse-1708177_640.jpg',
      features: ['Ratas', 'Ratones', 'Sellado de accesos'],
      price: 'Desde $80.000',
    },
    {
      icon: 'leaf',
      title: 'Tratamiento de Jardines',
      description: 'Cuidado integral de espacios verdes y control de plagas exteriores.',
      image: 'images/Jardin.jpg',
      features: ['Pulgones', 'Cochinillas', 'Babosas', 'Caracoles'],
      price: 'Desde $80.000',
    },
    {
      icon: 'bolt',
      title: 'Fumigación Express',
      description: 'Servicio de emergencia disponible 24/7 para casos urgentes.',
      image: 'images/clock-1541213_640.jpg',
      features: ['Servicio 24/7', 'Respuesta rápida', 'Garantía inmediata'],
      price: 'Desde $80.000',
    },
  ];

    constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  abrirForm(): void {
    if (!this.authService.isAuthenticated()) {
      alert('Debes iniciar sesión para solicitar un servicio');
      this.router.navigate(['/login']);
      return;
    }

    const currentUser = this.authService.currentUserValue;
    if (!currentUser || currentUser.cargo.toUpperCase() !== 'CLIENTE') {
      alert('Solo los clientes pueden solicitar servicios');
      return;
    }

    this.mostrarForm = true;
  }

  cerrarForm(): void {
    this.mostrarForm = false;
  }

}
