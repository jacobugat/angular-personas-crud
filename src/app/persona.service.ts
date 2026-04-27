import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Persona } from './persona.model'; // <-- Actualizado

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  // La URL de tu API en Spring Boot
  private url = 'http://localhost:8080/api/personas';

  constructor(private http: HttpClient) { }

  // Función para traer los datos del Docker
  getPersonas(): Observable<Persona[]> {
    return this.http.get<Persona[]>(this.url);
  }
  
  // Añade esta función a tu clase PersonaService
  crearPersona(persona: Persona) {
    return this.http.post<Persona>('http://localhost:8080/api/personas', persona);
  }

}