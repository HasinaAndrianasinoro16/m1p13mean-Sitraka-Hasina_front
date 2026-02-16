import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  nom: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  // 🔥 Checkbox
  isBoutique: boolean = false;

  showPassword: boolean = false;
  isLoading: boolean = false;

  constructor(private router: Router) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  register() {

    if (!this.nom || !this.email || !this.password || !this.confirmPassword) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    // 🎯 Rôle selon la checkbox
    const role = this.isBoutique ? 'BOUTIQUE' : 'UTILISATEUR';

    this.isLoading = true;

    setTimeout(() => {
      this.isLoading = false;

      console.log('Compte créé :', {
        nom: this.nom,
        email: this.email,
        password: this.password,
        role: role
      });

      alert(`Compte ${role} créé avec succès 🎉`);

      this.router.navigate(['/achats']);
    }, 1500);
  }
}
