import { Injectable } from '@angular/core';
import { getAPIUrl } from "../../pages/link/url";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AvisService {

  baseUrl = getAPIUrl('boutique');

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem("token");
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getBoutiqueAvis(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/avis`, {
      headers: this.getHeaders()
    });
  }

  repondreAvis(avisId: string, contenu: string): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/avis/${avisId}/reponse`,
      { contenu },
      { headers: this.getHeaders() }
    );
  }

  modifierReponse(avisId: string, contenu: string): Observable<any>{
    return this.http.put<any>(
      `${this.baseUrl}/avis/${avisId}/reponse`,
      { contenu },
      { headers: this.getHeaders() }
    );
  }

}
