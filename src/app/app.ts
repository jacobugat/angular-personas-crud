import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Importa tu nuevo componente aquí:
import { PersonaListaComponent } from './persona-lista.component'; 
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  // AGREGA PersonaListaComponent a la lista de imports
  imports: [RouterOutlet, CommonModule, FormsModule, PersonaListaComponent], 
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {

  constructor(public authService: AuthService) {}

  ngOnInit() {
    // Aquí puedes dejar lógica global, como verificar si el usuario está logueado
  }

  // TODA LA LÓGICA DE PERSONAS QUE ESTABA AQUÍ SE BORRA 
  // PORQUE YA VIVE EN persona-lista.component.ts
}