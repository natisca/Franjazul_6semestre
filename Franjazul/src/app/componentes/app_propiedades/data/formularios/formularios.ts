import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-formularios',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './formularios.html',
  styleUrl: './formularios.css'
})

export class Formularios {

  ID_form:number = 0;
  titulo_form:string = '';
  url_form:string = '';
  es_padre:number = 0;
  orden:number = 0;
  form_recursivo:number = 0;

  form:Formularios[] = [];

  eliminarFormulario(id:number){
    this.form = this.form.filter(f => f.ID_form !== id);
  }

}
