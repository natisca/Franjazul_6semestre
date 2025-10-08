import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-moleculas',
  standalone:true,
  imports: [CommonModule, RouterModule],
  templateUrl: './moleculas.html',
  styleUrls: ['./moleculas.css']
})

export class Moleculas {

  nombre_MOL:string = '';
  descripcion_MOL:string = '';

  listaMol:Moleculas[] = [];

  eliminarMol(nombre:string){
    this.listaMol = this.listaMol.filter(lm => lm.nombre_MOL !== nombre);
  }

}
