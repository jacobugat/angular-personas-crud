import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { ClienteNota, Resource } from '../../models/resource.model';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-main-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatCardModule,
    MatCheckboxModule,
    MatSelectModule
  ],
  templateUrl: './main-table.component.html',
  styleUrl: './main-table.component.css'
})
export class MainTableComponent implements OnInit {
  resources: Resource[] = [];
  resourcesFiltrados: Resource[] = [];
  
  expandedId?: number;
  editingId?: number;
  editingResource: Resource | null = null;
  
  nuevaNotaTexto: Record<number, string> = {};
  notaEnEdicion: Record<number, string> = {};

  constructor(
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.listar();
  }

  listar() {
    this.dataService.getRecords().subscribe({
      next: (data) => {
        this.resources = data.map(item => this.normalizarCliente(item));
        this.resourcesFiltrados = this.resources;
      },
      error: (err) => console.error('Error al cargar:', err)
    });
  }

  // --- Lógica de Vista y Edición ---

  toggleDetalle(item: Resource) {
    if (!item.id) return;
    this.expandedId = this.expandedId === item.id ? undefined : item.id;
    this.editingId = undefined;
    this.editingResource = null;
  }

  iniciarEdicion(item: Resource) {
    if (!item.id) return;
    this.expandedId = item.id;
    this.editingId = item.id;
    this.editingResource = { 
      ...item, 
      notas: [...(item.notas || [])], 
      archivos: [...(item.archivos || [])] 
    };
  }

  cancelarEdicion() {
    this.editingId = undefined;
    this.editingResource = null;
  }

  guardarEdicion() {
    if (!this.editingResource?.id) return;
    this.dataService.updateRecord(this.editingResource).subscribe({
      next: () => {
        this.cancelarEdicion();
        this.listar();
      },
      error: (err) => console.error(err)
    });
  }

  eliminar(id?: number) {
    if (id && confirm('¿Eliminar este registro?')) {
      this.dataService.deleteRecord(id).subscribe({
        next: () => this.listar()
      });
    }
  }

  buscar(event: Event) {
    const valor = (event.target as HTMLInputElement).value.toLowerCase();
    this.resourcesFiltrados = this.resources.filter(r => this.valorBuscable(r).includes(valor));
  }

  // --- Gestión de Notas ---

  agregarNota(cliente: Resource) {
    if (!cliente.id) return;
    const texto = (this.nuevaNotaTexto[cliente.id] || '').trim();
    if (!texto) return;
    this.dataService.createNote(cliente.id, texto).subscribe({
      next: () => {
        this.nuevaNotaTexto[cliente.id!] = '';
        this.listar();
      }
    });
  }

  iniciarEdicionNota(nota: ClienteNota) {
    if (nota.id) this.notaEnEdicion[nota.id] = nota.texto;
  }

  guardarNota(cliente: Resource, nota: ClienteNota) {
    if (!cliente.id || !nota.id) return;
    const texto = (this.notaEnEdicion[nota.id] || '').trim();
    if (!texto) return;
    this.dataService.updateNote(cliente.id, nota.id, texto).subscribe({
      next: () => {
        delete this.notaEnEdicion[nota.id!];
        this.listar();
      }
    });
  }

  eliminarNota(cliente: Resource, nota: ClienteNota) {
    if (cliente.id && nota.id && confirm('¿Eliminar esta nota?')) {
      this.dataService.deleteNote(cliente.id, nota.id).subscribe({
        next: () => this.listar()
      });
    }
  }

  // --- Gestión de Archivos ---

  subirArchivo(cliente: Resource, event: Event) {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];
    if (!cliente.id || !archivo) return;

    const mensaje = this.validarArchivoPermitido(archivo);
    if (mensaje) {
      alert(mensaje);
      input.value = '';
      return;
    }

    this.dataService.uploadFile(cliente.id, archivo).subscribe({
      next: () => {
        input.value = '';
        this.listar();
      },
      error: (err) => alert(err?.error?.message || 'Solo se permiten archivos PDF o imagenes.')
    });
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

  eliminarArchivo(cliente: Resource, archivoId?: number) {
    if (cliente.id && archivoId && confirm('¿Eliminar este archivo?')) {
      this.dataService.deleteFile(cliente.id, archivoId).subscribe({
        next: () => this.listar()
      });
    }
  }

  abrirArchivo(archivoId?: number, nombreOriginal?: string) {
    if (!archivoId) return;
    this.dataService.downloadFile(archivoId).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const enlace = document.createElement('a');
        enlace.href = url;
        enlace.target = '_blank';
        enlace.rel = 'noopener noreferrer';
        enlace.download = nombreOriginal || 'archivo';
        enlace.click();
        URL.revokeObjectURL(url);
      }
    });
  }

  // --- Helpers de Formato ---

  whatsappUrl(numero?: string): string {
    const limpio = (numero || '').replace(/[^\d]/g, '');
    return limpio ? `https://wa.me/${limpio}` : '#';
  }

  estadoClase(item: Resource): string {
    return `status-${this.estadoVisible(item)}`.toLowerCase().replace('_', '-');
  }

  estadoVisible(item: Resource): 'NO_COMPRO' | 'CITA' | 'COMPRO' {
    if (this.editingId === item.id && this.editingResource?.estadoCliente) {
      return this.editingResource.estadoCliente;
    }

    return item.estadoCliente || 'NO_COMPRO';
  }

  estadoTexto(estado?: string): string {
    const etiquetas: Record<string, string> = {
      NO_COMPRO: 'No compró',
      CITA: 'Está en cita',
      COMPRO: 'Sí compró'
    };
    return etiquetas[estado || 'NO_COMPRO'] || 'No compró';
  }

  cedulaCompleta(item: Resource): string {
    return `${item.tipoCedula || 'V-'}${item.cedula || ''}`;
  }

  iniciales(item: Resource): string {
    return `${item.nombre?.charAt(0) || ''}${item.apellido?.charAt(0) || ''}`.toUpperCase();
  }

  formatearFecha(fecha?: string): string {
    return fecha ? new Date(fecha).toLocaleString() : '';
  }

  private normalizarCliente(cliente: Resource): Resource {
    return {
      ...cliente,
      tipoCedula: cliente.tipoCedula === 'E-' ? 'E-' : 'V-',
      notas: cliente.notas || [],
      archivos: cliente.archivos || []
    };
  }

  private valorBuscable(resource: Resource): string {
    return [
      resource.nombre,
      resource.apellido,
      resource.tipoCedula,
      resource.cedula,
      resource.rif,
      resource.whatsapp,
      resource.estadoCliente,
      resource.agenteVendedor,
      resource.fechaCita,
      resource.interesado,
      resource.email,
      resource.direccionPostal
    ].join(' ').toLowerCase();
  }
}
