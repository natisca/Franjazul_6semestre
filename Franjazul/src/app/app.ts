import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Login } from "./componentes/Autenticacion/login/login";
import { Sidebar } from "./componentes/Reutilizables/sidebar/sidebar";



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Login, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Franjazul');
}
