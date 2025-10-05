import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './usuarios.html',
  styleUrls: ['./usuarios.css']
})


export class Usuarios {

  ID_usuario:string = '';
  nombre_us:string= '';
  apellido_us:string= '';
  apellido2_us:string= '';
  email_us:string= '';
  password_us:string= '';
  telefono_us:number= 0;
  perfil_de_usuario:number= 0;
  cargo_de_usuario:string= '';


  usuarios: Usuarios[] = [];
  paginaActual = 0;
  filasPorPagina = 10;
  filtro = '';


    get UsuariosFiltrados() {
    let datos = this.usuarios.filter(c =>
      c.nombre_us.toLowerCase().includes(this.filtro.toLowerCase()) ||
      c.email_us.toLowerCase().includes(this.filtro.toLowerCase())
    );
    const inicio = this.paginaActual * this.filasPorPagina;
    return datos.slice(inicio, inicio + this.filasPorPagina);
  }

    siguientePagina() {
    if ((this.paginaActual + 1) * this.filasPorPagina < this.usuarios.length) {
      this.paginaActual++;
    }
  }

  anteriorPagina() {
    if (this.paginaActual > 0) {
      this.paginaActual--;
    }
  }

  eliminarUsuario(id: string) {
    this.usuarios = this.usuarios.filter(c => c.ID_usuario !== id);
  }

}
