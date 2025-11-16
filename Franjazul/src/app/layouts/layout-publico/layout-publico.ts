import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../../componentes/Reutilizables/header/header';
import { Footer } from '../../componentes/Reutilizables/footer/footer';
import { Navbar } from "../../componentes/Reutilizables/navbar/navbar";

@Component({
  selector: 'app-layout-publico',
  standalone: true,
  imports: [RouterOutlet, Header, Footer, Navbar],
  templateUrl: './layout-publico.html',
  styleUrl: './layout-publico.css'
})
export class LayoutPublico {

}
