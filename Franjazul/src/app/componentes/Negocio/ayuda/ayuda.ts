
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

interface PreguntaFrecuente {
  id: number;
  categoria: string;
  pregunta: string;
  respuesta: string;
  abierta: boolean;
}

@Component({
  selector: 'app-ayuda',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ayuda.html',
  styleUrls: ['./ayuda.css']
})
export class AyudaComponent {
  categoriaActiva: string = 'todos';

  preguntasFrecuentes: PreguntaFrecuente[] = [
    
    {
      id: 1,
      categoria: 'primeros-pasos',
      pregunta: '¿Cómo puedo registrarme en la plataforma?',
      respuesta: 'Para registrarte, haz clic en el botón "Registrarse" en la página principal. Completa el formulario con tus datos personales: nombre, apellidos, email, teléfono y contraseña. Una vez registrado, recibirás acceso inmediato al sistema para solicitar servicios de control de plagas.',
      abierta: false
    },
    {
      id: 2,
      categoria: 'primeros-pasos',
      pregunta: '¿Qué servicios ofrece La Alianza Franjazul?',
      respuesta: 'Ofrecemos Manejo Integral de Plagas con servicios que incluyen: Diagnóstico Técnico Personalizado, Programas Preventivos y Correctivos, Reportes Digitales para Auditorías, uso de Productos Certificados y Ecológicos con Sello Verde, y Acompañamiento Profesional Permanente. Atendemos sectores como industria farmacéutica, alimentaria, hotelería y comercio.',
      abierta: false
    },
    {
      id: 3,
      categoria: 'primeros-pasos',
      pregunta: '¿Cómo solicito una cita para control de plagas?',
      respuesta: 'Después de iniciar sesión, dirígete a la sección "Solicitar Servicio". Selecciona el o los servicios que necesitas (anti ratas, fumigación, control de insectos, etc.), elige la fecha y horario disponible, proporciona la dirección completa del lugar, y confirma tu solicitud. Recibirás una notificación con los detalles de tu cita.',
      abierta: false
    },
    {
      id: 4,
      categoria: 'primeros-pasos',
      pregunta: '¿La Alianza Franjazul cuenta con certificaciones?',
      respuesta: 'Sí, contamos con el Sello Verde de la Alcaldía de Medellín que certifica nuestro compromiso ambiental y uso de métodos seguros. También tenemos Concepto Sanitario Favorable Nº 10014011875 de la Secretaría de Salud y calificación favorable en nuestro Sistema de Seguridad y Salud en el Trabajo (SG-SST). Nuestros técnicos están certificados como controladores de plagas a nivel urbano.',
      abierta: false
    },

    // CONFIGURACIÓN
    {
      id: 5,
      categoria: 'configuracion',
      pregunta: '¿Cómo cambio mi contraseña?',
      respuesta: 'Para cambiar tu contraseña, inicia sesión y dirígete a tu perfil de usuario haciendo clic en tu nombre en la esquina superior derecha. Selecciona "Cambiar Contraseña", ingresa tu contraseña actual y luego tu nueva contraseña dos veces para confirmarla. Haz clic en "Guardar Cambios".',
      abierta: false
    },
    {
      id: 6,
      categoria: 'configuracion',
      pregunta: '¿Olvidé mi contraseña, qué hago?',
      respuesta: 'En la página de inicio de sesión, haz clic en "¿Olvidaste tu contraseña?". Ingresa tu correo electrónico registrado y recibirás un enlace para restablecer tu contraseña. Sigue las instrucciones del correo para crear una nueva contraseña segura.',
      abierta: false
    },

    // NOTIFICACIONES
    {
      id: 7,
      categoria: 'notificaciones',
      pregunta: '¿Cómo sé que mi cita fue confirmada?',
      respuesta: 'Recibirás una notificación por correo electrónico confirmando tu cita con todos los detalles: fecha, hora, técnico asignado, servicios solicitados y dirección. También podrás ver el estado de tu cita en la sección "Mis Citas" dentro de la plataforma.',
      abierta: false
    },

    // SERVICIOS
    {
      id: 8,
      categoria: 'servicios',
      pregunta: '¿Qué tipo de plagas controlan?',
      respuesta: 'Controlamos todo tipo de plagas urbanas incluyendo: roedores (ratas, ratones), insectos rastreros (cucarachas, hormigas), insectos voladores (moscas, mosquitos), termitas, pulgas, garrapatas, y otras plagas específicas según el sector. Cada tratamiento es personalizado según la plaga y el ambiente.',
      abierta: false
   },
    {
      id: 9,
      categoria: 'servicios',
      pregunta: '¿Los productos que usan son seguros?',
      respuesta: 'Absolutamente. Utilizamos únicamente productos químicos certificados de uso en salud pública, con Sello Verde de la Alcaldía de Medellín. Son productos de alta calidad, efectivos contra plagas pero seguros para personas, mascotas y el medio ambiente cuando se aplican correctamente por nuestros técnicos certificados.',
      abierta: false
    },
    {
      id: 10,
      categoria: 'servicios',
      pregunta: '¿Cuánto tiempo dura un servicio de fumigación?',
      respuesta: 'La duración del servicio depende del tamaño del área a tratar y el tipo de plaga. Generalmente, un servicio residencial toma entre 1-2 horas, mientras que instalaciones comerciales o industriales pueden requerir más tiempo. El técnico te informará el tiempo estimado al iniciar el servicio.',
      abierta: false
    },
    {
      id: 11,
      categoria: 'servicios',
      pregunta: '¿Necesito prepararme antes del servicio?',
      respuesta: 'Sí, el técnico te proporcionará recomendaciones específicas según el servicio: cubrir o retirar alimentos, despejar áreas de aplicación, asegurar que haya acceso a todas las zonas, y en algunos casos evacuar el área temporalmente. Recibirás estas indicaciones al confirmar tu cita.',
      abierta: false
    },
    {
      id: 12,
      categoria: 'servicios',
      pregunta: '¿Ofrecen servicios de emergencia?',
      respuesta: 'Sí, ofrecemos servicio inmediato y oportuno en el horario que el cliente necesite. Para emergencias, contáctanos directamente al 323 705 06 75 o solicita servicio urgente a través de la plataforma especificando que se trata de una emergencia.',
      abierta: false
    },
    {
      id: 13,
      categoria: 'servicios',
      pregunta: '¿Puedo cancelar o reagendar una cita?',
      respuesta: 'Sí, puedes cancelar o reagendar tu cita. Te recomendamos hacerlo con al menos 24 horas de anticipación. Contacta directamente a nuestro servicio al cliente.',
      abierta: false
    },
    {
      id: 14,
      categoria: 'pagos',
      pregunta: '¿No veo el valor de los servicios, cuanto cuestan?',
      respuesta: 'Nuestros precios comienzan desde 80.000 COP, puede incrementar mas dependiendo del tamaño del lugar o los productos requeridos en el servicio.',
      abierta: false
    },
    {
      id: 15,
      categoria: 'pagos',
      pregunta: '¿No encuentro los metodos de pago?',
      respuesta: 'Por el momento no contamos con pasarela de pago, nuestros tecnicos te indicaran ',
      abierta: false
    }
  ];

  get preguntasFiltradas(): PreguntaFrecuente[] {
    if (this.categoriaActiva === 'todos') {
      return this.preguntasFrecuentes;
    }
    return this.preguntasFrecuentes.filter(p => p.categoria === this.categoriaActiva);
  }

  togglePregunta(id: number): void {
    const pregunta = this.preguntasFrecuentes.find(p => p.id === id);
    if (pregunta) {
      pregunta.abierta = !pregunta.abierta;
    }
  }

  filtrarPorCategoria(categoria: string): void {
    this.categoriaActiva = categoria;
    // Cerrar todas las preguntas al cambiar de categoría
    this.preguntasFrecuentes.forEach(p => p.abierta = false);
  }

  get totalPorCategoria() {
    return {
      todos: this.preguntasFrecuentes.length,
      'primeros-pasos': this.preguntasFrecuentes.filter(p => p.categoria === 'primeros-pasos').length,
      'configuracion': this.preguntasFrecuentes.filter(p => p.categoria === 'configuracion').length,
      'notificaciones': this.preguntasFrecuentes.filter(p => p.categoria === 'notificaciones').length,
      'servicios': this.preguntasFrecuentes.filter(p => p.categoria === 'servicios').length,
      'pagos': this.preguntasFrecuentes.filter(p => p.categoria === 'pagos').length
    };
  }
}
