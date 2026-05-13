import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, AuthResponse } from '../../../core/services/auth.service';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { MfaSetupComponent } from '../mfa-setup/mfa-setup.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  pasoActual: number = 1;
  username: string = '';
  password: string = '';
  mensajeError: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  irAPassword() {
    if (this.username.trim() !== '') {
      this.pasoActual = 2;
      this.mensajeError = '';
    } else {
      this.mensajeError = 'Por favor, ingresa un usuario';
    }
  }

  ejecutarLogin() {
    const credenciales = { username: this.username, password: this.password };

    this.authService.login(credenciales).subscribe({
      next: (res: AuthResponse) => {
        if (res.status === 'MFA_SETUP_REQUIRED') {
          this.abrirModalConfigurarMfa(res.username, res.qrUrl);
        } else if (res.status === 'MFA_REQUIRED') {
          this.abrirDialogoMfa(res.username);
        } else if (res.status === 'SUCCESS') {
          localStorage.setItem('token', res.token);
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.mensajeError = 'Error en la conexion: ' + err.message;
      }
    });
  }

  private abrirModalConfigurarMfa(username: string, qrUrl?: string) {
    if (qrUrl) {
      this.abrirDialogoMfa(username, qrUrl);
      return;
    }

    this.authService.getMfaSetup(username).subscribe({
      next: (mfaData) => {
        this.abrirDialogoMfa(username, mfaData.qrUrl);
      },
      error: () => {
        this.mensajeError = 'Error al cargar la configuracion de seguridad.';
      }
    });
  }

  private abrirDialogoMfa(username: string, qrUrl?: string) {
    const dialogRef = this.dialog.open(MfaSetupComponent, {
      width: '420px',
      data: {
        qrUrl,
        username
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.router.navigate(['/dashboard']);
      }
    });
  }
}
