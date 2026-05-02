import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
// Corregimos la ruta: están en la misma carpeta que app.routes.ts
import { PersonaListComponent } from './persona.service'; // Ojo: Revisa abajo cuál es el nombre real del archivo del componente

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'personas', component: PersonaListComponent }, 
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];