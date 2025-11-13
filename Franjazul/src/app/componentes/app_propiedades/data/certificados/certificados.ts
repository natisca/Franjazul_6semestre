// src/app/pages/certificados/certificados.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CertificadosService, Certificado } from '../../../../services/certificadosService';

@Component({
  selector: 'app-certificados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './certificados.html',
  styleUrls: ['./certificados.css']
})
export class CertificadosComponent implements OnInit {
  certificados: Certificado[] = [];
  cargando: boolean = false;
  error: string = '';

  constructor(private certificadosService: CertificadosService) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.error = '';
    
    console.log('🔵 Cargando certificados...');
    
    this.certificadosService.obtenerTodos().subscribe({
      next: (response) => {
        console.log('✅ Respuesta:', response);
        if (response.success) {
          this.certificados = response.data;
          console.log('📊 Certificados cargados:', this.certificados);
        } else {
          this.error = response.message;
        }
        this.cargando = false;
      },
      error: (err) => {
        console.error('❌ Error:', err);
        this.error = 'Error al cargar certificados';
        this.cargando = false;
      }
    });
  }

  // Obtener nombre completo del cliente (usuario que creó la cita)
  obtenerNombreCliente(certificado: Certificado): string {
    const usuario = certificado.cita?.usuarioCreo;
    if (!usuario) return 'No especificado';
    
    const partes = [
      usuario.nombreUs,
      usuario.apellidoUs,
      usuario.apellido2Us
    ].filter(p => p);
    
    return partes.length > 0 ? partes.join(' ') : usuario.idUsuario;
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatearFechaCorta(fecha: string): string {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  calcularDiasRestantes(fechaVence: string): number {
    const hoy = new Date();
    const vence = new Date(fechaVence);
    const diffTime = vence.getTime() - hoy.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  obtenerEstadoVigencia(fechaVence: string): 'vigente' | 'proximo-vencer' | 'vencido' {
    const diasRestantes = this.calcularDiasRestantes(fechaVence);
    if (diasRestantes < 0) return 'vencido';
    if (diasRestantes <= 30) return 'proximo-vencer';
    return 'vigente';
  }

  obtenerColorEstado(estado: string): string {
    switch (estado) {
      case 'vigente':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'proximo-vencer':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'vencido':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  }

  obtenerTextoEstado(estado: string): string {
    switch (estado) {
      case 'vigente':
        return 'Vigente';
      case 'proximo-vencer':
        return 'Por Vencer';
      case 'vencido':
        return 'Vencido';
      default:
        return 'Desconocido';
    }
  }
}