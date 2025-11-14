import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tablas',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './tablas.html',
  styleUrls: ['./tablas.css']
})
export class Tablas {
  tablas= [
    'Roles',
    'Formularios',
    'Perfiles',
    'Permisos',
    'Cargos',
    'Usuarios',
    'Franjas',
    'Lugares',
    'Tipo_lugar',
    'Certificados',
    'Moleculas',
    'Tipo_servicio',
    'Servicios',
    'Estado_Cita',
    'Citas',
    'Cita_servicio'
  ];
}
