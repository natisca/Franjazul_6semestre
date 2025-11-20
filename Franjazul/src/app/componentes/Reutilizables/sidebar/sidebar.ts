import { Component, EventEmitter, input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService, LoginResponse } from '../../../services/authService';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
  roles: string[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})

export class Sidebar implements OnInit {
  @Output() sidebarToggled = new EventEmitter<boolean>();

  currentUser: LoginResponse | null = null;
  isCollapsed = false;
  private isAnimating = false;

  allMenuItems: MenuItem[] = [
    { icon: 'home', label: 'Dashboard', route: '/dashboard', roles: ['TECNICO', 'ADMINISTRADOR'] },
    { icon: 'calendar', label: 'Mis citas', route: '/appointments', roles: ['TECNICO'] },
    { icon: 'table-cells', label: 'Tablas', route: '/tablas', roles: ['ADMINISTRADOR'] },
    { icon: 'document-text', label: 'Reportes', route: '/reportes', roles: ['ADMINISTRADOR'] }
  ];

  filteredMenuItems: MenuItem[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.filterMenuByRole();
    });
  }

  filterMenuByRole(): void {
    if (!this.currentUser) {
      this.filteredMenuItems = [];
      return;
    }

    const userCargo = this.currentUser.cargo.toUpperCase();
    this.filteredMenuItems = this.allMenuItems.filter(item =>
      item.roles.includes(userCargo)
    );
  }

  toggleSidebar(): void {
    if (this.isAnimating) return;

    this.isAnimating = true;
    this.isCollapsed = !this.isCollapsed;
    this.sidebarToggled.emit(this.isCollapsed);

    setTimeout(() => {
      this.isAnimating = false;
    }, 300);
  }

  handleLogout(): void {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      this.authService.logout();
    }
  }

  get userName(): string {
    return this.currentUser?.nombreCompleto || 'Usuario';
  }

  get userRol(): string {
    return this.currentUser?.cargo || 'Rol';
  }

  get initials(): string {
    if (!this.currentUser) return 'U';
    return this.currentUser.nombreCompleto
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  get sidebarWidth(): number {
    return this.isCollapsed ? 68 : 220;
  }
}