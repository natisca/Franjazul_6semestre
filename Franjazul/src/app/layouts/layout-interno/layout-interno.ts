import { Component } from '@angular/core';
import { Sidebar } from '../../componentes/Reutilizables/sidebar/sidebar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout-interno',
  standalone: true,
  imports: [Sidebar, RouterOutlet],
  templateUrl: './layout-interno.html',
  styleUrl: './layout-interno.css'
})
export class LayoutInterno {

  colapsado = false;

  onSidebarToggle(collapsed: boolean) {
    this.colapsado = collapsed;
  }

  get leftMargin(): number {
    return this.colapsado ? 4.25 : 13.75; 
  }
}
