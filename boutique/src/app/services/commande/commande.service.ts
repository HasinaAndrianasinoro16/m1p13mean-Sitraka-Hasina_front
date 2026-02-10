import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getAPIUrl } from '../../pages/link/url';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {

  baseUrl = getAPIUrl('boutique');

  constructor(private http: HttpClient) { }

  getCommandes(page: number = 1, limit: number = 5): Observable<any> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(
      `${this.baseUrl}/commandes?page=${page}&limit=${limit}`,
      { headers }
    );
  }

  getDetailsCommandes(id: string): Observable<any>{
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(`${this.baseUrl}/commandes/${id}`, {headers});
  }

  confirmerCommande(id: string): Observable<any>{
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const Data ={
      statut: 'confirmee',
      commentaire: 'Stock verifie, commande confirmee'
    }

    return this.http.put(`${this.baseUrl}/commandes/${id}/statut`, Data, {headers});

  }
}
