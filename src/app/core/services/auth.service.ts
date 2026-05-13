import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

export interface AuthResponse {
  token: string;
  username: string;
  status: string;
  message?: string;
  qrUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient, private router: Router) { }

  login(creds: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, creds).pipe(
      tap((res: AuthResponse) => {
        // Solo guardamos sesión si el status es SUCCESS (sin MFA)
        if (res && res.token && res.status === 'SUCCESS') {
          this.guardarSesion(res.token, res.username);
        }
      })
    );
  }

  // NUEVO: Obtener configuración de MFA (QR y Secreto)
  getMfaSetup(username: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/mfa/setup?username=${username}`);
  }

  // NUEVO: Verificar el código de 6 dígitos que pone el usuario
  verifyMfa(username: string, code: number): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/mfa/verify`, { username, code }).pipe(
      tap((res: AuthResponse) => {
        if (res && res.token && res.status === 'SUCCESS') {
          this.guardarSesion(res.token, res.username);
        }
      })
    );
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
      next: () => this.limpiarSesionLocal(),
      error: (err) => {
        console.error("Error en servidor al cerrar sesión", err);
        this.limpiarSesionLocal();
      }
    });
  }

  private guardarSesion(token: string, username: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
  }

  private limpiarSesionLocal(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }
}
