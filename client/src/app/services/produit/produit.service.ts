import { Injectable } from "@angular/core";
import { getAPIUrl } from "../../link/url";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ProduitService {
  baseUrl = getAPIUrl("catalogue");

  constructor(private http: HttpClient) {}

  getListeProduits(params?: any): Observable<any> {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach((key) => {
        if (
          params[key] !== null &&
          params[key] !== undefined &&
          params[key] !== ""
        ) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }

    return this.http.get<any>(`${this.baseUrl}/produits`, {
      params: httpParams,
    });
  }

  getProduitInfo(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/produits/${id}`);
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/categories`);
  }

  getBoutiques(): Observable<any> {
    return this.http.get(`${this.baseUrl}/boutiques`);
  }
}
