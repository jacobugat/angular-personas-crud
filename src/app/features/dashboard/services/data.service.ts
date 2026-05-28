import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClienteArchivo, ClienteNota, Resource } from '../models/resource.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly apiUrl = 'http://localhost:8080/api/clientes';

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

  createNote(clienteId: number, texto: string): Observable<ClienteNota> {
    return this.http.post<ClienteNota>(`${this.apiUrl}/${clienteId}/notas`, { texto });
  }

  updateNote(clienteId: number, notaId: number, texto: string): Observable<ClienteNota> {
    return this.http.put<ClienteNota>(`${this.apiUrl}/${clienteId}/notas/${notaId}`, { texto });
  }

  deleteNote(clienteId: number, notaId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${clienteId}/notas/${notaId}`);
  }

  uploadFile(clienteId: number, archivo: File): Observable<ClienteArchivo> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    return this.http.post<ClienteArchivo>(`${this.apiUrl}/${clienteId}/archivos`, formData);
  }

  deleteFile(clienteId: number, archivoId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${clienteId}/archivos/${archivoId}`);
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
