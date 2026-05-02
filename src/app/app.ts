import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router'; 
import { CommonModule } from '@angular/common'; // Agregamos esta línea
import { FormsModule } from '@angular/forms';
import { PersonaService } from './persona.service';
import { Persona } from './persona.model';

@Component({
  selector: 'app-root',
  standalone: true,
  // IMPORTANTE: Solo un "imports" con todo adentro separado por comas
  imports: [RouterOutlet, CommonModule, FormsModule], 
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  personas: Persona[] = [];
  personasFiltradas: Persona[] = [];
  nuevaPersona: Persona = { nombre: '', apellido: '', email: '' };
  editando: boolean = false;

  constructor(private personaService: PersonaService) {}

  ngOnInit() {
    this.cargarPersonas();
  }

  cargarPersonas() {
    this.personaService.getPersonas().subscribe({
      next: (data) => {
        this.personas = data;
        this.personasFiltradas = data;
      },
      error: (err) => console.error('Error al cargar personas:', err)
    });
  }

  guardarPersona() {
    if (this.editando) {
      this.personaService.actualizarPersona(this.nuevaPersona).subscribe({
        next: () => this.finalizarAccion('¡Persona actualizada con éxito!'),
        error: (err) => console.error('Error al actualizar:', err)
      });
    } else {
      this.personaService.crearPersona(this.nuevaPersona).subscribe({
        next: () => this.finalizarAccion('¡Persona creada con éxito!'),
        error: (err) => console.error('Error al crear:', err)
      });
    }
  }

  editar(persona: Persona) {
    this.editando = true;
    this.nuevaPersona = { ...persona };
  }

  eliminar(id?: number) {
    if (id && confirm('¿Estás seguro de eliminar este registro?')) {
      this.personaService.eliminarPersona(id).subscribe({
        next: () => this.cargarPersonas(),
        error: (err) => console.error('Error al eliminar:', err)
      });
    }
  }

  finalizarAccion(mensaje: string) {
    alert(mensaje);
    this.cargarPersonas();
    this.nuevaPersona = { nombre: '', apellido: '', email: '' };
    this.editando = false;
  }

  buscar(event: any) {
    const valor = event.target.value.toLowerCase();
    this.personasFiltradas = this.personas.filter(p => 
      p.nombre.toLowerCase().includes(valor) || 
      p.apellido.toLowerCase().includes(valor)
    );
  }
}