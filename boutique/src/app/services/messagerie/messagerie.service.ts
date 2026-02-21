import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import {getAPIUrl} from "../../pages/link/url";

@Injectable({
  providedIn: 'root'
})
export class MessagerieService {

  baseUrl = getAPIUrl('boutique/chat');

  constructor(private http: HttpClient) { }


  listerMesConversations(page: number = 1, limit: number = 100): Observable<any> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`${this.baseUrl}/conversations?page=${page}&limit=${limit}`, { headers });
  }

  detailsConvPlusMessage(idConv: string, page: number = 1, limit: number = 50): Observable<any> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    // Correction de l'URL - enlevé le doublon de page
    return this.http.get(`${this.baseUrl}/conversations/${idConv}?page=${page}&limit=${limit}`, { headers });
  }

  envoyerMessage(idConv: string, content: string): Observable<any> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const body = {
      content: content,
    };

    return this.http.post(`${this.baseUrl}/conversations/${idConv}/messages`, body, { headers });
  }

  marquerCommeLue(idConv: string): Observable<any> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    // Correction de l'URL - enlevé l'accolade fermante en trop
    return this.http.put(`${this.baseUrl}/conversations/${idConv}/read`, null, { headers });
  }

  rechercherDansMesConversation(q: string, page: number = 1, limit: number = 20): Observable<any> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`${this.baseUrl}/conversations/search?q=${q}&page=${page}&limit=${limit}`, { headers });
  }
}
