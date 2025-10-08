import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tipo-lugar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tipo-lugar.html',
  styleUrls: ['./tipo-lugar.css']
})
export class TipoLugar {
  
  ID_TL:number = 0;
  nombre_TL:string = '';

  lista_tp:TipoLugar[] = []

  eliminarTP(id:number){
    this.lista_tp = this.lista_tp.filter(tp => tp.ID_TL !== id);
  }
}
