import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor'; // Ruta corregida según tu estructura de carpetas

export const appConfig: ApplicationConfig = {
  providers: [
    // MANTENEMOS TU CONFIGURACIÓN DE ZONE ORIGINAL
    provideZoneChangeDetection({ eventCoalescing: true }), 
    
    provideRouter(routes),
    
    // Configuramos el cliente HTTP para que soporte interceptores basados en clases
    provideHttpClient(withInterceptorsFromDi()), 
    
    // Registramos el interceptor de seguridad JWT
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
};