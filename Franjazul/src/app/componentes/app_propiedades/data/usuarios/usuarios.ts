
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UsuariosService, Usuario } from '../../../../services/usuariosService';
import { UsuarioModalComponent } from '../../../modals/usuario-modal/usuario-modal'; 

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, RouterModule, UsuarioModalComponent],
  templateUrl: './usuarios.html',
  styleUrls: ['./usuarios.css']
})
export class Usuarios implements OnInit {
  usuarios: Usuario[] = [];
  cargando: boolean = false;
  error: string = '';
  
  // Estados del modal
  isModalOpen: boolean = false;
  usuarioSeleccionado: Usuario | null = null;
  
  // Estado de operaciones
  guardando: boolean = false;

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.cargando = true;
    this.error = '';
    
    this.usuariosService.obtenerTodos().subscribe({
      next: (response) => {
        if (response.success) {
          this.usuarios = response.data;
          console.log('Usuarios cargados:', this.usuarios);
        } else {
          this.mostrarError(response.message);
        }
        this.cargando = false;
      },
      error: (err) => {
        this.mostrarError('Error al cargar los usuarios. Verifique que el servidor esté funcionando.');
        console.error('Error:', err);
        this.cargando = false;
      }
    });
  }

  // Abrir modal para crear nuevo usuario
  abrirModalNuevo(): void {
    this.usuarioSeleccionado = null;
    this.isModalOpen = true;
  }

  // Abrir modal para editar usuario existente
  abrirModalEditar(usuario: Usuario): void {
    this.usuarioSeleccionado = { ...usuario };
    this.isModalOpen = true;
  }

  // Cerrar modal
  cerrarModal(): void {
    this.isModalOpen = false;
    this.usuarioSeleccionado = null;
  }

  // Guardar usuario (crear o actualizar)
  guardarUsuario(usuarioData: Partial<Usuario>): void {
    this.guardando = true;

    if (this.usuarioSeleccionado && this.usuarioSeleccionado.idUsuario) {
      // Actualizar usuario existente
      this.usuariosService.actualizar(this.usuarioSeleccionado.idUsuario, usuarioData).subscribe({
        next: (response) => {
          if (response.success) {
            this.mostrarExito('Usuario actualizado correctamente');
            this.cerrarModal();
            this.cargarUsuarios();
          } else {
            this.mostrarError(response.message);
          }
          this.guardando = false;
        },
        error: (err) => {
          this.manejarErrorOperacion(err, 'actualizar');
          this.guardando = false;
        }
      });
    } else {
      // Crear nuevo usuario
      this.usuariosService.crear(usuarioData).subscribe({
        next: (response) => {
          if (response.success) {
            this.mostrarExito('Usuario creado correctamente');
            this.cerrarModal();
            this.cargarUsuarios();
          } else {
            this.mostrarError(response.message);
          }
          this.guardando = false;
        },
        error: (err) => {
          this.manejarErrorOperacion(err, 'crear');
          this.guardando = false;
        }
      });
    }
  }

  // Eliminar usuario
  eliminarUsuario(idUsuario: string, nombreCompleto: string): void {
    const confirmar = confirm(
      `¿Está seguro de que desea eliminar al usuario "${nombreCompleto}"?\n\nEsta acción no se puede deshacer.`
    );
    
    if (!confirmar) {
      return;
    }

    this.usuariosService.eliminar(idUsuario).subscribe({
      next: (response) => {
        if (response.success) {
          this.mostrarExito('Usuario eliminado correctamente');
          this.cargarUsuarios();
        } else {
          this.mostrarError(response.message);
        }
      },
      error: (err) => {
        this.manejarErrorOperacion(err, 'eliminar');
      }
    });
  }

  // Obtener nombre completo del usuario
  obtenerNombreCompleto(usuario: Usuario): string {
    let nombreCompleto = `${usuario.nombreUs} ${usuario.apellidoUs}`;
    if (usuario.apellido2Us) {
      nombreCompleto += ` ${usuario.apellido2Us}`;
    }
    return nombreCompleto;
  }

  // Formatear teléfono para mostrar
  formatearTelefono(telefono: number): string {
    const telefonoStr = telefono.toString();
    return `${telefonoStr.substring(0, 3)}-${telefonoStr.substring(3, 6)}-${telefonoStr.substring(6)}`;
  }

  // Manejo de errores de operaciones
  private manejarErrorOperacion(err: any, operacion: string): void {
    console.error(`Error al ${operacion}:`, err);
    
    let mensajeError = `Error al ${operacion} el usuario.`;
    
    if (err.error?.message) {
      mensajeError = err.error.message;
    } else if (err.status === 0) {
      mensajeError = 'No se puede conectar con el servidor. Verifica tu conexión.';
    } else if (err.status === 404) {
      mensajeError = 'El recurso solicitado no fue encontrado.';
    } else if (err.status === 500) {
      mensajeError = 'Error interno del servidor. Contacta al administrador.';
    }
    
    this.mostrarError(mensajeError);
  }

  // Mostrar mensaje de error
  private mostrarError(mensaje: string): void {
    this.error = mensaje;
    alert('❌ ' + mensaje);
  }

  // Mostrar mensaje de éxito
  private mostrarExito(mensaje: string): void {
    alert('✅ ' + mensaje);
  }
}
