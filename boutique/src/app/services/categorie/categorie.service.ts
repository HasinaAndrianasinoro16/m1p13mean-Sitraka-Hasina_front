import { Injectable } from '@angular/core';
import {getAPIUrl} from "../../pages/link/url";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CategorieService {

  baseUrl = getAPIUrl('catalogue');

  constructor(private http: HttpClient) { }

  getCategorieListe(): Observable<any>{
    return this.http.get<Observable<any>>(`${this.baseUrl}/categories`);
  }

}
