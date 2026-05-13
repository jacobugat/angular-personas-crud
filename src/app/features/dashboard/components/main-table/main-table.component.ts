import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { PersonaNota, Resource } from '../../models/resource.model';
import { AuthService } from '../../../../core/services/auth.service';

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
  currentResource: Resource = this.crearResourceVacio();
  expandedId?: number;
  editingId?: number;
  editingResource: Resource | null = null;
  nuevaNotaTexto: Record<number, string> = {};
  notaEnEdicion: Record<number, string> = {};
  visitasAbiertas: boolean = false;
  filtroFechaVisitas: string = '';

  constructor(
    private dataService: DataService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.listar();
  }

  cerrarSesion() {
    if (confirm('Deseas cerrar sesion?')) {
      this.authService.logout();
    }
  }

  abrirVisitas() {
    this.visitasAbiertas = true;
  }

  cerrarVisitas() {
    this.visitasAbiertas = false;
  }

  listar() {
    this.dataService.getRecords().subscribe({
      next: (data) => {
        this.resources = data.map(item => this.normalizarPersona(item));
        this.resourcesFiltrados = this.resources;
      },
      error: (err) => console.error('Error al cargar:', err)
    });
  }

  guardarNuevo() {
    this.dataService.createRecord(this.currentResource).subscribe({
      next: () => {
        this.currentResource = this.crearResourceVacio();
        this.listar();
      },
      error: (err) => console.error(err)
    });
  }

  toggleDetalle(item: Resource) {
    if (!item.id) {
      return;
    }
    this.expandedId = this.expandedId === item.id ? undefined : item.id;
    this.editingId = undefined;
    this.editingResource = null;
  }

  iniciarEdicion(item: Resource) {
    if (!item.id) {
      return;
    }
    this.expandedId = item.id;
    this.editingId = item.id;
    this.editingResource = { ...item, notas: [...(item.notas || [])], archivos: [...(item.archivos || [])] };
  }

  cancelarEdicion() {
    this.editingId = undefined;
    this.editingResource = null;
  }

  guardarEdicion() {
    if (!this.editingResource?.id) {
      return;
    }
    this.dataService.updateRecord(this.editingResource).subscribe({
      next: () => {
        this.cancelarEdicion();
        this.listar();
      },
      error: (err) => console.error(err)
    });
  }

  eliminar(id?: number) {
    if (id && confirm('Eliminar este registro?')) {
      this.dataService.deleteRecord(id).subscribe({
        next: () => this.listar()
      });
    }
  }

  buscar(event: Event) {
    const valor = (event.target as HTMLInputElement).value.toLowerCase();
    this.resourcesFiltrados = this.resources.filter(r => this.valorBuscable(r).includes(valor));
  }

  agregarNota(persona: Resource) {
    if (!persona.id) {
      return;
    }
    const texto = (this.nuevaNotaTexto[persona.id] || '').trim();
    if (!texto) {
      return;
    }
    this.dataService.createNote(persona.id, texto).subscribe({
      next: () => {
        this.nuevaNotaTexto[persona.id!] = '';
        this.listar();
      }
    });
  }

  iniciarEdicionNota(nota: PersonaNota) {
    if (nota.id) {
      this.notaEnEdicion[nota.id] = nota.texto;
    }
  }

  guardarNota(persona: Resource, nota: PersonaNota) {
    if (!persona.id || !nota.id) {
      return;
    }
    const texto = (this.notaEnEdicion[nota.id] || '').trim();
    if (!texto) {
      return;
    }
    this.dataService.updateNote(persona.id, nota.id, texto).subscribe({
      next: () => {
        delete this.notaEnEdicion[nota.id!];
        this.listar();
      }
    });
  }

  eliminarNota(persona: Resource, nota: PersonaNota) {
    if (persona.id && nota.id && confirm('Eliminar esta nota?')) {
      this.dataService.deleteNote(persona.id, nota.id).subscribe({
        next: () => this.listar()
      });
    }
  }

  subirArchivo(persona: Resource, event: Event) {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];
    if (!persona.id || !archivo) {
      return;
    }
    this.dataService.uploadFile(persona.id, archivo).subscribe({
      next: () => {
        input.value = '';
        this.listar();
      },
      error: () => alert('Solo se permiten PDF, imagenes o videos.')
    });
  }

  eliminarArchivo(persona: Resource, archivoId?: number) {
    if (persona.id && archivoId && confirm('Eliminar este archivo?')) {
      this.dataService.deleteFile(persona.id, archivoId).subscribe({
        next: () => this.listar()
      });
    }
  }

  abrirArchivo(archivoId?: number, nombreOriginal?: string) {
    if (!archivoId) {
      return;
    }
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

  whatsappUrl(numero?: string): string {
    const limpio = (numero || '').replace(/[^\d]/g, '');
    return limpio ? `https://wa.me/${limpio}` : '#';
  }

  estadoClase(item: Resource): string {
    return `status-${item.estadoCliente || 'NO_COMPRO'}`.toLowerCase().replace('_', '-');
  }

  estadoTexto(estado?: string): string {
    const etiquetas: Record<string, string> = {
      NO_COMPRO: 'No compro',
      CITA: 'Esta en cita',
      COMPRO: 'Si compro'
    };
    return etiquetas[estado || 'NO_COMPRO'] || 'No compro';
  }

  fechaCitaLegible(fecha?: string): string {
    if (!fecha) {
      return 'Sin cita';
    }
    const [year, month, day] = fecha.split('-');
    return `${day}/${month}/${year}`;
  }

  visitasFiltradas(): Resource[] {
    return this.resources.filter(item => {
      if (!item.fechaCita) {
        return false;
      }
      return this.filtroFechaVisitas ? item.fechaCita === this.filtroFechaVisitas : true;
    });
  }

  visitasPorEstado(estado: 'NO_COMPRO' | 'CITA' | 'COMPRO'): number {
    return this.visitasFiltradas().filter(item => (item.estadoCliente || 'NO_COMPRO') === estado).length;
  }

  rendimientoVisitas(): string {
    const total = this.visitasFiltradas().length;
    if (total === 0) {
      return 'Pobre';
    }
    if (total < 3) {
      return 'Bajo';
    }
    if (total < 6) {
      return 'Bueno';
    }
    return 'Alto';
  }

  rendimientoPorcentaje(): number {
    return Math.min(this.visitasFiltradas().length * 18, 100);
  }

  abrirUrl(url?: string) {
    if (!url) {
      return;
    }
    const normalizada = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    window.open(normalizada, '_blank', 'noopener,noreferrer');
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

  private crearResourceVacio(): Resource {
    return {
      nombre: '',
      apellido: '',
      tipoCedula: 'V-',
      cedula: '',
      rif: '',
      whatsapp: '',
      instagram: '',
      facebook: '',
      tiktok: '',
      estadoCliente: 'NO_COMPRO',
      agenteVendedor: '',
      fechaCita: '',
      interesado: '',
      email: '',
      direccionPostal: '',
      autorizaTratamientoDatos: false,
      notas: [],
      archivos: []
    };
  }

  private normalizarPersona(persona: Resource): Resource {
    return {
      ...this.crearResourceVacio(),
      ...persona,
      tipoCedula: persona.tipoCedula === 'E-' ? 'E-' : 'V-',
      notas: persona.notas || [],
      archivos: persona.archivos || []
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
      resource.direccionPostal,
      resource.facebook,
      resource.instagram,
      resource.tiktok
    ].join(' ').toLowerCase();
  }
}
