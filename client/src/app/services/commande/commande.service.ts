import { Injectable } from '@angular/core';
import {getAPIUrl} from "../../link/url";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CommandeService {

  baseUrl = getAPIUrl('commandes')

  constructor(private http: HttpClient) { }

  getListeCommandes(page: number = 1, limit: number = 5): Observable<any> {
    const token: string = localStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get(`${this.baseUrl}?page=${page}&limit=${limit}`, {headers});
  }

  getDetailsCommandes(id: string): Observable<any>{
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(`${this.baseUrl}/${id}`, {headers});
  }

  passerCommande(nom: string, prenom: string, telephone: string, rue: string, instruction: string): Observable<any>{
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const data = {
      adresseLivraison: {
        nom: nom,
        prenom: prenom,
        telephone: '+261'+telephone,
        rue: rue,
        ville: 'Antananarivo',
        codePostal: '101',
        pays: 'Madagascar',
        instructions: instruction
      },
      modePaiement: "livraison"
    }

    return this.http.post(`${this.baseUrl}`,data, {headers});

  }

  annulerCommande (id: string): Observable<any>{
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const data = {
      raison: 'Je ne veux plus de cette commande'
    };

    return this.http.put(`${this.baseUrl}/${id}/annuler`, data, {headers});

  }

}
