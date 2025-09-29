import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  citasCompletadas = 87;
  citasPendientes = 23;
  serviciosActivos = 156;
  alertas = 3;

  indicadores = [
    { nombre: 'Fumigación Residencial', valor: 92 },
    { nombre: 'Control de Roedores', valor: 88 },
    { nombre: 'Desinfección', valor: 85 },
  ];

  proximasCitas = [
    {
      cliente: 'Hotel Plaza Central',
      tipo: 'Fumigación Comercial',
      fecha: '11/11/2024',
      hora: '08:00',
      responsable: 'Carlos',
      estado: 'Programada',
    },
    {
      cliente: 'Restaurante El Sabor',
      tipo: 'Control de Roedores',
      fecha: '12/11/2024',
      hora: '14:00',
      responsable: 'Ana',
      estado: 'Pendiente',
    },
    {
      cliente: 'Clínica Santa María',
      tipo: 'Desinfección',
      fecha: '13/11/2024',
      hora: '09:30',
      responsable: 'Luis',
      estado: 'Programada',
    },
  ];
}
