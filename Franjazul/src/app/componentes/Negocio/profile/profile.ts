import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {

  isDarkMode = false;
  showPasswordForm = false;

  profileData = {
    name: 'María González',
    email: 'maria.gonzalez@pestcontrol.com',
    phone: '+57 300 555 6666',
    address: 'Calle 100 #15-20, Bogotá',
    role: 'Supervisora',
  };

  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  constructor(private router: Router) { }

  handleProfileUpdate(): void {
    console.log('Perfil actualizado:', this.profileData);
    alert('Perfil actualizado exitosamente');
  }

  handlePasswordChange(): void {
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (this.passwordData.newPassword.length < 8) {
      alert('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    alert('Contraseña cambiada exitosamente. Serás redirigido al login.');

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);
  }

  handleThemeToggle(): void {
    this.isDarkMode = !this.isDarkMode;
    const root = document.documentElement;
    if (this.isDarkMode) root.classList.add('dark');
    else root.classList.remove('dark');
    console.log('Tema cambiado a:', this.isDarkMode ? 'oscuro' : 'claro');
  }

  cancelPasswordChange(): void {
    this.showPasswordForm = false;
    this.passwordData = { currentPassword: '', newPassword: '', confirmPassword: '' };
  }

}
