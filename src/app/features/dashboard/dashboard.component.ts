import { Component, inject } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // Importamos RouterModule
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TopbarComponent } from './components/topbar/topbar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule, // Agregado para habilitar router-outlet y routerLink
    SidebarComponent,
    TopbarComponent
    // Eliminamos MainTableComponent de aquí porque se cargará vía rutas
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  isSidebarExpanded: boolean = false;

  private router = inject(Router);
  private http = inject(HttpClient); 

  toggleSidebar(): void {
    this.isSidebarExpanded = !this.isSidebarExpanded;
  }

  handleLogout(): void {
    this.http.post('http://localhost:8080/api/auth/logout', {}).subscribe({
      next: () => {
        console.log('Sesión cerrada en el servidor');
      },
      error: (err) => {
        console.error('Error al avisar al servidor:', err);
      },
      complete: () => {
        this.completeLogout();
      }
    });
  }

  private completeLogout(): void {
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/login']);
  }
}