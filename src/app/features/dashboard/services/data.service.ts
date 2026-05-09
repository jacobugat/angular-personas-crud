import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Resource } from '../models/resource.model'; // Solo un nivel arriba

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
}