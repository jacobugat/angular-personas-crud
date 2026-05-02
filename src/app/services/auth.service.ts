import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // Este es el método que guarda el "carnet" automáticamente
  verificarMFA(username: string, codigo: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/validar-mfa/${username}/${codigo}`).pipe(
    tap((res: any) => {
      console.log('Respuesta recibida:', res);
      
      // Cambiamos 'mensaje' por 'message' para que coincida con tu captura
      if (res.status === 'SUCCESS' && res.message) { 
        localStorage.setItem('token', res.message);
        console.log('¡TOKEN GUARDADO!');
      }
    })
  );
}

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }
}