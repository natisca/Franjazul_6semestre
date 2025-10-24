import { Component, EventEmitter, Input, Output } from '@angular/core';
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

  //Con esto, se le indica al layout cuando se mueve el sidebar
  @Output() sidebarToggled = new EventEmitter<boolean>();

  menuItem: MenuItem[] = [
    { icon: 'home', label: 'Dashboard', route: '/dashboard' },
    { icon: 'table-cells', label: 'Tablas', route: '/tablas' },
    { icon: 'document-text', label: 'Reportes', route: '/' },
    { icon: 'calendar', label: 'Citas', route: '/appointments' },
  ];


  toggleSidebar() {
    if (this.isAnimating) return; 
    
    this.isAnimating = true;
    this.isCollapsed = !this.isCollapsed;
    
    // Envia el estado del sidebar al layout
    this.sidebarToggled.emit(this.isCollapsed);
    
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

  get sidebarWidth(): number {
    return this.isCollapsed ? 68 : 220;
  }
 
}