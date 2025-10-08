import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-franjas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './franjas.html',
  styleUrls: ['./franjas.css']
})
export class Franjas {

  ID_franja:number = 0;
  fecha_inicio:Date = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
  fecha_fin:Date = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
  paginaActual = 0;
  filasPorPagina = 10;

  lista_franjas:Franjas[] = [];

  EliminarFranjas(id:number){
    this.lista_franjas = this.lista_franjas.filter(lf => lf.ID_franja !== id);
  }

      siguientePagina() {
    if ((this.paginaActual + 1) * this.filasPorPagina < this.lista_franjas.length) {
      this.paginaActual++;
    }
  }

  anteriorPagina() {
    if (this.paginaActual > 0) {
      this.paginaActual--;
    }
  }

}