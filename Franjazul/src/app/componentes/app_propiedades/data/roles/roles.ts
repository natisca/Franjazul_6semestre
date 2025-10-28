import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RolesService, Rol } from '../../../../services/rolesService'; 

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './roles.html',
  styleUrls: ['./roles.css']
})
export class Roles implements OnInit {
  roles: Rol[] = [];
  cargando: boolean = false;
  error: string = '';

  constructor(private rolesService: RolesService) {}

  ngOnInit(): void {
    this.cargarRoles();
  }

  cargarRoles(): void {
    this.cargando = true;
    this.error = '';
    
    this.rolesService.obtenerTodos().subscribe({
      next: (response) => {
        if (response.success) {
          this.roles = response.data;
          console.log('Roles cargados:', this.roles);
        } else {
          this.error = response.message;
        }
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los roles. Verifique que el servidor esté funcionando.';
        console.error('Error:', err);
        this.cargando = false;
      }
    });
  }

  eliminarRol(id: number): void {
    const confirmar = confirm('¿Está seguro de que desea eliminar este rol?');
    
    if (!confirmar) {
      return;
    }

    this.rolesService.eliminar(id).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('Rol eliminado exitosamente');
          alert('Rol eliminado correctamente');
          this.cargarRoles();
        } else {
          alert('Error: ' + response.message);
        }
      },
      error: (err) => {
        alert('Error al eliminar el rol');
        console.error('Error:', err);
      }
    });
  }
}
