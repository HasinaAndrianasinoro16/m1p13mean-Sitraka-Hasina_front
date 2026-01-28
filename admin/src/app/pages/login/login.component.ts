import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  rememberMe: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private router: Router) {}

  login() {
    // Empêcher le clic multiple pendant le chargement
    if (this.isLoading) return;

    // Réinitialiser le message d'erreur
    this.errorMessage = '';

    // Validation des champs
    if (!this.email || !this.password) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Veuillez entrer une adresse email valide';
      return;
    }

    // Activation de l'état de chargement
    this.isLoading = true;

    // Simulation de connexion avec délai (remplacer par un vrai appel API)
    setTimeout(() => {
      try {
        // Ici, vous ferez appel à votre service d'authentification
        console.log('Tentative de connexion avec:', {
          email: this.email,
          rememberMe: this.rememberMe
        });

        // Simuler une réponse du serveur
        const mockUsers = [
          { email: 'admin@commercialshop.com', password: 'admin123', role: 'admin' },
          { email: 'boutique@commercialshop.com', password: 'boutique123', role: 'boutique' }
        ];

        const user = mockUsers.find(u =>
          u.email === this.email && u.password === this.password
        );

        if (user) {
          console.log('Connexion réussie pour:', user.role);

          // Sauvegarder dans localStorage si "Se souvenir de moi" est coché
          if (this.rememberMe) {
            localStorage.setItem('rememberedEmail', this.email);
          } else {
            localStorage.removeItem('rememberedEmail');
          }

          // Simuler la sauvegarde du token (à remplacer par votre token réel)
          localStorage.setItem('auth_token', 'mock-jwt-token-' + Date.now());
          localStorage.setItem('user_role', user.role);
          localStorage.setItem('user_email', this.email);

          // Redirection selon le rôle (à adapter selon votre logique)
          if (user.role === 'admin') {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/boutique/dashboard']);
          }
        } else {
          this.errorMessage = 'Email ou mot de passe incorrect';
          this.isLoading = false;
        }
      } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
        this.isLoading = false;
      }
    }, 1500); // Simuler un délai réseau
  }

  // goToRegister() {
  //   this.router.navigate(['/register']);
  // }
  //
  // forgotPassword() {
  //   // Redirection vers la page de réinitialisation de mot de passe
  //   this.router.navigate(['/forgot-password']);
  // }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  ngOnInit() {
    // Remplir automatiquement l'email si "Se souvenir de moi" était coché
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      this.email = rememberedEmail;
      this.rememberMe = true;
    }

    // Rediriger si déjà connecté
    const authToken = localStorage.getItem('auth_token');
    if (authToken) {
      const userRole = localStorage.getItem('user_role');
      if (userRole === 'admin') {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/boutique/dashboard']);
      }
    }
  }

  // Méthode pour gérer la touche Enter
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.login();
    }
  }
}
