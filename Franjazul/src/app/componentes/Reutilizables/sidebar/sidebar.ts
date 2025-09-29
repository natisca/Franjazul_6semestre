import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class Sidebar {
  @Input() userName: string = 'Yo';
  @Input() userRol: string = 'Probando';
  @Input() userAvatar?: string;

  isCollapsed = false;
  private isAnimating = false;

  menuItem: MenuItem[] = [
    { icon: 'home', label: 'Dashboard', route: '/' },
    { icon: 'table-cells', label: 'Tablas', route: '/' },
    { icon: 'document-text', label: 'Reportes', route: '/' },
    { icon: 'cog-6-tooth', label: 'Configuración', route: '/' },
  ];


  toggleSidebar() {
    if (this.isAnimating) return; 
    
    this.isAnimating = true;
    this.isCollapsed = !this.isCollapsed;
    
    setTimeout(() => {
      this.isAnimating = false;
    }, 300);
  }

  handleLogout() {
    console.log('saliendo');
    // Logica del logout
  }

  get initials(): string {
    return this.userName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }
 
}