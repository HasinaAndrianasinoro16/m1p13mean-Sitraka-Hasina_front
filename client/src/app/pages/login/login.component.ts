import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { getAPIUrl } from "../../link/url";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email = '';
  password = '';
  showPassword = false;
  isLoading = false;

  baseUrl = getAPIUrl('auth');

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token && role === 'CLIENT') {
      this.router.navigate(['/']);
    } else {
      localStorage.clear();
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  login() {
    if (!this.email || !this.password) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      alert('Veuillez entrer un email valide');
      return;
    }

    this.isLoading = true;

    this.http.post<any>(`${this.baseUrl}/login`, {
      email: this.email,
      password: this.password
    })
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (res) => {
          if (!res.success) {
            alert(res.message || 'Erreur de connexion');
            return;
          }

          if (!res.data || !res.data.user) {
            alert('Erreur: données utilisateur manquantes');
            return;
          }

          const user = res.data.user;

          if (user.role !== 'CLIENT') {
            alert('Accès refusé : compte CLIENT requis');
            localStorage.clear();
            return;
          }

          if (res.token) {
            localStorage.setItem('token', res.token);
          }
          localStorage.setItem('role', user.role);
          localStorage.setItem('user', JSON.stringify(user));

          alert('connexion reussie');
          this.router.navigate(['/panier']).then(() => {
            console.log('Connexion réussie');
          });
        },
        error: (err) => {
          alert('Erreur de connexion: '+err.message);
          console.error('Erreur de connexion:', err);

          // Gestion des différents types d'erreurs
          if (err.status === 401) {
            alert('Email ou mot de passe incorrect');
          } else if (err.status === 0) {
            alert('Impossible de contacter le serveur. Vérifiez votre connexion.');
          } else if (err.error && err.error.message) {
            alert(err.error.message);
          } else {
            alert('Erreur serveur. Veuillez réessayer.');
          }
        }
      });
  }
}
