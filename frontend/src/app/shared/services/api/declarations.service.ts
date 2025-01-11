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

  getDeclarationsType(): Observable<any> {
    return this.http.get(`${this.apiUrl}/declarations/type`);
  }
}
