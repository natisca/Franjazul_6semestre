import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/authService';
import { ServiciosService, Servicio } from '../../../services/serviciosService';
import { TipoLugarService, TipoLugar } from '../../../services/tipoLugarService';
import { CitasService } from '../../../services/citasService';

@Component({
  selector: 'app-service-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './service-form.html',
  styleUrls: ['./service-form.css']
})
export class ServiceForm implements OnInit {
  @Output() close = new EventEmitter<void>();

  solicitudForm: FormGroup;
  serviciosDisponibles: Servicio[] = [];
  serviciosSeleccionados: Servicio[] = [];
  tiposLugar: TipoLugar[] = [];
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  horariosDisponibles: { inicio: string, fin: string, label: string }[] = [
    { inicio: '08:00', fin: '10:00', label: '8:00 AM - 10:00 AM' },
    { inicio: '10:00', fin: '12:00', label: '10:00 AM - 12:00 PM' },
    { inicio: '12:00', fin: '14:00', label: '12:00 PM - 2:00 PM' },
    { inicio: '14:00', fin: '16:00', label: '2:00 PM - 4:00 PM' },
    { inicio: '16:00', fin: '18:00', label: '4:00 PM - 6:00 PM' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private serviciosService: ServiciosService,
    private tipoLugarService: TipoLugarService,
    private citasService: CitasService
  ) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    this.solicitudForm = this.fb.group({
      servicioSeleccionado: [null],
      fecha: ['', Validators.required],
      horario: ['', Validators.required],
      nombreLugar: ['', [Validators.required, Validators.maxLength(100)]],
      direccionLugar: ['', [Validators.required, Validators.maxLength(200)]],
      idTipoLugar: [null, Validators.required]
    });

    this.solicitudForm.get('fecha')?.valueChanges.subscribe(() => {
      this.solicitudForm.get('horario')?.setValue('');
    });
  }

  ngOnInit(): void {
    this.cargarServicios();
    this.cargarTiposLugar();
  }

  cargarServicios(): void {
    this.serviciosService.obtenerTodos().subscribe({
      next: (response) => {
        if (response.success) {
          this.serviciosDisponibles = response.data;
        }
      },
      error: (error) => {
        console.error('Error cargando servicios:', error);
      }
    });
  }

  cargarTiposLugar(): void {
    this.tipoLugarService.obtenerTodos().subscribe({
      next: (response) => {
        if (response.success) {
          this.tiposLugar = response.data;
        }
      },
      error: (error) => {
        console.error('Error cargando tipos de lugar:', error);
      }
    });
  }

  agregarServicio(): void {
    const servicioId = this.solicitudForm.get('servicioSeleccionado')?.value;
    if (!servicioId) return;

    const servicio = this.serviciosDisponibles.find(s => s.idServicio === parseInt(servicioId));
    if (servicio && !this.serviciosSeleccionados.find(s => s.idServicio === servicio.idServicio)) {
      this.serviciosSeleccionados.push(servicio);
      this.solicitudForm.get('servicioSeleccionado')?.setValue(null);
    }
  }

  quitarServicio(idServicio: number): void {
    this.serviciosSeleccionados = this.serviciosSeleccionados.filter(s => s.idServicio !== idServicio);
  }

  get minDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  onSubmit(): void {
    if (this.solicitudForm.invalid || this.serviciosSeleccionados.length === 0) {
      alert('Debes seleccionar al menos un servicio y completar todos los campos');
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
      this.errorMessage = 'No se encontró información del usuario';
      this.loading = false;
      return;
    }

    const formValue = this.solicitudForm.value;
    const fechaSeleccionada = formValue.fecha;
    const horario = this.horariosDisponibles.find(h => h.inicio === formValue.horario);

    if (!horario) {
      this.errorMessage = 'Horario inválido';
      this.loading = false;
      return;
    }

    const fechaInicio = `${fechaSeleccionada}T${horario.inicio}:00`;
    const fechaFin = `${fechaSeleccionada}T${horario.fin}:00`;

    const solicitud = {
      idUsuarioCliente: currentUser.idUsuario,
      serviciosIds: this.serviciosSeleccionados.map(s => s.idServicio),
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
      nombreLugar: formValue.nombreLugar,
      direccionLugar: formValue.direccionLugar,
      idTipoLugar: parseInt(formValue.idTipoLugar)
    };

    console.log('Enviando solicitud:', solicitud);

    this.citasService.solicitarCita(solicitud).subscribe({
      next: (response) => {
        console.log('✅ Cita creada:', response);
        this.loading = false;
        this.successMessage = 'Cita solicitada exitosamente';
        
        setTimeout(() => {
          this.cerrarModal();
        }, 2000);
      },
      error: (error) => {
        console.error('❌ Error al solicitar cita:', error);
        this.loading = false;
        this.errorMessage = error.error?.message || 'Error al solicitar la cita';
      }
    });
  }

  cerrarModal(): void {
    this.close.emit();
  }
}
