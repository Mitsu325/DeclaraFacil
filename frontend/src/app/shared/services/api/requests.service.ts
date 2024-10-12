import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RequestsService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getRequests(): Observable<any> {
    return this.http.get(`${this.apiUrl}/requests`);
  }

  getUserRequests(): Observable<any> {
    return this.http.get(`${this.apiUrl}/requests/my-requests`);
  }

  getRequestsWithDeclarations(): Observable<any> {
    return this.http.get(`${this.apiUrl}/requests/with-declarations`);
  }

  generatePDF(requestIds: string[]): Observable<any> {
    const url = `${this.apiUrl}/requests/generate-pdf`;

    const payload = {
      requestIds: requestIds,
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
