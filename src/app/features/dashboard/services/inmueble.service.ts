import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inmueble, TipoInmueble } from '../models/inmueble.model';

@Injectable({
  providedIn: 'root'
})
export class InmuebleService {
  private readonly apiUrl = 'http://localhost:8080/api/inmuebles';

  constructor(private http: HttpClient) {}

  getInmuebles(filtros?: { ciudad?: string; tipo?: TipoInmueble | ''; precioMax?: number | null }): Observable<Inmueble[]> {
    let params = new HttpParams();

    if (filtros?.ciudad) params = params.set('ciudad', filtros.ciudad);
    if (filtros?.tipo) params = params.set('tipo', filtros.tipo);
    if (filtros?.precioMax) params = params.set('precioMax', filtros.precioMax);

    return this.http.get<Inmueble[]>(this.apiUrl, { params });
  }

  createInmueble(inmueble: Inmueble): Observable<Inmueble> {
    return this.http.post<Inmueble>(this.apiUrl, inmueble);
  }

  updateInmueble(inmueble: Inmueble): Observable<Inmueble> {
    return this.http.put<Inmueble>(`${this.apiUrl}/${inmueble.id}`, inmueble);
  }
}
