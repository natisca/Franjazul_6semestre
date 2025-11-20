import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';

interface MenuTablas {
  label: string;
  route: string;
}

@Component({
  selector: 'app-tablas',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './tablas.html',
  styleUrls: ['./tablas.css']
})
export class Tablas {

  allMenuTablas: MenuTablas[] = [
    {label: 'Roles', route: '/roles'},
    {label: 'Formularios', route: '/formularios'},
    {label: 'Perfiles', route: '/perfiles'},
    {label: 'Permisos', route: '/permisos'},
    {label: 'Cargos', route: '/cargos'},
    {label: 'Usuarios', route: '/usuarios'},
    {label: 'Franjas', route: '/franjas'},
    {label: 'Lugares', route: '/lugares'},
    {label: 'Tipo_lugar', route: '/tipo-lugar'},
    {label: 'Certificados', route: '/certificados'},
    {label: 'Moleculas', route: '/moleculas'},
    {label: 'Tipo_servicio', route: '/tipo-servicio'},
    {label: 'Servicios', route: '/servicios'},
    {label: 'Estado_Cita', route: '/estado-cita'},
    {label: 'Citas', route: '/citas'},
    {label: 'Cita_servicio', route: '/cita-servicio'}
  ];

  filteredMenuTablas: MenuTablas[] = this.allMenuTablas;
  
}
