import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // La URL de tu API de Java
  private API_URL = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) { }

  // PASO 1 y 2: Enviar Usuario y Contraseña
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, credentials);
  }

  // PASO 3: Validar el código del celular
  verificarMFA(username: string, codigo: number): Observable<any> {
    return this.http.get(`${this.API_URL}/validar-mfa/${username}/${codigo}`);
  }
}