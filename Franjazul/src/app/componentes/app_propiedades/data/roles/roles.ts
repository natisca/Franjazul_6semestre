import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './roles.html',
  styleUrls: ['./roles.css']
})

export class Roles {
    ID_rol:number = 0;
    nombre_rol:string = '';
    descripcion_rol:string= '';

    roles: Roles[]= [];

    eliminarRol(id:number){
      this.roles = this.roles.filter(r => r.ID_rol !== id)
    }
}
