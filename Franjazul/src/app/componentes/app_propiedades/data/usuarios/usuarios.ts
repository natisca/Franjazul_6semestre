import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsuariosService, Usuario } from '../../../../services/usuariosService';
import { UsuarioModalComponent } from '../../../modals/usuario-modal/usuario-modal';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, RouterModule, UsuarioModalComponent, FormsModule],
  templateUrl: './usuarios.html',
  styleUrls: ['./usuarios.css']
})
export class Usuarios implements OnInit {
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  usuariosPaginados: Usuario[] = [];
  cargando: boolean = false;
  error: string = '';
  
  // Paginación
  paginaActual: number = 1;
  registrosPorPagina: number = 5;
  totalPaginas: number = 0;
  
  // Filtrado
  terminoBusqueda: string = '';
  
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
          this.aplicarFiltros();
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

  // ==================== FILTRADO ====================
  
  aplicarFiltros(): void {
    const termino = this.terminoBusqueda.toLowerCase().trim();
    
    if (termino === '') {
      this.usuariosFiltrados = [...this.usuarios];
    } else {
      this.usuariosFiltrados = this.usuarios.filter(usuario => {
        const nombreCompleto = this.obtenerNombreCompleto(usuario).toLowerCase();
        const email = usuario.emailUs.toLowerCase();
        const id = usuario.idUsuario.toLowerCase();
        const cargo = usuario.cargoDeUsuario.nombreCargo.toLowerCase();
        const perfil = usuario.perfilDeUsuario.nombrePer?.toLowerCase();
        
        return nombreCompleto.includes(termino) ||
               email.includes(termino) ||
               id.includes(termino) ||
               cargo.includes(termino) ||
               perfil?.includes(termino)
      });
    }
    
    // Resetear a la primera página cuando se filtra
    this.paginaActual = 1;
    this.calcularPaginacion();
  }

  limpiarFiltro(): void {
    this.terminoBusqueda = '';
    this.aplicarFiltros();
  }

  // ==================== PAGINACIÓN ====================
  
  calcularPaginacion(): void {
    this.totalPaginas = Math.ceil(this.usuariosFiltrados.length / this.registrosPorPagina);
    
    // Ajustar página actual si está fuera de rango
    if (this.paginaActual > this.totalPaginas && this.totalPaginas > 0) {
      this.paginaActual = this.totalPaginas;
    }
    
    this.actualizarUsuariosPaginados();
  }

  actualizarUsuariosPaginados(): void {
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    const fin = inicio + this.registrosPorPagina;
    this.usuariosPaginados = this.usuariosFiltrados.slice(inicio, fin);
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      this.actualizarUsuariosPaginados();
    }
  }

  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.actualizarUsuariosPaginados();
    }
  }

  paginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.actualizarUsuariosPaginados();
    }
  }

  obtenerPaginas(): number[] {
    const paginas: number[] = [];
    const maxPaginasVisibles = 5;
    
    let inicio = Math.max(1, this.paginaActual - Math.floor(maxPaginasVisibles / 2));
    let fin = Math.min(this.totalPaginas, inicio + maxPaginasVisibles - 1);
    
    // Ajustar inicio si estamos cerca del final
    if (fin - inicio < maxPaginasVisibles - 1) {
      inicio = Math.max(1, fin - maxPaginasVisibles + 1);
    }
    
    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }
    
    return paginas;
  }

  get indiceInicio(): number {
    return (this.paginaActual - 1) * this.registrosPorPagina + 1;
  }

  get indiceFin(): number {
    return Math.min(this.paginaActual * this.registrosPorPagina, this.usuariosFiltrados.length);
  }

  // ==================== MODAL ====================

  abrirModalNuevo(): void {
    this.usuarioSeleccionado = null;
    this.isModalOpen = true;
  }

  abrirModalEditar(usuario: Usuario): void {
    this.usuarioSeleccionado = { ...usuario };
    this.isModalOpen = true;
  }

  cerrarModal(): void {
    this.isModalOpen = false;
    this.usuarioSeleccionado = null;
  }

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

  // ==================== UTILIDADES ====================

  obtenerNombreCompleto(usuario: Usuario): string {
    let nombreCompleto = `${usuario.nombreUs} ${usuario.apellidoUs}`;
    if (usuario.apellido2Us) {
      nombreCompleto += ` ${usuario.apellido2Us}`;
    }
    return nombreCompleto;
  }

  formatearTelefono(telefono: number): string {
    const telefonoStr = telefono.toString();
    return `${telefonoStr.substring(0, 3)}-${telefonoStr.substring(3, 6)}-${telefonoStr.substring(6)}`;
  }

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

  private mostrarError(mensaje: string): void {
    this.error = mensaje;
    alert('❌ ' + mensaje);
  }

  private mostrarExito(mensaje: string): void {
    alert('✅ ' + mensaje);
  }
}
