import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cargos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cargos.html',
  styleUrls: ['./cargos.css']
})

export class Cargos {

  Nombre_cargo:string = '';
  descripcion_cargo:string = '';

  cargos:Cargos[] = [];

  eliminarCargos(nombre:string){
    this.cargos = this.cargos.filter(c => c.Nombre_cargo !== nombre);
  }

}
