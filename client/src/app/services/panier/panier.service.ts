import { Injectable } from '@angular/core';
import {getAPIUrl} from "../../link/url";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PanierService {

  baseUrl = getAPIUrl('panier')

  constructor(private http: HttpClient) { }

  getPanier() : Observable<any>{
    const token: string = localStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<any>(`${this.baseUrl}`, {headers});
  }

  ajoutPanier(produitId: string, quantite: number){
    const token: string = localStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const DataPanier = {
      produitId: produitId,
      quantite: quantite
    }

    return this.http.post(`${this.baseUrl}/items/`, DataPanier, {headers});

  }

  retirerProduit(id: string): Observable<any>{
    const token: string = localStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.delete<any>(`${this.baseUrl}/items/${id}`, {headers});
  }


  viderPanier(): Observable<any>{
    const token: string = localStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.delete<any>(`${this.baseUrl}`, {headers});
  }

  modifierQuantitePanier(idproduit: string, quantite: number): Observable<any>{
    const token: string = localStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const dataPanier={
      quantite : quantite,
    }

    return this.http.put(`${this.baseUrl}/items/${idproduit}`,dataPanier, {headers});

  }

}
