
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-acerca-de-nosotros',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './acerca-de-nosotros.html',
  styleUrls: ['./acerca-de-nosotros.css']
})
export class AcercaDeNosotrosComponent {
  servicios = [
    {
      icon: '🛡️',
      titulo: 'Manejo Integral de Plagas',
      descripcion: 'Control profesional y responsable de plagas urbanas'
    },
    {
      icon: '📋',
      titulo: 'Diagnóstico Técnico Personalizado',
      descripcion: 'Evaluaciones detalladas adaptadas a cada instalación'
    },
    {
      icon: '🔄',
      titulo: 'Programas Preventivos y Correctivos',
      descripcion: 'Soluciones continuas para mantener espacios libres de plagas'
    },
    {
      icon: '📊',
      titulo: 'Reportes Digitales para Auditorías',
      descripcion: 'Documentación completa y trazable de cada intervención'
    },
    {
      icon: '🌿',
      titulo: 'Productos Certificados y Ecológicos',
      descripcion: 'Uso de sustancias aprobadas con Sello Verde'
    },
    {
      icon: '👨‍🔬',
      titulo: 'Acompañamiento Profesional Permanente',
      descripcion: 'Soporte técnico continuo y capacitación especializada'
    }
  ];

  sectores = [
    {
      icon: '💊',
      titulo: 'Industria Farmacéutica',
      descripcion: 'Control profesional para evitar riesgos de contaminación en productos, insumos y ambientes limpios, cumpliendo con BPM y normativas de salud pública.'
    },
    {
      icon: '🍽️',
      titulo: 'Industria Alimentaria',
      descripcion: 'Programas personalizados que garantizan la inocuidad de los alimentos, protegiendo los procesos y cumpliendo con exigencias sanitarias nacionales e internacionales.'
    },
    {
      icon: '🏨',
      titulo: 'Hotelería',
      descripcion: 'Soluciones discretas, efectivas y adaptadas al sector hotelero, protegiendo la imagen y experiencia del cliente mediante control responsable y profesional.'
    },
    {
      icon: '🏪',
      titulo: 'Comercio',
      descripcion: 'Protegemos espacios comerciales, mercancías y reputación empresarial, mediante programas ajustados a cada negocio, priorizando ambientes seguros y sin riesgos.'
    }
  ];

  ventajas = [
    'Contamos con el concepto favorable Sello Verde de Secretaría de Salud',
    'Calificación favorable en nuestro Sistema de Seguridad y Salud en el Trabajo (SG-SST)',
    'Técnicos certificados como controladores de plagas a nivel urbano',
    'Productos químicos de alta calidad de uso en salud pública con resultados eficaces',
    'Acceso gratuito a asesorías técnicas, diagnósticos e informes',
    'Amplio rango de equipos, métodos y productos para el control de plagas',
    'Servicio inmediato y oportuno en el horario que el cliente necesite'
  ];

  contacto = {
    telefono: '323 705 06 75',
    direccion: 'Carrera 42A # 41-95',
    ciudad: 'Medellín, Antioquia',
    email: 'servicio.laalianza@gmail.com',
    concepto: '10014011875'
  };

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
