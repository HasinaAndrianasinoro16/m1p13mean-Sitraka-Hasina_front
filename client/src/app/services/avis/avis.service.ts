import { Injectable } from '@angular/core';
import { getAPIUrl } from '../../link/url';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvisService {

  baseUrl = getAPIUrl('avis');

  constructor(private http: HttpClient) {}

  getAvisBoutiquePublic(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/boutique/${id}`);
  }

  sendAvisBoutique(id: string, note: number, commentaire: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const data = {
      boutiqueId: id,
      note: note,
      commentaire: commentaire
    };

    return this.http.post(`${this.baseUrl}`, data, { headers });
  }

  modifierAvisBoutique(avisId: string, note: number, commentaire: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const data = {
      note: note,
      commentaire: commentaire
    };

    return this.http.put(`${this.baseUrl}/${avisId}`, data, { headers });
  }

  supprimerAvisBoutique(avisId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete(`${this.baseUrl}/${avisId}`, { headers });
  }
}
