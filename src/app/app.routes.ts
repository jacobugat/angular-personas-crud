import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    children: [
      { 
        path: 'clientes', 
        loadComponent: () => import('./features/dashboard/components/main-table/main-table.component').then(m => m.MainTableComponent) 
      },
      { 
        path: 'nuevo-registro', 
        loadComponent: () => import('./features/dashboard/components/cliente-form/cliente-form.component').then(m => m.ClienteFormComponent) 
      },
      {
        path: 'empleados',
        loadComponent: () => import('./features/dashboard/components/empleados/empleados.component').then(m => m.EmpleadosComponent)
      },
      {
        path: 'inmuebles',
        loadComponent: () => import('./features/dashboard/components/inmuebles/inmuebles.component').then(m => m.InmueblesComponent)
      },
      { path: '', redirectTo: 'clientes', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
