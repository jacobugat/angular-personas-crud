import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../../core/services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-mfa-setup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './mfa-setup.component.html',
  styleUrls: ['./mfa-setup.component.css']
})
export class MfaSetupComponent implements OnInit {
  qrUrl: string = '';
  qrCodeDataUrl: string = '';
  isSetupMode: boolean = false;
  verificationCode: string = '';
  username: string = '';
  mensajeError: string = '';

  constructor(
    public dialogRef: MatDialogRef<MfaSetupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService
  ) {
    this.qrUrl = data.qrUrl || '';
    this.isSetupMode = !!this.qrUrl;
    this.username = data.username;
  }

  ngOnInit(): void {
    if (this.isSetupMode) {
      this.generarQr();
    }
  }

  private async generarQr(): Promise<void> {
    if (!this.qrUrl) {
      this.mensajeError = 'No se recibio la configuracion del autenticador.';
      return;
    }

    this.qrCodeDataUrl = await QRCode.toDataURL(this.qrUrl, {
      errorCorrectionLevel: 'M',
      margin: 4,
      width: 250,
      color: {
        dark: '#111827',
        light: '#ffffff'
      }
    });
  }

  confirmarMfa() {
    if (this.verificationCode.length !== 6) {
      this.mensajeError = 'Ingresa el codigo de 6 digitos.';
      return;
    }

    this.authService.verifyMfa(this.username, Number(this.verificationCode)).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: () => {
        this.mensajeError = 'Codigo incorrecto, intenta de nuevo.';
      }
    });
  }
}
