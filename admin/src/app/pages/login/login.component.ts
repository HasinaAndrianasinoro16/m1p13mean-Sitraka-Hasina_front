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

    if (token && role === 'ADMIN') {
      this.router.navigate(['/dashboard']);
    } else {
      localStorage.clear();
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  login() {
    // Validation des champs
    if (!this.email || !this.password) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    // Validation format email
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
          // S'exécute toujours, même en cas d'erreur
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (res) => {
          // Vérification de la réponse
          if (!res.success) {
            alert(res.message || 'Erreur de connexion');
            return;
          }

          // Vérification de la structure de données
          if (!res.data || !res.data.user) {
            alert('Erreur: données utilisateur manquantes');
            return;
          }

          const user = res.data.user;

          // ❌ PAS ADMIN → REFUS
          if (user.role !== 'ADMIN') {
            alert('Accès refusé : compte administrateur requis');
            localStorage.clear();
            return;
          }

          // ✅ ADMIN OK - Stockage sécurisé
          if (res.token) {
            localStorage.setItem('token', res.token);
          }
          localStorage.setItem('role', user.role);
          localStorage.setItem('user', JSON.stringify(user));

          // Redirection vers dashboard
          this.router.navigate(['/dashboard']).then(() => {
            // Message de succès après navigation
            console.log('Connexion réussie');
          });
        },
        error: (err) => {
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
