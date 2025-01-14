import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RequestsService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getRequests(): Observable<any> {
    return this.http.get(`${this.apiUrl}/requests`);
  }

  getUserRequests(): Observable<any> {
    return this.http.get(`${this.apiUrl}/requests/my-requests`);
  }

  getRequestsWithDeclarations(): Observable<any> {
    return this.http.get(`${this.apiUrl}/requests/with-declarations`);
  }

  getRequestsOverview(month: string, year: string): Observable<any> {
    const params = new HttpParams()
      .set('month', month)
      .set('year', year);

    return this.http.get(`${this.apiUrl}/requests/overview`, { params });
  }

  getRequestsByDeclaration(month: string, year: string): Observable<any> {
    const params = new HttpParams()
      .set('month', month)
      .set('year', year);

    return this.http.get(`${this.apiUrl}/requests/overview/by-declaration`, { params });
  }

  getRequestsByDay(month: string, year: string): Observable<any> {
    const params = new HttpParams()
      .set('month', month)
      .set('year', year);

    return this.http.get(`${this.apiUrl}/requests/daily`, { params });
  }

  generatePDF(requestIds: string[], directorId: string): Observable<any> {
    const url = `${this.apiUrl}/requests/generate-pdf`;

    const payload = {
      requestIds,
      directorId
    };

    return this.http.post<any>(url, payload);
  }

  updateStatus(
    requestIds: string[],
    status: 'rejected' | 'completed'
  ): Observable<any> {
    const url = `${this.apiUrl}/requests/update-status`;

    const payload = {
      requestIds: requestIds,
      status,
    };

    return this.http.patch<any>(url, payload);
  }

  createRequest(declarationId: string): Observable<any> {
    const url = `${this.apiUrl}/requests/create/${declarationId}`;

    return this.http.post<any>(url, {});
  }
}
