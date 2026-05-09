import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service'; // Sube dos niveles
import { Resource } from '../../models/resource.model';     // Sube dos niveles

@Component({
  selector: 'app-main-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './main-table.component.html',
  styleUrl: './main-table.component.css'
})
export class MainTableComponent implements OnInit {
  resources: Resource[] = [];
  resourcesFiltrados: Resource[] = [];
  currentResource: Resource = { nombre: '', apellido: '', email: '' };
  editando: boolean = false;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.listar();
  }

  listar() {
    this.dataService.getRecords().subscribe({
      next: (data) => {
        this.resources = data;
        this.resourcesFiltrados = data;
      },
      error: (err) => console.error("Error al cargar:", err)
    });
  }

  guardar() {
    if (this.editando) {
      this.dataService.updateRecord(this.currentResource).subscribe({
        next: () => this.finalizarAccion('Actualizado'),
        error: (err) => console.error(err)
      });
    } else {
      this.dataService.createRecord(this.currentResource).subscribe({
        next: () => this.finalizarAccion('Guardado'),
        error: (err) => console.error(err)
      });
    }
  }

  finalizarAccion(mensaje: string) {
    console.log(mensaje);
    this.editando = false;
    this.currentResource = { nombre: '', apellido: '', email: '' };
    this.listar();
  }

  prepararEdicion(item: Resource) {
    this.editando = true;
    this.currentResource = { ...item };
  }

  eliminar(id?: number) {
    if (id && confirm('¿Eliminar?')) {
      this.dataService.deleteRecord(id).subscribe({
        next: () => this.listar()
      });
    }
  }

  buscar(event: any) {
    const valor = event.target.value.toLowerCase();
    this.resourcesFiltrados = this.resources.filter(r => 
      r.nombre.toLowerCase().includes(valor) || 
      r.apellido.toLowerCase().includes(valor) ||
      r.email.toLowerCase().includes(valor)
    );
  }
}