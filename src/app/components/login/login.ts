import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  pasoActual: number = 1; 
  username: string = '';
  password: string = '';
  mensajeError: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  irAPassword() {
    if (this.username.trim() !== '') {
      this.pasoActual = 2;
      this.mensajeError = '';
    } else {
      this.mensajeError = 'Por favor, ingresa un usuario';
    }
  }

  ejecutarLogin() {
    const datos = { username: this.username, password: this.password };
    
    this.authService.login(datos).subscribe({
      next: (res: any) => {
        if (res.status === 'SUCCESS') {
          // Login exitoso → navegar directo
          this.router.navigate(['/personas']);
        } else {
          this.mensajeError = 'Credenciales inválidas. Intenta de nuevo.';
        }
      },
      error: () => {
        this.mensajeError = 'Credenciales inválidas. Intenta de nuevo.';
      }
    });
  }
}
