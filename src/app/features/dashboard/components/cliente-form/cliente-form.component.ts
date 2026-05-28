import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, of, switchMap } from 'rxjs';
import { DataService } from '../../services/data.service';
import { Resource } from '../../models/resource.model';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  templateUrl: './cliente-form.component.html',
  styleUrl: './cliente-form.component.css'
})
export class ClienteFormComponent {
  private dataService = inject(DataService);
  private router = inject(Router);

  notaInicial: string = '';
  archivosSeleccionados: File[] = [];

  currentResource: Resource = {
    nombre: '',
    apellido: '',
    tipoCedula: 'V-',
    cedula: '',
    rif: '',
    email: '',
    whatsapp: '',
    direccionPostal: '',
    interesado: '',
    agenteVendedor: '',
    fechaCita: '',
    estadoCliente: 'NO_COMPRO',
    autorizaTratamientoDatos: false,
    notas: [],
    archivos: []
  };

  guardar() {
    const payload: Resource = {
      ...this.currentResource,
      notas: this.notaInicial.trim() ? [{ texto: this.notaInicial.trim() }] : []
    };

    this.dataService.createRecord(payload).pipe(
      switchMap((clienteGuardado) => {
        if (!clienteGuardado.id || this.archivosSeleccionados.length === 0) {
          return of([]);
        }

        return forkJoin(this.archivosSeleccionados.map(archivo =>
          this.dataService.uploadFile(clienteGuardado.id!, archivo)
        ));
      })
    ).subscribe({
      next: () => this.router.navigate(['/dashboard/clientes']),
      error: (err) => console.error('Error al guardar:', err)
    });
  }

  seleccionarArchivos(event: Event) {
    const input = event.target as HTMLInputElement;
    const archivos = Array.from(input.files || []);
    const mensaje = archivos.map(archivo => this.validarArchivoPermitido(archivo)).find(Boolean);

    if (mensaje) {
      alert(mensaje);
      input.value = '';
      this.archivosSeleccionados = [];
      return;
    }

    this.archivosSeleccionados = archivos;
  }

  private validarArchivoPermitido(archivo: File): string | null {
    const extension = archivo.name.toLowerCase().slice(archivo.name.lastIndexOf('.'));
    const extensionesPermitidas = ['.pdf', '.jpg', '.jpeg', '.png', '.webp', '.gif'];

    if (archivo.type.startsWith('video/')) {
      return 'No se puede subir videos.';
    }

    if (archivo.type.startsWith('audio/') || ['.mp3', '.wav', '.ogg', '.m4a'].includes(extension)) {
      return 'No se puede subir musica o archivos de audio.';
    }

    if (!extensionesPermitidas.includes(extension)) {
      return 'Solo se permiten archivos PDF o imagenes.';
    }

    if (!archivo.type.startsWith('image/') && archivo.type !== 'application/pdf') {
      return 'Solo se permiten archivos PDF o imagenes.';
    }

    return null;
  }

  cancelar() {
    this.router.navigate(['/dashboard/clientes']);
  }
}
