import { Injectable } from '@angular/core';
import {getAPIUrl} from "../../link/url";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  baseurl = getAPIUrl('admin');

  constructor(
    private http: HttpClient,
  ) {}

  getStats(): Observable <any> {
    const token = localStorage.getItem('token'); // récupère le token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.baseurl}/dashboard`, { headers });
  }

  getGraphSeptjour(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.baseurl}/dashboard/graphiques`, { headers });
  }

  getGraphPeriode(periode: string): Observable<any>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.baseurl}/dashboard/graphiques?periode=${periode}`, { headers });

  }

}
