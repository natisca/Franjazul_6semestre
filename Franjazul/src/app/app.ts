import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Login } from "./componentes/Autenticacion/login/login";
import { Sidebar } from "./componentes/Reutilizables/sidebar/sidebar";
import { Header } from './componentes/Reutilizables/header/header';
import { home } from './componentes/Negocio/home/home';
import { Footer } from "./componentes/Reutilizables/footer/footer";
import { Dashboard } from "./componentes/Negocio/dashboard/dashboard";



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Login, Sidebar, Header, home, Footer, Dashboard],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Franjazul');
}
