import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {getAPIUrl} from "../../link/url";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = getAPIUrl('auth')

  constructor(private http: HttpClient) { }

  getProfile(): Observable<any>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.baseUrl}/me`, {headers});
  }

  changePassword(currentPassword: string, newPassword: string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })

    const newData = {
      currentPassword: currentPassword,
      newPassword: newPassword,
    }

    return this.http.put(`${this.baseUrl}/password`, newData, {headers});

  }

  changeProfile(nom: string, prenom: string, telephone: string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const profile = {
      nom: nom,
      prenom: prenom,
      telephone: telephone
    };

    return this.http.put(`${this.baseUrl}/profile`, profile, {headers});

  }

}
