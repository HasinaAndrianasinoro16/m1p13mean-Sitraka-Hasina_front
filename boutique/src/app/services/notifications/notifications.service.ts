import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import contains from "@popperjs/core/lib/dom-utils/contains";
import {Observable} from "rxjs";
import {getAPIUrl} from "../../pages/link/url";

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  baseUrl = getAPIUrl('notifications');

  constructor(private http: HttpClient) { }

  getListeNotifications(page: number =1, limit: number = 5): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any>(`${this.baseUrl}?page=${page}&limit=${limit}`, {headers});
  }

  getCompteurNonLue(): Observable<any>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<any>(`${this.baseUrl}/count`, {headers});
  }

  toutMarquerLue():Observable<any>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.put<any>(`${this.baseUrl}/read-all`,null, {headers});

  }

  supprimerNotification(id: string): Observable<any>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.delete<any>(`${this.baseUrl}/${id}`, {headers});

  }


}
