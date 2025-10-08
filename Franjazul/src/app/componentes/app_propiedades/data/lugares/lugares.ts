import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-lugares',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lugares.html',
  styleUrls: ['./lugares.css']
})
export class Lugares {

  ID_lugar:number = 0;
  nombre_lugar:string = '';
  direccion_lugar:string = '';
  lugar_dentro_lugar:number = 0;
  TL_del_lugar:number = 0;

  lista_lugares:Lugares[] = [];

  eliminarLugar(id:number){
    this.lista_lugares = this.lista_lugares.filter(ll => ll.ID_lugar !== id);
  }

}
