import { Injectable } from '@angular/core';
import {getAPIUrl} from "../../link/url";
import {HttpClient,HttpHeaders } from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProduitService {

  baseUrl = getAPIUrl('catalogue');

  constructor(private http: HttpClient) { }

  getListeProduits (): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/produits`);
  }

  getProduitInfo(id: string): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/produits/${id}`);
  }


}
