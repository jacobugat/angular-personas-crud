import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PersonaArchivo, PersonaNota, Resource } from '../models/resource.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly apiUrl = 'http://localhost:8080/api/personas';

  constructor(private http: HttpClient) { }

  getRecords(): Observable<Resource[]> {
    return this.http.get<Resource[]>(this.apiUrl);
  }

  createRecord(item: Resource): Observable<Resource> {
    return this.http.post<Resource>(this.apiUrl, item);
  }

  updateRecord(item: Resource): Observable<Resource> {
    return this.http.put<Resource>(`${this.apiUrl}/${item.id}`, item);
  }

  deleteRecord(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  createNote(personaId: number, texto: string): Observable<PersonaNota> {
    return this.http.post<PersonaNota>(`${this.apiUrl}/${personaId}/notas`, { texto });
  }

  updateNote(personaId: number, notaId: number, texto: string): Observable<PersonaNota> {
    return this.http.put<PersonaNota>(`${this.apiUrl}/${personaId}/notas/${notaId}`, { texto });
  }

  deleteNote(personaId: number, notaId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${personaId}/notas/${notaId}`);
  }

  uploadFile(personaId: number, archivo: File): Observable<PersonaArchivo> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    return this.http.post<PersonaArchivo>(`${this.apiUrl}/${personaId}/archivos`, formData);
  }

  deleteFile(personaId: number, archivoId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${personaId}/archivos/${archivoId}`);
  }

  getFileUrl(archivoId: number): string {
    return `${this.apiUrl}/archivos/${archivoId}/descargar`;
  }

  downloadFile(archivoId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/archivos/${archivoId}/descargar`, {
      responseType: 'blob'
    });
  }
}
