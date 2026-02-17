import { Injectable } from '@angular/core';
import {getAPIUrl} from "../../link/url";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BoutiqueService {

  baseUrl = getAPIUrl('catalogue');

  constructor(private http: HttpClient) { }

  getListeBoutique(page: number=1, limit: number =5): Observable<any>{
    return this.http.get(`${this.baseUrl}/boutiques?page=${page}&limit=${limit}`);
  }

}
