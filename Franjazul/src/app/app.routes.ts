import { RouterModule, Routes } from '@angular/router';


export const routes: Routes = [
    
    {
        path: 'login',
        loadComponent: ()=> import('./componentes/autenticacion/login/login')
    }

];
