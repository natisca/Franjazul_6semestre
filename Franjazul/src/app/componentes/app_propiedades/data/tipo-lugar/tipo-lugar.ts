
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TipoLugarService, TipoLugar } from '../../../../services/tipoLugarService'; 
import { TipoLugarModalComponent } from '../../../modals/tipos-lugares-modal/tipos-lugares-modal'; 

@Component({
  selector: 'app-tipo-lugar',
  standalone: true,
  imports: [CommonModule, RouterModule, TipoLugarModalComponent],
  templateUrl: './tipo-lugar.html',
  styleUrls: ['./tipo-lugar.css']
})
export class TipoLugarComponent implements OnInit {
  tiposLugar: TipoLugar[] = [];
  cargando: boolean = false;
  error: string = '';
  
  // Estados del modal
  isModalOpen: boolean = false;
  tipoLugarSeleccionado: TipoLugar | null = null;
  
  // Estado de operaciones
  guardando: boolean = false;

  constructor(private tipoLugarService: TipoLugarService) {}

  ngOnInit(): void {
    this.cargarTiposLugar();
  }

  cargarTiposLugar(): void {
    this.cargando = true;
    this.error = '';
    
    this.tipoLugarService.obtenerTodos().subscribe({
      next: (response) => {
        if (response.success) {
          this.tiposLugar = response.data;
          console.log('Tipos de lugar cargados:', this.tiposLugar);
        } else {
          this.mostrarError(response.message);
        }
        this.cargando = false;
      },
      error: (err) => {
        this.mostrarError('Error al cargar los tipos de lugar. Verifique que el servidor esté funcionando.');
        console.error('Error:', err);
        this.cargando = false;
      }
    });
  }

  // Abrir modal para crear nuevo tipo de lugar
  abrirModalNuevo(): void {
    this.tipoLugarSeleccionado = null;
    this.isModalOpen = true;
  }

  // Abrir modal para editar tipo de lugar existente
  abrirModalEditar(tipoLugar: TipoLugar): void {
    this.tipoLugarSeleccionado = { ...tipoLugar };
    this.isModalOpen = true;
  }

  // Cerrar modal
  cerrarModal(): void {
    this.isModalOpen = false;
    this.tipoLugarSeleccionado = null;
  }

  // Guardar tipo de lugar (crear o actualizar)
  guardarTipoLugar(tipoLugarData: Partial<TipoLugar>): void {
    this.guardando = true;

    if (this.tipoLugarSeleccionado && this.tipoLugarSeleccionado.idTl) {
      // Actualizar tipo de lugar existente
      this.tipoLugarService.actualizar(this.tipoLugarSeleccionado.idTl, tipoLugarData).subscribe({
        next: (response) => {
          if (response.success) {
            this.mostrarExito('Tipo de lugar actualizado correctamente');
            this.cerrarModal();
            this.cargarTiposLugar();
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
      // Crear nuevo tipo de lugar
      this.tipoLugarService.crear(tipoLugarData).subscribe({
        next: (response) => {
          if (response.success) {
            this.mostrarExito('Tipo de lugar creado correctamente');
            this.cerrarModal();
            this.cargarTiposLugar();
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

  // Eliminar tipo de lugar
  eliminarTipoLugar(id: number, nombre: string): void {
    const confirmar = confirm(
      `¿Está seguro de que desea eliminar el tipo de lugar "${nombre}"?\n\nEsta acción no se puede deshacer.`
    );
    
    if (!confirmar) {
      return;
    }

    this.tipoLugarService.eliminar(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.mostrarExito('Tipo de lugar eliminado correctamente');
          this.cargarTiposLugar();
        } else {
          this.mostrarError(response.message);
        }
      },
      error: (err) => {
        this.manejarErrorOperacion(err, 'eliminar');
      }
    });
  }

  // Manejo de errores de operaciones
  private manejarErrorOperacion(err: any, operacion: string): void {
    console.error(`Error al ${operacion}:`, err);
    
    let mensajeError = `Error al ${operacion} el tipo de lugar.`;
    
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
