import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {getAPIUrl} from "../link/url";
import {finalize} from "rxjs/operators";

@Component({
  selector: 'app-register-boutique',
  templateUrl: './register-boutique.component.html',
  styleUrls: ['./register-boutique.component.css']
})
export class RegisterBoutiqueComponent {

  nom: string = '';
  prenom: string = '';
  email: string = '';
  password: string = '';

  nomBoutique: string = '';
  descriptions: string = '';

  showPassword: boolean = false;
  isLoading: boolean = false;

  baseUrl = getAPIUrl('auth');


  constructor(private router: Router, private http: HttpClient) {}

  registerBoutique() {
    if (!this.email ||
      !this.password ||
      !this.nom ||
      !this.prenom ||
      !this.nomBoutique){
      alert('veuiller remplir les champs obligatoires');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      alert('Email invalide');
      return;
    }

    this.isLoading = true;

    const payload = {
      email: this.email,
      password: this.password,
      nom: this.nom,
      prenom: this.prenom,
      role: 'BOUTIQUE',
      boutique:{
        nomBoutique: this.nomBoutique,
        description: this.descriptions,
        categorie:'',
      }
    };

    this.http.post<any>(`${this.baseUrl}/register`, payload)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (res) => {
          if (!res.success) {
            alert(res.message || 'Erreur lors de l\' inscription');
            return;
          }

          alert(
            'Compte boutique créé avec succès.\n'+
            'votre compte doit être validé par un Administrateur.\n'+
            'contacter l\' administrateur pour plus de detail.'
          );

          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error(err);

          if (err.status === 400) {
            alert(err.error?.message || 'Données invalides');
          } else if (err.status === 0) {
            alert('Impossible de contacter le serveur');
          } else {
            alert('Erreur serveur, veuillez réessayer');
          }
        }
      });

  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }


}
