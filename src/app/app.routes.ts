import { Routes } from '@angular/router';
import { PersonaListaComponent } from './persona-lista.component';
import { LoginComponent } from './components/login/login';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'personas', component: PersonaListaComponent }, // Esta línea es clave
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];