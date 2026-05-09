import { Routes } from '@angular/router';
import { MainTableComponent } from './features/dashboard/components/main-table/main-table.component';
import { LoginComponent } from './features/auth/login/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: MainTableComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];