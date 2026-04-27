import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <--- IMPORTANTE
import { PersonaService } from './persona.service';
import { Persona } from './persona.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule], // <--- AGREGAR AQUÍ
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  personas: Persona[] = [];
  personasFiltradas: Persona[] = [];
  
  // Objeto para el formulario
  nuevaPersona: Persona = { nombre: '', apellido: '', email: '' };

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
      error: (err) => console.error('Error al cargar:', err)
    });
  }

  // Función para guardar
  guardarPersona() {
    if (!this.nuevaPersona.nombre || !this.nuevaPersona.email) {
      alert('Por favor, llena al menos el nombre y el email.');
      return;
    }

    this.personaService.crearPersona(this.nuevaPersona).subscribe({
      next: (personaGuardada) => {
        console.log('Guardado con éxito:', personaGuardada);
        this.cargarPersonas(); // <--- Esto refresca la tabla automáticamente
        this.nuevaPersona = { nombre: '', apellido: '', email: '' }; // Limpia el formulario
      },
      error: (err) => console.error('Error al guardar:', err)
    });
  }

  buscar(event: any) {
    const valor = event.target.value.toLowerCase();
    this.personasFiltradas = this.personas.filter(p => 
      p.nombre.toLowerCase().includes(valor) || 
      p.apellido.toLowerCase().includes(valor)
    );
  }

  editar(p: Persona) { /* lógica de editar */ }
  eliminar(id?: number) { /* lógica de eliminar */ }
}