import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { AppComponent } from './app'; 

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'personas', component: AppComponent }, 
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];