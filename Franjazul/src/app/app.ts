import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Login } from "./componentes/Autenticacion/login/login";
import { Sidebar } from "./componentes/Reutilizables/sidebar/sidebar";
import { Header } from './componentes/Reutilizables/header/header';
import { home } from './componentes/Negocio/home/home';
import { Footer } from "./componentes/Reutilizables/footer/footer";
import { Dashboard } from "./componentes/Negocio/dashboard/dashboard";
import { Tablas } from "./componentes/Negocio/tablas/tablas";
import { Usuarios } from "./componentes/app_propiedades/data/usuarios/usuarios";
import { Permisos } from "./componentes/app_propiedades/data/permisos/permisos";
import { Roles } from './componentes/app_propiedades/data/roles/roles';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Login, Sidebar, Header, home, Footer, Dashboard, Tablas, Usuarios, Permisos, Roles],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Franjazul');
}
