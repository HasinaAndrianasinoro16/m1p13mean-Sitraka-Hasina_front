import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { getAPIUrl } from '../link/url';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  isLoading: boolean = false;

  baseUrl = getAPIUrl('auth');

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token && role === 'BOUTIQUE') {
      this.router.navigate(['/dashboard']);
    } else {
      localStorage.clear();
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  login(): void {

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
        finalize(() => this.isLoading = false)
      )
      .subscribe({

        next: (res) => {
          if (!res.success || !res.data?.user) {
            alert(res.message || 'Erreur de connexion');
            return;
          }

          const user = res.data.user;

          if (user.role !== 'BOUTIQUE') {
            alert('Accès refusé : compte boutique requis');
            localStorage.clear();
            return;
          }

          if (!user.boutique) {
            alert('Aucune boutique associée à ce compte');
            localStorage.clear();
            return;
          }

          if (!user.boutique.isValidated) {
            alert(
              'Votre boutique n’est pas encore validée.\n' +
              'Veuillez contacter l’administrateur.'
            );
            localStorage.clear();
            return;
          }

          localStorage.setItem('token', res.token);
          localStorage.setItem('role', user.role);
          localStorage.setItem('user', JSON.stringify(user));

          this.router.navigate(['/dashboard']);
        },

        error: (err) => {
          console.error('Erreur login:', err);

          if (err.status === 401) {
            alert('Email ou mot de passe incorrect');
          } else if (err.status === 0) {
            alert('Impossible de contacter le serveur');
          } else {
            alert(err.error?.message || 'Erreur serveur');
          }
        }
      });
  }
}
