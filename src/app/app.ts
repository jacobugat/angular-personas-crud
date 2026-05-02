import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonaService } from './persona.service';
import { Persona } from './persona.model';

@Component({
  selector: 'app-root',
  standalone: true,
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

  // ... (aquí va el resto de tus funciones de guardar, editar, etc. que ya tenías)
  guardarPersona() { /* tu codigo */ }
  editar(p: Persona) { /* tu codigo */ }
  eliminar(id?: number) { /* tu codigo */ }
  finalizarAccion(m: string) { /* tu codigo */ }
  buscar(e: any) { /* tu codigo */ }
}