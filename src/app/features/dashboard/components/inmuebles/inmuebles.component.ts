import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Inmueble, TipoInmueble } from '../../models/inmueble.model';
import { InmuebleService } from '../../services/inmueble.service';

@Component({
  selector: 'app-inmuebles',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './inmuebles.component.html',
  styleUrl: './inmuebles.component.css'
})
export class InmueblesComponent implements OnInit {
  private inmuebleService = inject(InmuebleService);

  inmuebles: Inmueble[] = [];
  nuevo: Inmueble = this.crearInmuebleVacio('CASA');
  guardando = false;
  error = '';

  tipos: { value: TipoInmueble; label: string }[] = [
    { value: 'CASA', label: 'Casa' },
    { value: 'APARTAMENTO', label: 'Apartamento' },
    { value: 'LOCAL', label: 'Local' },
    { value: 'OFICINA', label: 'Oficina' },
    { value: 'FINCA', label: 'Finca' },
    { value: 'TERRENO', label: 'Terreno' },
    { value: 'EDIFICIO', label: 'Edificio' }
  ];

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.inmuebleService.getInmuebles().subscribe({
      next: (inmuebles) => this.inmuebles = inmuebles,
      error: () => this.error = 'No se pudo cargar el inventario.'
    });
  }

  cambiarTipo(tipo: TipoInmueble) {
    this.nuevo = {
      ...this.crearInmuebleVacio(tipo),
      titulo: this.nuevo.titulo,
      tipoOperacion: this.nuevo.tipoOperacion,
      precio: this.nuevo.precio,
      direccion: this.nuevo.direccion,
      barrio: this.nuevo.barrio,
      ciudad: this.nuevo.ciudad,
      areaTotal: this.nuevo.areaTotal,
      estadoInmueble: this.nuevo.estadoInmueble,
      descripcion: this.nuevo.descripcion,
      plantaElectrica: this.nuevo.plantaElectrica,
      panelesSolares: this.nuevo.panelesSolares,
      tanquesAgua: this.nuevo.tanquesAgua
    };
  }

  esResidencial(): boolean {
    return ['CASA', 'APARTAMENTO'].includes(this.nuevo.tipoInmueble);
  }

  esComercial(): boolean {
    return ['LOCAL', 'OFICINA'].includes(this.nuevo.tipoInmueble);
  }

  esRural(): boolean {
    return ['FINCA', 'TERRENO'].includes(this.nuevo.tipoInmueble);
  }

  esEdificio(): boolean {
    return this.nuevo.tipoInmueble === 'EDIFICIO';
  }

  guardar() {
    this.error = '';

    if (!this.nuevo.titulo || !this.nuevo.tipoOperacion || !this.nuevo.precio || !this.nuevo.direccion || !this.nuevo.areaTotal) {
      this.error = 'Completa titulo, operacion, precio, direccion y area total.';
      return;
    }

    this.guardando = true;
    this.inmuebleService.createInmueble(this.limpiarPorTipo(this.nuevo)).subscribe({
      next: () => {
        const tipo = this.nuevo.tipoInmueble;
        this.nuevo = this.crearInmuebleVacio(tipo);
        this.guardando = false;
        this.cargar();
      },
      error: (err) => {
        this.guardando = false;
        this.error = err?.error?.message || 'No se pudo guardar el inmueble.';
      }
    });
  }

  etiquetaTipo(tipo?: string): string {
    return this.tipos.find(item => item.value === tipo)?.label || 'Inmueble';
  }

  private crearInmuebleVacio(tipoInmueble: TipoInmueble): Inmueble {
    return {
      titulo: '',
      tipoInmueble,
      tipoOperacion: 'VENTA',
      precio: null,
      direccion: '',
      barrio: '',
      ciudad: '',
      areaTotal: null,
      estadoInmueble: 'USADO',
      descripcion: '',
      plantaElectrica: false,
      panelesSolares: false,
      tanquesAgua: false
    };
  }

  private limpiarPorTipo(inmueble: Inmueble): Inmueble {
    const payload: Inmueble = { ...inmueble };

    if (!['CASA', 'APARTAMENTO'].includes(payload.tipoInmueble)) {
      payload.habitaciones = null;
      payload.banos = null;
      payload.puestosEstacionamiento = null;
      payload.pisoNiveles = null;
      payload.valorAdministracion = null;
      payload.amenidades = '';
    }

    if (!['LOCAL', 'OFICINA'].includes(payload.tipoInmueble)) {
      payload.metrosVitrina = null;
      payload.tipoEnergia = '';
      payload.banosPublicos = null;
      payload.banosPrivados = null;
      payload.capacidadCarga = null;
      payload.usoSuelo = '';
    }

    if (!['FINCA', 'TERRENO'].includes(payload.tipoInmueble)) {
      payload.hectareas = null;
      payload.fanegadas = null;
      payload.fuentesAgua = '';
      payload.topografia = '';
      payload.tipoCultivoUso = '';
      payload.distanciaViaPrincipalKm = null;
    }

    if (payload.tipoInmueble !== 'EDIFICIO') {
      payload.numeroUnidades = null;
      payload.areaConstruida = null;
      payload.anoConstruccion = null;
      payload.rentabilidadEstimadaMensual = null;
    }

    return payload;
  }
}
