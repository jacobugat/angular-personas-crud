import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonaService } from './persona.service';
import { Persona } from './persona';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  // Aquí guardaremos la lista que viene de Java
  listaPersonas: Persona[] = [];

  constructor(private personaService: PersonaService) {}

  ngOnInit(): void {
    this.obtenerPersonas();
  }

  obtenerPersonas(): void {
    this.personaService.getPersonas().subscribe(data => {
      this.listaPersonas = data;
      console.log(data); // Esto es para ver en la consola si llegaron los datos
    });
  }
}