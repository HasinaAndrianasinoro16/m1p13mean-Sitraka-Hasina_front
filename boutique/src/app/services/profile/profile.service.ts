import { Injectable } from '@angular/core';
import {getAPIUrl} from "../../pages/link/url";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  baseUrl = getAPIUrl('boutique');
  baseUrlprofile = getAPIUrl('auth');

  constructor(private http: HttpClient) { }

  getProfileBoutique(): Observable<any>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any>(`${this.baseUrl}/profil`, {headers});

  }

  updateProfileProprioBoutique(nom: string, prenom: string, telephone: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const body = {
      nom: nom,
      prenom: prenom,
      telephone: telephone
    }

    return this.http.put<any>(`${this.baseUrlprofile}/profile`, body, {headers});

  }

  updateMotDePasse(currentPassword: string, newPassword: string) : Observable<any>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const body = {
      currentPassword: currentPassword,
      newPassword: newPassword
    }

    return this.http.put<any>(`${this.baseUrlprofile}/password`, body, {headers});

  }

  updateInfoBoutique(nomBoutique: string, description: string, telephone:string): Observable<any>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const body = {
        nomBoutique: nomBoutique,
        description: description,
        telephone: telephone
    }

    return this.http.put<any>(`${this.baseUrl}/informations`, body, {headers});

  }

  updateContactBoutique(telephone:string, siteweb: string, rue:string,ville: string, codePostal: string, pays: string): Observable<any>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const body = {
      telephone: telephone,
      siteWeb: siteweb,
      adresse: {
        rue: rue,
        ville: ville,
        codePostal: codePostal,
        pays: pays
      }
    }

    return this.http.put<any>(`${this.baseUrl}/contact`, body, {headers});

  }

}
