
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MoleculasService, Molecula } from '../../../../services/moleculasService';
import { MoleculaModalComponent } from '../../../modals/moleculas-modal/moleculas-modal';

@Component({
  selector: 'app-moleculas',
  standalone: true,
  imports: [CommonModule, RouterModule, MoleculaModalComponent],
  templateUrl: './moleculas.html',
  styleUrls: ['./moleculas.css']
})
export class MoleculasComponent implements OnInit {
  moleculas: Molecula[] = [];
  cargando: boolean = false;
  error: string = '';
  
  // Estados del modal
  isModalOpen: boolean = false;
  moleculaSeleccionada: Molecula | null = null;
  
  // Estado de operaciones
  guardando: boolean = false;

  constructor(private moleculasService: MoleculasService) {}

  ngOnInit(): void {
    this.cargarMoleculas();
  }

  cargarMoleculas(): void {
    this.cargando = true;
    this.error = '';
    
    this.moleculasService.obtenerTodos().subscribe({
      next: (response) => {
        if (response.success) {
          this.moleculas = response.data;
          console.log('Moléculas cargadas:', this.moleculas);
        } else {
          this.mostrarError(response.message);
        }
        this.cargando = false;
      },
      error: (err) => {
        this.mostrarError('Error al cargar las moléculas. Verifique que el servidor esté funcionando.');
        console.error('Error:', err);
        this.cargando = false;
      }
    });
  }

  // Abrir modal para crear nueva molécula
  abrirModalNuevo(): void {
    this.moleculaSeleccionada = null;
    this.isModalOpen = true;
  }

  // Abrir modal para editar molécula existente
  abrirModalEditar(molecula: Molecula): void {
    this.moleculaSeleccionada = { ...molecula };
    this.isModalOpen = true;
  }

  // Cerrar modal
  cerrarModal(): void {
    this.isModalOpen = false;
    this.moleculaSeleccionada = null;
  }

  // Guardar molécula (crear o actualizar)
  guardarMolecula(moleculaData: Partial<Molecula>): void {
    this.guardando = true;

    if (this.moleculaSeleccionada && this.moleculaSeleccionada.nombreMol) {
      // Actualizar molécula existente
      // Solo se puede actualizar la descripción
      this.moleculasService.actualizar(this.moleculaSeleccionada.nombreMol, {
        descripcionMol: moleculaData.descripcionMol
      }).subscribe({
        next: (response) => {
          if (response.success) {
            this.mostrarExito('Molécula actualizada correctamente');
            this.cerrarModal();
            this.cargarMoleculas();
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
      // Crear nueva molécula
      // Convertir nombre a mayúsculas
      const moleculaACrear: Molecula = {
        nombreMol: moleculaData.nombreMol?.toUpperCase() || '',
        descripcionMol: moleculaData.descripcionMol || ''
      };

      this.moleculasService.crear(moleculaACrear).subscribe({
        next: (response) => {
          if (response.success) {
            this.mostrarExito('Molécula creada correctamente');
            this.cerrarModal();
            this.cargarMoleculas();
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

  // Eliminar molécula
  eliminarMolecula(nombreMol: string): void {
    const confirmar = confirm(
      `¿Está seguro de que desea eliminar la molécula "${nombreMol}"?\n\nEsta acción no se puede deshacer.`
    );
    
    if (!confirmar) {
      return;
    }

    this.moleculasService.eliminar(nombreMol).subscribe({
      next: (response) => {
        if (response.success) {
          this.mostrarExito('Molécula eliminada correctamente');
          this.cargarMoleculas();
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
    
    let mensajeError = `Error al ${operacion} la molécula.`;
    
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
