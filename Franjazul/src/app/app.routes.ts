import { RouterModule, Routes } from '@angular/router';

//importes de los layouts

import { LayoutPublico } from './layouts/layout-publico/layout-publico';
import { LayoutInterno } from './layouts/layout-interno/layout-interno';

//importes del layout publico

import { home } from './componentes/Negocio/home/home';
import { Header } from './componentes/Reutilizables/header/header';
import { Footer } from './componentes/Reutilizables/footer/footer';
import { ServiceForm } from './componentes/Negocio/service-form/service-form';

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
        path: 'login', component: Login
    },

    //Interno/dashboard
    {
        path: '',
        component: LayoutInterno,
        children: [
            { path: 'dashboard', component: Dashboard },
            { path: 'appointments', component: Appointments},
            { path: 'appointment/id', component: AppointmentManagement},
            { path: 'profile', component: Profile},
            { path: 'tablas', component: Tablas },
            { path: 'usuarios', component: Usuarios },
            { path: 'permisos', component: Permisos },
            { path: 'roles', component: Roles },
            { path: 'perfiles', component: Perfiles },
            { path: 'cargos', component: Cargos },
            { path: 'formularios', component: Formularios },
            { path: 'reportes', component: Reportes },
            { path: 'estado-cita', component: EstadoCitas},
            { path: 'franjas', component: FranjasHorarias},
            { path: 'lugares', component: LugaresComponent},
            { path: 'tipo-lugar', component: TipoLugarComponent},
            { path: 'moleculas', component: MoleculasComponent},
            { path: 'tipo-servicio', component: TipoServicioComponent},
            { path: 'servicios', component: ServiciosComponent},
            { path: 'citas', component: CitasComponent},
            { path: 'cita-servicio', component: CitaServicioComponent},
            { path: 'certificados', component: CertificadosComponent}

        ]
    }

];
