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
  codigoMfa: number | null = null;
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
        if (res.status === 'MFA_REQUIRED') {
          this.pasoActual = 3;
          this.mensajeError = '';
        } else if (res.status === 'SUCCESS') {
          // Si no pide MFA, va directo al listado
          this.router.navigate(['/personas']);
        }
      },
      error: (err: any) => {
        this.mensajeError = 'Credenciales inválidas. Intenta de nuevo.';
      }
    });
  }

  verificarMfa() {
    if (this.codigoMfa) {
      this.authService.verificarMFA(this.username, this.codigoMfa).subscribe({
        next: (res: any) => {
          // El AuthService ya guardó el token gracias al 'tap' que pusimos antes
          console.log('Token validado correctamente');
          
          // Cambiamos el alert por la navegación automática
          this.router.navigate(['/personas']); 
        },
        error: (err: any) => {
          this.mensajeError = 'Código incorrecto o expirado';
        }
      });
    } else {
      this.mensajeError = 'Por favor, ingresa el código de 6 dígitos';
    }
  }
}