import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-certificados',
  standalone:true,
  imports: [CommonModule, RouterModule],
  templateUrl: './certificados.html',
  styleUrls: ['./certificados.css']
})
export class Certificados {

  codigo_CER:string = '';
  fecha_emision:Date = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
  fecha_vence:Date = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
  cita_en_CER:number = 0;

  listaCer:Certificados[] = [];

  eliminarCer(codigo:string){
    this.listaCer = this.listaCer.filter(lc => lc.codigo_CER !== codigo);
  }
}