import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {getAPIUrl} from "../../link/url";
import {HttpClient} from "@angular/common/http";
import {finalize} from "rxjs/operators";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  nom: string = '';
  prenom: string = '';
  telephone: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  baseUrl = getAPIUrl('auth')

  // 🔥 Checkbox
  isBoutique: boolean = false;

  showPassword: boolean = false;
  isLoading: boolean = false;

  constructor(private router: Router, private http: HttpClient) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  register() {
    if (!this.email ||
      !this.password ||
      !this.nom ||
      !this.prenom ||
      !this.telephone){
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
      role: 'CLIENT',
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

          alert('Compte boutique créé avec succès.\n');

          this.router.navigate(['/profile']);
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

  // register() {
  //
  //   if (!this.nom || !this.email || !this.password || !this.confirmPassword) {
  //     alert('Veuillez remplir tous les champs');
  //     return;
  //   }
  //
  //   if (this.password !== this.confirmPassword) {
  //     alert('Les mots de passe ne correspondent pas');
  //     return;
  //   }
  //
  //   // 🎯 Rôle selon la checkbox
  //   const role = this.isBoutique ? 'BOUTIQUE' : 'UTILISATEUR';
  //
  //   this.isLoading = true;
  //
  //   setTimeout(() => {
  //     this.isLoading = false;
  //
  //     console.log('Compte créé :', {
  //       nom: this.nom,
  //       email: this.email,
  //       password: this.password,
  //       role: role
  //     });
  //
  //     alert(`Compte ${role} créé avec succès 🎉`);
  //
  //     this.router.navigate(['/profile']);
  //   }, 500);
  // }
}
