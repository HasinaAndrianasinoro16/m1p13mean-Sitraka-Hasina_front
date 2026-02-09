import { Injectable } from '@angular/core';
import {getAPIUrl} from "../../pages/link/url";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  baseUrl = getAPIUrl('boutique');

  constructor(private http: HttpClient) { }

  getProfileBoutique(): Observable<any>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any>(`${this.baseUrl}/profil`, {headers});

  }

}
