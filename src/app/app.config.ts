import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
// Importamos el nombre exacto que aparece en la terminal: authInterceptor
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    
    provideRouter(routes),
    
    // Al ser una función interceptora, usamos withInterceptors
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};