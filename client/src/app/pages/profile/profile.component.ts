import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profile: any = null;

  // Changement mot de passe
  currentPassword: string = '';
  newPassword: string = '';

  // États
  loading: boolean = false;
  error: string = '';
  successMessage: string = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.error = '';

    this.userService.getProfile().subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.success && response.data) {
          this.profile = response.data.user;
        }
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        this.error = 'Erreur lors du chargement du profil.';
      }
    });
  }

  // ── Modification profil ──
  clickChangeProfile(): void {
    if (!this.profile.prenom?.trim() || !this.profile.nom?.trim()) {
      this.error = 'Le prénom et le nom sont obligatoires.';
      return;
    }

    this.loading = true;
    this.error = '';

    this.userService.changeProfile(
      this.profile.nom,
      this.profile.prenom,
      this.profile.telephone
    ).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.success) {
          this.showSuccess('Profil mis à jour avec succès !');
          this.closeModal('editProfileModal');
          this.loadProfile();
        }
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        this.error = err?.error?.message || 'Erreur lors de la modification du profil.';
      }
    });
  }

  // ── Changement mot de passe ──
  clickChangePassword(): void {
    this.error = '';

    if (!this.currentPassword || !this.newPassword) {
      this.error = 'Veuillez remplir tous les champs.';
      return;
    }

    if (this.newPassword.length < 8) {
      this.error = 'Le nouveau mot de passe doit contenir au moins 8 caractères.';
      return;
    }

    if (this.currentPassword === this.newPassword) {
      this.error = 'Le nouveau mot de passe doit être différent de l\'ancien.';
      return;
    }

    this.loading = true;

    this.userService.changePassword(this.currentPassword, this.newPassword).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.success) {
          this.showSuccess('Mot de passe modifié avec succès !');
          this.currentPassword = '';
          this.newPassword = '';
          this.closeModal('changePasswordModal');
        }
      },
      error: (err) => {
        this.loading = false;
        console.error(err);

        if (err.status === 401) {
          this.error = 'Le mot de passe actuel est incorrect.';
        } else if (err.status === 400) {
          this.error = 'Données invalides.';
        } else {
          this.error = err?.error?.message || 'Erreur lors du changement de mot de passe.';
        }
      }
    });
  }

  // ── Helpers ──
  getInitiales(): string {
    if (!this.profile) return '?';
    const p = this.profile.prenom?.[0] || '';
    const n = this.profile.nom?.[0] || '';
    return (p + n).toUpperCase() || '?';
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  showSuccess(msg: string): void {
    this.successMessage = msg;
    setTimeout(() => (this.successMessage = ''), 3500);
  }

  closeModal(id: string): void {
    const modal = document.getElementById(id);
    if (modal) {
      const backdrop = document.querySelector('.modal-backdrop');
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
      if (backdrop) backdrop.remove();
    }
  }
}
