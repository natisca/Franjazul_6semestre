import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CertificadosService } from '../../../services/certificadosService';
import { AuthService } from '../../../services/authService';

@Component({
  selector: 'app-certificado-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './certificado-form.html',
  styleUrls: ['./certificado-form.css']
})
export class CertificadoModalComponent {
  
  @Output() closeModal = new EventEmitter<void>();

  certificadoForm: FormGroup;
  generando: boolean = false;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private certificadosService: CertificadosService,
    private authService: AuthService
  ) {
    this.certificadoForm = this.fb.group({
      tipoDocumento: ['CC', Validators.required],
      cedula: ['', Validators.required],
      nit: [''],
      nombreEmpresa: [''],
      rut: [''],
      cedulaSolicitante: ['']
    });

    this.certificadoForm.get('tipoDocumento')?.valueChanges.subscribe(tipo => {
      this.actualizarValidaciones(tipo);
    });
  }

  actualizarValidaciones(tipo: string): void {
    const cedulaControl = this.certificadoForm.get('cedula');
    const nitControl = this.certificadoForm.get('nit');
    const nombreEmpresaControl = this.certificadoForm.get('nombreEmpresa');
    const rutControl = this.certificadoForm.get('rut');
    const cedulaSolicitanteControl = this.certificadoForm.get('cedulaSolicitante');

    if (tipo === 'CC') {
      cedulaControl?.setValidators([Validators.required]);
      nitControl?.clearValidators();
      nombreEmpresaControl?.clearValidators();
      rutControl?.clearValidators();
      cedulaSolicitanteControl?.clearValidators();
    } else {
      cedulaControl?.clearValidators();
      nitControl?.setValidators([Validators.required]);
      nombreEmpresaControl?.setValidators([Validators.required]);
      rutControl?.setValidators([Validators.required]);
      cedulaSolicitanteControl?.setValidators([Validators.required]);
    }

    cedulaControl?.updateValueAndValidity();
    nitControl?.updateValueAndValidity();
    nombreEmpresaControl?.updateValueAndValidity();
    rutControl?.updateValueAndValidity();
    cedulaSolicitanteControl?.updateValueAndValidity();
  }

  cerrar(): void {
    this.certificadoForm.reset({ tipoDocumento: 'CC' });
    this.error = '';
    this.closeModal.emit();
  }

  async generarCertificado(): Promise<void> {
    if (this.certificadoForm.invalid) {
      this.error = 'Por favor completa todos los campos requeridos';
      return;
    }

    this.generando = true;
    this.error = '';

    try {
      const usuario = this.authService.currentUserValue;
      
      if (!usuario || !usuario.idUsuario) {
        this.error = 'Debes iniciar sesión para generar el certificado';
        this.generando = false;
        return;
      }

      const userId = usuario.idUsuario;
      const solicitud = this.certificadoForm.value;

      // Validar en frontend antes de enviar
      if (solicitud.tipoDocumento === 'CC' && solicitud.cedula !== userId) {
        this.error = 'La cédula debe coincidir con tu usuario autenticado';
        this.generando = false;
        return;
      }

      if (solicitud.tipoDocumento === 'NIT' && solicitud.cedulaSolicitante !== userId) {
        this.error = 'La cédula del solicitante debe coincidir con tu usuario autenticado';
        this.generando = false;
        return;
      }


      this.certificadosService.generar(solicitud).subscribe({
        next: (blob: Blob) => {
          // Descargar el PDF
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'certificado_franjazul.pdf';
          link.click();
          window.URL.revokeObjectURL(url);

          alert('✅ Certificado generado correctamente');
          this.cerrar();
          this.generando = false;
        },
        error: (err: any) => {
          console.error('Error al generar certificado:', err);
          this.error = err.error?.message || 'Error al generar el certificado. Inténtalo de nuevo.';
          this.generando = false;
        }
      });

    } catch (err: any) {
      console.error('Error inesperado:', err);
      this.error = 'Error inesperado al procesar la solicitud';
      this.generando = false;
    }
  }
}