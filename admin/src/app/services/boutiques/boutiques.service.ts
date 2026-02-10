import { Injectable } from '@angular/core';
import {getAPIUrl} from "../../link/url";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BoutiquesService {

  baseUrl = getAPIUrl('admin');

  constructor(private http: HttpClient) { }

  getBoutiquesEnAttente(page: number = 1, limit: number = 5): Observable<any> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(
      `${this.baseUrl}/boutiques/en-attente?page=${page}&limit=${limit}`,
      { headers }
    );
  }


  getBoutiquesValidee(page: number = 1,limit: number = 5 ): Observable<any> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.baseUrl}/boutiques/validees`, {headers});
  }

  getBoutiqueById(id: string | undefined): Observable<any>{
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.baseUrl}/boutiques/${id}`, {headers});
  }

  valideeboutique(id: string | undefined): Observable<any> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put(`${this.baseUrl}/boutiques/${id}/valider`,null, {headers});
  }

  rejeteBoutique(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const body = {
      raison: 'Boutique rejetée par l’administrateur'
    };

    return this.http.put<any>(
      `${this.baseUrl}/boutiques/${id}/rejeter`,
      body,
      { headers }
    );
  }


}
