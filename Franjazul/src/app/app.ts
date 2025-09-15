import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { login } from "./componentes/Autenticacion/login/login";
import { Sidebar } from "./componentes/Reutilizables/sidebar/sidebar";



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, login, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Franjazul');
}
