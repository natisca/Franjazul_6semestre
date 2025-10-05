import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-perfiles',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './perfiles.html',
  styleUrls: ['./perfiles.css']
})
export class Perfiles {

  ID_per:number = 0;
  nombre_per:string = '';
  descripcion_per:string = '';
  ID_rol_en_per:number= 0;

  perfiles: Perfiles[] = [];

  eliminarPerfil(id:number){
    this.perfiles = this.perfiles.filter(p => p.ID_per !== id);
  }

}
