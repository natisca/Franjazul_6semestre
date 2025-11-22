import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Lugar } from '../../../services/lugaresService';
import { TipoLugarService, TipoLugar } from '../../../services/tipoLugarService'; 

@Component({
  selector: 'app-lugar-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lugares-modal.html',
  styleUrls: ['./lugares-modal.css']
})
export class LugarModalComponent implements OnInit, OnChanges {
  @Input() lugar: Lugar | null = null;
  @Input() lugares: Lugar[] = []; // Para el select de lugar padre
  @Input() isOpen: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveLugar = new EventEmitter<Partial<Lugar>>();

  lugarForm: FormGroup;
  isEditMode: boolean = false;
  tiposLugar: TipoLugar[] = [];
  cargandoTiposLugar: boolean = false;

  constructor(
    private fb: FormBuilder,
    private tipoLugarService: TipoLugarService
  ) {
    this.lugarForm = this.fb.group({
      nombreLugar: ['', [Validators.required, Validators.maxLength(100)]],
      direccionLugar: ['', [Validators.required, Validators.maxLength(200)]],
      idTipoLugar: [null, [Validators.required]],
      idLugarPadre: [null]
    });
  }

  // Se mantiene ngOnInit para cargar datos de selects
  ngOnInit(): void {
    this.cargarTiposLugar();
  }

  // Detectar cambios en los inputs
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lugar'] || changes['isOpen']) {
      this.actualizarFormulario();
    }
  }

  //Método para actualizar el formulario según el modo
  private actualizarFormulario(): void {
    if (this.lugar && this.isOpen) {
      // Modo EDICIÓN
      this.isEditMode = true;
      this.lugarForm.patchValue({
        nombreLugar: this.lugar.nombreLugar,
        direccionLugar: this.lugar.direccionLugar,
        idTipoLugar: this.lugar.tipoLugar?.idTl || null,
        idLugarPadre: this.lugar.lugarPadre?.idLugar || null
      });
    } else if (this.isOpen) {
      // Modo CREACIÓN
      this.isEditMode = false;
      this.lugarForm.reset({
        nombreLugar: '',
        direccionLugar: '',
        idTipoLugar: null,
        idLugarPadre: null
      });
    }
  }

  cargarTiposLugar(): void {
    this.cargandoTiposLugar = true;
    this.tipoLugarService.obtenerTodos().subscribe({
      next: (response) => {
        if (response.success) {
          this.tiposLugar = response.data;
          console.log('✅ Tipos de lugar cargados:', this.tiposLugar.length);
        }
        this.cargandoTiposLugar = false;
      },
      error: (error) => {
        console.error('❌ Error cargando tipos de lugar:', error);
        this.cargandoTiposLugar = false;
      }
    });
  }

  get lugaresFiltrados(): Lugar[] {
    // Excluir el lugar actual del select padre (para evitar autorreferencia)
    if (this.isEditMode && this.lugar) {
      return this.lugares.filter(l => l.idLugar !== this.lugar!.idLugar);
    }
    return this.lugares;
  }

  onSubmit(): void {
    if (this.lugarForm.valid) {
      const formValue = this.lugarForm.value;
      
      const lugarData: Partial<Lugar> = {
        nombreLugar: formValue.nombreLugar?.trim(),
        direccionLugar: formValue.direccionLugar?.trim(),
        tipoLugar: {
          idTl: formValue.idTipoLugar
        },
        lugarPadre: formValue.idLugarPadre ? {
          idLugar: formValue.idLugarPadre
        } : null
      };
      
      this.saveLugar.emit(lugarData);
    }
  }

  onClose(): void {
    this.lugarForm.reset({
      nombreLugar: '',
      direccionLugar: '',
      idTipoLugar: null,
      idLugarPadre: null
    });
    this.closeModal.emit();
  }

  get nombreLugar() { 
    return this.lugarForm.get('nombreLugar'); 
  }
  
  get direccionLugar() { 
    return this.lugarForm.get('direccionLugar'); 
  }
  
  get idTipoLugar() { 
    return this.lugarForm.get('idTipoLugar'); 
  }
  
  get idLugarPadre() { 
    return this.lugarForm.get('idLugarPadre'); 
  }
}