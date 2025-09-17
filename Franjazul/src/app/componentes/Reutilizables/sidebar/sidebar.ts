import { Component, Input } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIf],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class Sidebar {
  @Input() userName: string = 'Yo';
  @Input() userRol: string = 'Probando';
  @Input() userAvatar?: string;

  isCollapsed = false;

  menuItem: MenuItem[] = [
    { icon: 'home', label: 'Dashboard', route: '/' },
    { icon: 'table-cells', label: 'Tablas', route: '/' },
    { icon: 'document-text', label: 'Reportes', route: '/' },
    { icon: 'cog-6-tooth', label: 'Configuración', route: '/' },
  ];

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  handleLogout() {
    console.log('saliendo');
  }

  get initials(): string {
    return this.userName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }
}
