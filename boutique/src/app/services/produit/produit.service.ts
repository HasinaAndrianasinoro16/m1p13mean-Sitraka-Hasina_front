import { Injectable } from '@angular/core';
import {getAPIUrl} from "../../pages/link/url";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProduitService {

  baseUrl = getAPIUrl('boutique')

  constructor(private http: HttpClient) { }

  getProduitListe(page: number = 1, limit: number=10): Observable<any>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any>(`${this.baseUrl}/produits?page=${page}&limit=${limit}&active=true`, {headers});

  }

  getProduitInfo(id: String | undefined): Observable<any>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any>(`${this.baseUrl}/produits/${id}`, {headers});
  }

  createProduit(nom: string, description: string, prix: number, stock: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const produitData = {
      nom: nom,
      description: description,
      prix: prix,
      stock: stock
    };
    return this.http.post<any>(
      `${this.baseUrl}/produits`,
      produitData,
      { headers }
    );
  }
}
