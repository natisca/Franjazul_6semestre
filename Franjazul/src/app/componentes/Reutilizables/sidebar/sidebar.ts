import { Component, Input, input } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { isFormControl } from '@angular/forms';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, NgIf],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})

export class Sidebar {
  @Input() userName: String = 'Yo';
  @Input() userRol: String = 'Probando';
  @Input() userAvatar?: String;

  isCollapsed = false;

  menuItem: MenuItem[] = [
    { icon: 'home', label: 'Dashboard', route: '/' },
    { icon: 'table', label: 'Tablas', route: '/' },
    { icon: 'file-text', label: 'Reportes', route: '/' },
    { icon: 'settings', label: 'Configuracion', route: '/' },
  ];

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  handleLogout() {
    console.log('saliendo');
    //Metodo cuando le ponga funcionalidad
  }

  get initials(): string {
    return this.userName
      .split('')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }

}
