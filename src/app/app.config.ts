import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Mantenemos Zone para que la pantalla se actualice al escribir
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    // Habilitamos HttpClient para conectar con tu Java en el puerto 8080
    provideHttpClient()
  ]
};