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
      next: (res: any) => { // Agregamos :any para quitar el error TS7006
        if (res.status === 'MFA_REQUIRED') {
          this.pasoActual = 3;
        } else if (res.status === 'SUCCESS') {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err: any) => { // Agregamos :any
        this.mensajeError = 'Credenciales inválidas. Intenta de nuevo.';
      }
    });
  }

  verificarMfa() {
    if (this.codigoMfa) {
      this.authService.verificarMFA(this.username, this.codigoMfa).subscribe({
        next: (res: any) => { // Agregamos :any
          alert('¡Acceso concedido!');
        },
        error: (err: any) => { // Agregamos :any
          this.mensajeError = 'Código incorrecto o expirado';
        }
      });
    }
  }
}