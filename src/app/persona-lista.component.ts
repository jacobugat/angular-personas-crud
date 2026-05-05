import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonaService } from './persona.service';
import { Persona } from './persona.model';

@Component({
  selector: 'app-persona-lista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './persona-lista.component.html'
})
export class PersonaListaComponent implements OnInit {
  personas: Persona[] = [];
  personasFiltradas: Persona[] = [];
  nuevaPersona: Persona = { nombre: '', apellido: '', email: '' };
  editando: boolean = false;

  constructor(private personaService: PersonaService) {}

  ngOnInit() {
    this.listar();
  }

  listar() {
    this.personaService.getPersonas().subscribe({
      next: (data: Persona[]) => { // Tipado como arreglo de Persona
        this.personas = data;
        this.personasFiltradas = data;
      },
      error: (err: any) => console.error("Error al cargar:", err)
    });
  }

  guardarPersona() {
    if (this.editando) {
      this.personaService.actualizarPersona(this.nuevaPersona).subscribe({
        next: () => this.finalizarAccion('Actualizado'),
        error: (err: any) => console.error(err)
      });
    } else {
      this.personaService.crearPersona(this.nuevaPersona).subscribe({
        next: () => this.finalizarAccion('Guardado'),
        error: (err: any) => console.error(err)
      });
    }
  }

  finalizarAccion(msj: string) {
    console.log(msj); // Para que veas la confirmación en consola
    this.editando = false;
    this.nuevaPersona = { nombre: '', apellido: '', email: '' };
    this.listar();
  }

  editar(p: Persona) {
    this.editando = true;
    this.nuevaPersona = { ...p };
  }

  eliminar(id?: number) {
    if (id && confirm('¿Eliminar esta persona?')) {
      this.personaService.eliminarPersona(id).subscribe({
        next: () => this.listar(),
        error: (err: any) => console.error(err)
      });
    }
  }

  buscar(event: any) {
    const valor = event.target.value.toLowerCase();
    this.personasFiltradas = this.personas.filter(p => 
      p.nombre.toLowerCase().includes(valor) || 
      p.apellido.toLowerCase().includes(valor) ||
      p.email.toLowerCase().includes(valor)
    );
  }
}