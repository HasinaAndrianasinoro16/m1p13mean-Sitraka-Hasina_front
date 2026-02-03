import { Injectable } from '@angular/core';
import {getAPIUrl} from "../../pages/link/url";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, switchMap} from "rxjs";

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

  // Version simplifiée (corrections minimales)

  newAjoutStock(id: string, currentStock: number, stock: number): Observable<any> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const newStock = currentStock + stock;

    const stockData = {
      stock: newStock,
      seuilAlerte: 5
    };

    return this.http.put<any>(
      `${this.baseUrl}/produits/${id}/stock`,
      stockData,
      { headers }
    );
  }



  //ne fonctione pas reste la pour inspiration
  ajoutStock(id: string, stock: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.getProduitInfo(id).pipe(
      switchMap((response: any) => {

        const stockActuel = response.data.produit.stock ?? 0;
        const newStock = stockActuel + stock;

        const dataStock = {
          stock: newStock,
          seuilAlerte: 5
        };

        return this.http.put<any>(
          `${this.baseUrl}/produits/${id}/stock`,
          dataStock,
          { headers }
        );
      })
    );
  }


}
