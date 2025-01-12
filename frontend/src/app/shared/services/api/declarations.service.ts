import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DeclarationsService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getDeclarations(): Observable<any> {
    return this.http.get(`${this.apiUrl}/declarations`);
  }

  getDeclaration(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/declarations/${id}`);
  }

  getDeclarationsType(): Observable<any> {
    return this.http.get(`${this.apiUrl}/declarations/type`);
  }

  createDeclaration(
    payload: any
  ): Observable<any> {
    const url = `${this.apiUrl}/declarations`;

    return this.http.post<any>(url, payload);
  }

  updateDeclaration(
    id: string,
    payload: any
  ): Observable<any> {
    const url = `${this.apiUrl}/declarations/${id}`;

    return this.http.patch<any>(url, payload);
  }

  deleteDeclaration(
    id: string
  ): Observable<any> {
    const url = `${this.apiUrl}/declarations/${id}`;

    return this.http.delete<any>(url);
  }
}
