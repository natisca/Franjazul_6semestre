import { RouterModule, Routes } from '@angular/router';

//importes de los layouts

import { LayoutPublico } from './layouts/layout-publico/layout-publico';
import { LayoutInterno } from './layouts/layout-interno/layout-interno';

//importes del layout publico

import { home } from './componentes/Negocio/home/home';

//importes del layout interno

import { Dashboard } from './componentes/Negocio/dashboard/dashboard';
import { Login } from './componentes/autenticacion/login/login';
import { Tablas } from './componentes/Negocio/tablas/tablas';
import { Usuarios } from './componentes/app_propiedades/data/usuarios/usuarios';
import { Permisos } from './componentes/app_propiedades/data/permisos/permisos';
import { Roles } from './componentes/app_propiedades/data/roles/roles';
import { Perfiles } from './componentes/app_propiedades/data/perfiles/perfiles';
import { Cargos } from './componentes/app_propiedades/data/cargos/cargos';
import { Formularios } from './componentes/app_propiedades/data/formularios/formularios';
import { Reportes } from './componentes/Negocio/reportes/reportes';
import { Appointments } from './componentes/Negocio/appointments/appointments';
import { AppointmentManagement } from './componentes/Negocio/appointment-management/appointment-management';
import { Profile } from './componentes/Negocio/profile/profile';
import { EstadoCitas } from './componentes/app_propiedades/data/estado-cita/estado-cita';
import { FranjasHorarias } from './componentes/app_propiedades/data/franjas/franjas';
import { LugaresComponent } from './componentes/app_propiedades/data/lugares/lugares';
import { TipoLugarComponent } from './componentes/app_propiedades/data/tipo-lugar/tipo-lugar';
import { MoleculasComponent } from './componentes/app_propiedades/data/moleculas/moleculas';
import { TipoServicioComponent } from './componentes/app_propiedades/data/tipo-servicios/tipo-servicios';
import { ServiciosComponent } from './componentes/app_propiedades/data/servicios/servicios';
import { CitasComponent } from './componentes/app_propiedades/data/citas/citas';
import { CitaServicioComponent } from './componentes/app_propiedades/data/cita-servicios/cita-servicios';
import { CertificadosComponent } from './componentes/app_propiedades/data/certificados/certificados';
import { authGuard } from './guards/authGuard';
import { roleGuard } from './guards/roleGuard';
import { publicGuard } from './guards/publicGuard';

export const routes: Routes = [

    //publico
    {
        path: '',
        component: LayoutPublico,
        children: [
            {
                path: '', component: home
            }
        ]
    },

    //login
    {
        path: 'login', component: Login, canActivate: [publicGuard]
    },

    //Interno/dashboard
    {
        path: '',
        component: LayoutInterno, canActivate: [authGuard],
        children: [
            {
                path: 'dashboard',
                component: Dashboard,
                canActivate: [roleGuard],
                data: { roles: ['TECNICO', 'ADMINISTRADOR'] }
            },
            {
                path: 'appointments',
                component: Appointments,
                canActivate: [roleGuard],
                data: { roles: ['TECNICO', 'ADMINISTRADOR'] }
            },
            {
                path: 'appointment/id',
                component: AppointmentManagement,
                canActivate: [roleGuard],
                data: { roles: ['TECNICO', 'ADMINISTRADOR'] }
            },
            {
                path: 'profile',
                component: Profile
            },
            {
                path: 'tablas',
                component: Tablas,
                canActivate: [roleGuard],
                data: { roles: ['ADMINISTRADOR'] }
            },
            {
                path: 'usuarios',
                component: Usuarios,
                canActivate: [roleGuard],
                data: { roles: ['ADMINISTRADOR'] }
            },
            {
                path: 'permisos',
                component: Permisos,
                canActivate: [roleGuard],
                data: { roles: ['ADMINISTRADOR'] }
            },
            {
                path: 'roles',
                component: Roles,
                canActivate: [roleGuard],
                data: { roles: ['ADMINISTRADOR'] }
            },
            {
                path: 'perfiles',
                component: Perfiles,
                canActivate: [roleGuard],
                data: { roles: ['ADMINISTRADOR'] }
            },
            {
                path: 'cargos',
                component: Cargos,
                canActivate: [roleGuard],
                data: { roles: ['ADMINISTRADOR'] }
            },
            {
                path: 'formularios',
                component: Formularios,
                canActivate: [roleGuard],
                data: { roles: ['ADMINISTRADOR'] }
            },
            {
                path: 'reportes',
                component: Reportes,
                canActivate: [roleGuard],
                data: { roles: ['ADMINISTRADOR'] }
            },
            {
                path: 'estado-cita',
                component: EstadoCitas,
                canActivate: [roleGuard],
                data: { roles: ['ADMINISTRADOR'] }
            },
            {
                path: 'franjas',
                component: FranjasHorarias,
                canActivate: [roleGuard],
                data: { roles: ['ADMINISTRADOR'] }
            },
            {
                path: 'lugares',
                component: LugaresComponent,
                canActivate: [roleGuard],
                data: { roles: ['ADMINISTRADOR'] }
            },
            {
                path: 'tipo-lugar',
                component: TipoLugarComponent,
                canActivate: [roleGuard],
                data: { roles: ['ADMINISTRADOR'] }
            },
            {
                path: 'moleculas',
                component: MoleculasComponent,
                canActivate: [roleGuard],
                data: { roles: ['ADMINISTRADOR'] }
            },
            {
                path: 'tipo-servicio',
                component: TipoServicioComponent,
                canActivate: [roleGuard],
                data: { roles: ['ADMINISTRADOR'] }
            },
            {
                path: 'servicios',
                component: ServiciosComponent,
                canActivate: [roleGuard],
                data: { roles: ['ADMINISTRADOR'] }
            },
            {
                path: 'citas',
                component: CitasComponent,
                canActivate: [roleGuard],
                data: { roles: ['ADMINISTRADOR'] }
            },
            {
                path: 'cita-servicio',
                component: CitaServicioComponent,
                canActivate: [roleGuard],
                data: { roles: ['ADMINISTRADOR'] }
            },
            {
                path: 'certificados',
                component: CertificadosComponent,
                canActivate: [roleGuard],
                data: { roles: ['ADMINISTRADOR'] }
            }
        ]
    }
];