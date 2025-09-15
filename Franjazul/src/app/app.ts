import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { login } from "./componentes/Autenticacion/login/login";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, login],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Franjazul');
}
