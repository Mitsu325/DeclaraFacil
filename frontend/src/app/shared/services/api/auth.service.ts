import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  forgotPassword(
    payload: any
  ): Observable<any> {
    const url = `${this.apiUrl}/auth/forgot-password`;

    return this.http.post<any>(url, payload);
  }

  resetPassword(
    payload: any
  ): Observable<any> {
    const url = `${this.apiUrl}/auth/reset-password`;

    return this.http.post<any>(url, payload);
  }
}
