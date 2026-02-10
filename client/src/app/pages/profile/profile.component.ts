import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/user/user.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profile: any = null;

  //changer de mot de passe
  currentPassword: string = '';
  newPassword: string = '';

  //changer les infos profile
  nom: string = '';
  prenom: string = '';
  phone: string = '';
  telephone: string = '+261'+this.phone;

  loading: boolean = false;
  error: string = '';
  success: string = '';

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.myProfile();
  }

  myProfile(): void {
    this.loading = true;
    this.error = '';

    this.userService.getProfile().subscribe({
      next: (response: any) => {
        if(response.success) {
          this.profile = response.data.user;
        }
      },
      error: (err) => {
        console.error(err);
        this.error = "Erreur lors de la récupération des boutiques validées.";
      }
    });
  }

  clickChangePassword(): void {
    this.error = '';
    this.success = '';

    if(confirm("Êtes-vous sûr de vouloir modifier votre mot de passe?")) {
      if (!this.currentPassword || !this.newPassword) {
        alert('Veuillez remplir tous les champs')
        return;
      }

      if (this.newPassword.length < 8) {
        alert('Le nouveau mot de passe doit contenir au moins 6 caractères')
        return;
      }

      if (this.currentPassword === this.newPassword) {
        alert('Le nouveau mot de passe doit être différent de l\'ancien')
        return;
      }

      this.loading = true;

      this.userService.changePassword(this.currentPassword, this.newPassword).subscribe({
        next: (response: any) => {
          this.loading = false;

          if (response.success) {
            alert('Votre mot de passe a été modifié avec succès')

            setTimeout(() => {
              this.currentPassword = '';
              this.newPassword = '';
              this.success = '';
            }, 2000);
          } else {
            alert(response.message || 'Erreur lors du changement de mot de passe');
          }
        },
        error: (err) => {
          this.loading = false;
          alert('Erreur changement mot de passe:'+err.message);
          console.error('Erreur changement mot de passe:', err);

          if (err.status === 401) {
            alert('Le mot de passe actuel est incorrect');
          } else if (err.status === 400) {
            alert('Données invalides');
          } else if (err.status === 0) {
            alert('Impossible de contacter le serveur. Vérifiez votre connexion.');
          } else {
            alert(err.error?.message || 'Une erreur est survenue. Veuillez réessayer.');
          }
        }
      });
    }
  }

  clickChangeProfile(): void {
    // this.error = '';
    if (confirm('Êtes-vous sûr de vouloir modifier votre profile ?')){
      this.userService.changeProfile(this.profile.nom, this.profile.prenom, this.profile.telephone).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.myProfile();
            return;
          }
        },
        error: (err) => {
          console.error(err);
          alert('Erreur lors de la modification: '+err.message);
        }
      })
    }

  }

}
