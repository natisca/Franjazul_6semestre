
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormulariosService, Formulario } from '../../../services/formulariosService';

@Component({
  selector: 'app-formulario-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formularios-modal.html',
  styleUrls: ['./formularios-modal.css']
})
export class FormularioModalComponent implements OnInit, OnChanges {
  @Input() formulario: Formulario | null = null;
  @Input() isOpen: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveFormulario = new EventEmitter<Partial<Formulario>>();

  formularioForm: FormGroup;
  isEditMode: boolean = false;
  formulariosPadre: Formulario[] = [];
  cargandoPadres: boolean = false;

  constructor(
    private fb: FormBuilder,
    private formulariosService: FormulariosService
  ) {
    this.formularioForm = this.fb.group({
      tituloForm: ['', [Validators.required, Validators.maxLength(100)]],
      urlForm: ['', [Validators.required, Validators.maxLength(100)]],
      esPadre: [0, [Validators.required]],
      orden: [1, [Validators.required, Validators.min(1)]],
      idFormPadre: [null]
    });

    // ✅ Mover el valueChanges al constructor para que siempre esté activo
    this.formularioForm.get('esPadre')?.valueChanges.subscribe(value => {
      const idFormPadreControl = this.formularioForm.get('idFormPadre');
      if (value === 1) {
        // Es padre, no necesita padre
        idFormPadreControl?.setValue(null);
        idFormPadreControl?.disable();
      } else {
        // Es hijo, puede tener padre
        idFormPadreControl?.enable();
      }
    });
  }

  // ✅ Se mantiene ngOnInit para cargar datos de selects
  ngOnInit(): void {
    this.cargarFormulariosPadre();
  }

  // ✅ AGREGADO: Detectar cambios en los inputs
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formulario'] || changes['isOpen']) {
      this.actualizarFormulario();
    }
  }

  // ✅ NUEVO: Método para actualizar el formulario según el modo
  private actualizarFormulario(): void {
    if (this.formulario && this.isOpen) {
      // Modo EDICIÓN
      this.isEditMode = true;
      this.formularioForm.patchValue({
        tituloForm: this.formulario.tituloForm,
        urlForm: this.formulario.urlForm,
        esPadre: this.formulario.esPadre,
        orden: this.formulario.orden,
        idFormPadre: this.formulario.formRecursivo?.idForm || null
      });
    } else if (this.isOpen) {
      // Modo CREACIÓN
      this.isEditMode = false;
      this.formularioForm.reset({
        tituloForm: '',
        urlForm: '',
        esPadre: 0,
        orden: 1,
        idFormPadre: null
      });
    }
  }

  cargarFormulariosPadre(): void {
    this.cargandoPadres = true;
    this.formulariosService.obtenerTodos().subscribe({
      next: (response) => {
        if (response.success) {
          // Filtrar solo los que son padre (esPadre = 1)
          this.formulariosPadre = response.data.filter(f => f.esPadre === 1);
          console.log('✅ Formularios padre cargados:', this.formulariosPadre.length);
        }
        this.cargandoPadres = false;
      },
      error: (error) => {
        console.error('❌ Error cargando formularios padre:', error);
        this.cargandoPadres = false;
      }
    });
  }

  onSubmit(): void {
    if (this.formularioForm.valid) {
      const formValue = this.formularioForm.getRawValue();
      const formularioData: Partial<Formulario> = {
        tituloForm: formValue.tituloForm?.trim(),
        urlForm: formValue.urlForm?.trim(),
        esPadre: formValue.esPadre,
        orden: formValue.orden,
        formRecursivo: formValue.idFormPadre ? { idForm: formValue.idFormPadre } : null
      };
      this.saveFormulario.emit(formularioData);
    }
  }

  onClose(): void {
    this.formularioForm.reset({
      tituloForm: '',
      urlForm: '',
      esPadre: 0,
      orden: 1,
      idFormPadre: null
    });
    this.closeModal.emit();
  }

  get tituloForm() {
    return this.formularioForm.get('tituloForm');
  }

  get urlForm() {
    return this.formularioForm.get('urlForm');
  }

  get esPadre() {
    return this.formularioForm.get('esPadre');
  }

  get orden() {
    return this.formularioForm.get('orden');
  }

  get idFormPadre() {
    return this.formularioForm.get('idFormPadre');
  }
}
