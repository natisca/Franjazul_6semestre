
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormulariosService, Formulario } from '../../../../services/formulariosService'; 
import { FormularioModalComponent } from '../../../modals/formularios-modal/formularios-modal';

@Component({
  selector: 'app-formularios',
  standalone: true,
  imports: [CommonModule, RouterModule, FormularioModalComponent],
  templateUrl: './formularios.html',
  styleUrls: ['./formularios.css']
})
export class Formularios implements OnInit {
  formularios: Formulario[] = [];
  cargando: boolean = false;
  error: string = '';
  
  // Estados del modal
  isModalOpen: boolean = false;
  formularioSeleccionado: Formulario | null = null;
  
  // Estado de operaciones
  guardando: boolean = false;

  constructor(private formulariosService: FormulariosService) {}

  ngOnInit(): void {
    this.cargarFormularios();
  }

  cargarFormularios(): void {
    this.cargando = true;
    this.error = '';
    
    this.formulariosService.obtenerTodos().subscribe({
      next: (response) => {
        if (response.success) {
          this.formularios = response.data;
          console.log('Formularios cargados:', this.formularios);
        } else {
          this.mostrarError(response.message);
        }
        this.cargando = false;
      },
      error: (err) => {
        this.mostrarError('Error al cargar los formularios. Verifique que el servidor esté funcionando.');
        console.error('Error:', err);
        this.cargando = false;
      }
    });
  }

  // Abrir modal para crear nuevo formulario
  abrirModalNuevo(): void {
    this.formularioSeleccionado = null;
    this.isModalOpen = true;
  }

  // Abrir modal para editar formulario existente
  abrirModalEditar(formulario: Formulario): void {
    this.formularioSeleccionado = { ...formulario };
    this.isModalOpen = true;
  }

  // Cerrar modal
  cerrarModal(): void {
    this.isModalOpen = false;
    this.formularioSeleccionado = null;
  }

  // Guardar formulario (crear o actualizar)
  guardarFormulario(formularioData: Partial<Formulario>): void {
    this.guardando = true;

    if (this.formularioSeleccionado && this.formularioSeleccionado.idForm) {
      // Actualizar formulario existente
      this.formulariosService.actualizar(this.formularioSeleccionado.idForm, formularioData).subscribe({
        next: (response) => {
          if (response.success) {
            this.mostrarExito('Formulario actualizado correctamente');
            this.cerrarModal();
            this.cargarFormularios();
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
      // Crear nuevo formulario
      this.formulariosService.crear(formularioData).subscribe({
        next: (response) => {
          if (response.success) {
            this.mostrarExito('Formulario creado correctamente');
            this.cerrarModal();
            this.cargarFormularios();
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

  // Eliminar formulario
  eliminarFormulario(id: number): void {
    const confirmar = confirm('¿Está seguro de que desea eliminar este formulario?\n\nEsta acción no se puede deshacer.');
    
    if (!confirmar) {
      return;
    }

    this.formulariosService.eliminar(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.mostrarExito('Formulario eliminado correctamente');
          this.cargarFormularios();
        } else {
          this.mostrarError(response.message);
        }
      },
      error: (err) => {
        this.manejarErrorOperacion(err, 'eliminar');
      }
    });
  }

  // Obtener badge según tipo
  obtenerBadgeTipo(esPadre: number): string {
    return esPadre === 1 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-blue-100 text-blue-800 dark:bg-green-900 dark:text-green-200';
  }

  // Obtener texto del tipo
  obtenerTextoTipo(esPadre: number): string {
    return esPadre === 1 ? 'Menú Padre' : 'Submenú';
  }

  // Manejo de errores de operaciones
  private manejarErrorOperacion(err: any, operacion: string): void {
    console.error(`Error al ${operacion}:`, err);
    
    let mensajeError = `Error al ${operacion} el formulario.`;
    
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
