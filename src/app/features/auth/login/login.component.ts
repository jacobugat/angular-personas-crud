import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, AuthResponse } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
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
    this.mensajeError = '';

    this.authService.login(datos).subscribe({
      next: (res: AuthResponse) => {
        if (res && res.token) {
          console.log('Login exitoso, redirigiendo al dashboard...');
          this.router.navigate(['/dashboard']);
        } else {
          this.mensajeError = 'El servidor no devolvió un token de acceso.';
        }
      },
      
      error: (err) => {
        console.error('Error en la petición:', err);
        this.mensajeError = 'Usuario o contraseña incorrectos.';
      }
    });
  }
}