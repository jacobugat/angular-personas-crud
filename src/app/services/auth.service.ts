import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

// Interfaz definida aquí mismo para evitar errores de importación
export interface AuthResponse {
  token: string;
  username: string;
  status: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) { }

  login(creds: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, creds).pipe(
      tap((res: AuthResponse) => {
        console.log("Respuesta completa del servidor:", res);
        
        // Verificamos si existe el token en la respuesta
        if (res && res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('username', res.username);
          console.log("¡TOKEN GUARDADO EXITOSAMENTE EN LOCALSTORAGE!");
        } else {
          console.error("EL SERVIDOR NO ENVIÓ TOKEN. Revisa el backend.");
        }
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    console.log('Sesión cerrada.');
  }
}