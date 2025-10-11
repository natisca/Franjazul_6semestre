import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceForm } from '../service-form/service-form';

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
      image: 'Ruta de la imagen',
      features: ['Cucarachas', 'Hormigas', 'Arañas', 'Mosquitos'],
      price: 'Desde $150.000',
    },
    {
      icon: 'building-office',
      title: 'Control Comercial',
      description: 'Soluciones especializadas para restaurantes, hoteles y oficinas.',
      image: 'Ruta de la imagen',
      features: ['Certificación HACCP', 'Reportes mensuales', 'Seguimiento 24/7'],
      price: 'Desde $300.000',
    },
    {
      icon: 'shield-check',
      title: 'Desinfección',
      description: 'Eliminación de virus, bacterias y microorganismos patógenos.',
      image: 'Ruta de la imagen',
      features: ['COVID-19', 'Bacterias', 'Hongos', 'Virus'],
      price: 'Desde $200.000',
    },
    {
      icon: 'home-modern',
      title: 'Control de Roedores',
      description: 'Eliminación segura y efectiva de ratas y ratones.',
      image: 'Ruta de la imagen',
      features: ['Ratas', 'Ratones', 'Sellado de accesos', 'Monitoreo'],
      price: 'Desde $180.000',
    },
    {
      icon: 'leaf',
      title: 'Tratamiento de Jardines',
      description: 'Cuidado integral de espacios verdes y control de plagas exteriores.',
      image: 'Ruta de la imagen',
      features: ['Pulgones', 'Cochinillas', 'Babosas', 'Caracoles'],
      price: 'Desde $120.000',
    },
    {
      icon: 'bolt',
      title: 'Fumigación Express',
      description: 'Servicio de emergencia disponible 24/7 para casos urgentes.',
      image: 'Ruta de la imagen',
      features: ['Servicio 24/7', 'Respuesta rápida', 'Garantía inmediata'],
      price: 'Desde $250.000',
    },
  ];

  abrirForm(){
    this.mostrarForm = true;
  }

  cerrarForm(){
    this.mostrarForm = false;
  }

}
