import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getAPIUrl } from '../../pages/link/url';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  baseUrl = getAPIUrl('boutique');

  constructor(private http: HttpClient) {}

  getStats(): Observable<any> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any>(
      `${this.baseUrl}/dashboard`,
      { headers }
    );
  }
}
