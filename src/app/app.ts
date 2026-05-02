import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { AppComponent } from './app.component'; // Importamos la raíz donde está tu tabla

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'personas', component: AppComponent }, // Ahora 'personas' cargará el CRUD
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];