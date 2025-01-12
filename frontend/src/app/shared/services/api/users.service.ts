import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAdmin(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/admin`);
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/regular`);
  }

  searchUsers(filter: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/search`, {
      params: { filter },
    });
  }

  deleteUser(password: string): Observable<any> {
    const url = `${this.apiUrl}/users/inactivate`;

    const options = {
      body: { password },
    };

    return this.http.delete<any>(url, options);
  }
}
