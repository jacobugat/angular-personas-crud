import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  /**
   * Paso 1: Login inicial. 
   * Si tu flujo requiere MFA, este paso normalmente solo valida usuario/password.
   */
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  /**
   * Paso 2: Verificación de MFA.
   * Según tu captura de pantalla, aquí es donde el backend responde con:
   * { status: "SUCCESS", message: "token_larguísimo", username: "jhon.sandoval" }
   */
  verificarMFA(username: string, codigo: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/validar-mfa/${username}/${codigo}`).pipe(
      tap((res: any) => {
        console.log('Respuesta de verificación recibida:', res);
        
        // CRÍTICO: Usamos 'res.message' porque es ahí donde viaja tu JWT
        if (res.status === 'SUCCESS' && res.message) { 
          localStorage.setItem('token', res.message);
          console.log('¡TOKEN GUARDADO EXITOSAMENTE!');
        } else {
          console.warn('La verificación fue exitosa pero no se recibió un token válido.');
        }
      })
    );
  }

  /**
   * Obtener el token para que el Interceptor pueda usarlo.
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Verificar si el usuario está autenticado.
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /**
   * Borrar rastro al salir.
   */
  logout(): void {
    localStorage.removeItem('token');
    console.log('Sesión cerrada y token eliminado.');
  }
}