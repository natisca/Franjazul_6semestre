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

  ID_per_en_perm:number = 0;
  ID_form_en_perm:number = 0;
  Puede_crear:number = 0;
  puede_borrar:number = 0;
  puede_editar:number = 0;
  puede_leer:number = 0;

  permisos:Permisos[] = [];
  
  eliminarPermiso(id:number, id2:number){
    this.permisos = this.permisos.filter(p => p.ID_per_en_perm !== id && p.ID_form_en_perm !== id2);
  }
  
}
