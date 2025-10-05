import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-permisos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './permisos.html',
  styleUrls: ['./permisos.css']
})

export class Permisos {
  ID_per:number = 0;
  nombre_per:string = '';
  descripcion_per:string = '';
  ID_rol_en_per:number= 0;

  permisos: Permisos[] = [];

  eliminarPermiso(id:number){
    this.permisos = this.permisos.filter(p => p.ID_per !== id);
  }

}

