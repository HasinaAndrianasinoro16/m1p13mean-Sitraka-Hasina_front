import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../services/profile/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profile: any = null;
  loading: boolean = false;
  loadingAction: boolean = false;
  error: string = '';
  successMessage: string = '';

  // ── Formulaire Propriétaire ──
  editProprioNom: string = '';
  editProprioPrenom: string = '';
  editProprioTelephone: string = '';

  // ── Formulaire Mot de passe ──
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  showCurrentPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  // ── Formulaire Info Boutique ──
  editBoutiqueNom: string = '';
  editBoutiqueDescription: string = '';
  editBoutiqueTelephone: string = '';

  // ── Formulaire Contact Boutique ──
  editContactTelephone: string = '';
  editContactSiteWeb: string = '';
  editContactRue: string = '';
  editContactVille: string = '';
  editContactCodePostal: string = '';
  editContactPays: string = '';

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.error = '';

    this.profileService.getProfileBoutique().subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.success && res.data) {
          this.profile = res.data.boutique;
        }
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        this.error = 'Erreur lors du chargement du profil boutique.';
      }
    });
  }

  // ══════════════════════════════════════════════
  // ÉDITION PROPRIÉTAIRE
  // ══════════════════════════════════════════════

  openEditProprioModal(): void {
    this.editProprioNom = this.profile?.nom || '';
    this.editProprioPrenom = this.profile?.prenom || '';
    this.editProprioTelephone = this.profile?.telephone || '';
    this.error = '';
  }

  updateProprio(): void {
    if (!this.editProprioNom.trim() || !this.editProprioPrenom.trim()) {
      this.error = 'Le nom et le prénom sont obligatoires.';
      return;
    }

    this.loadingAction = true;
    this.error = '';

    this.profileService.updateProfileProprioBoutique(
      this.editProprioNom,
      this.editProprioPrenom,
      this.editProprioTelephone
    ).subscribe({
      next: (res: any) => {
        this.loadingAction = false;
        if (res.success) {
          this.showSuccess('Informations mises à jour avec succès !');
          this.closeModal('editProprioModal');
          this.loadProfile();
        }
      },
      error: (err) => {
        this.loadingAction = false;
        console.error(err);
        this.error = err?.error?.message || 'Erreur lors de la mise à jour.';
      }
    });
  }

  // ══════════════════════════════════════════════
  // CHANGEMENT MOT DE PASSE
  // ══════════════════════════════════════════════

  openChangePasswordModal(): void {
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.showCurrentPassword = false;
    this.showNewPassword = false;
    this.showConfirmPassword = false;
    this.error = '';
  }

  updatePassword(): void {
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.error = 'Tous les champs sont obligatoires.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.error = 'Les nouveaux mots de passe ne correspondent pas.';
      return;
    }

    if (this.newPassword.length < 6) {
      this.error = 'Le nouveau mot de passe doit contenir au moins 6 caractères.';
      return;
    }

    this.loadingAction = true;
    this.error = '';

    this.profileService.updateMotDePasse(
      this.currentPassword,
      this.newPassword
    ).subscribe({
      next: (res: any) => {
        this.loadingAction = false;
        if (res.success) {
          this.showSuccess('Mot de passe modifié avec succès !');
          this.closeModal('changePasswordModal');
          this.currentPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
        }
      },
      error: (err) => {
        this.loadingAction = false;
        console.error(err);
        this.error = err?.error?.message || 'Erreur lors du changement de mot de passe.';
      }
    });
  }

  // ══════════════════════════════════════════════
  // ÉDITION INFO BOUTIQUE
  // ══════════════════════════════════════════════

  openEditBoutiqueModal(): void {
    this.editBoutiqueNom = this.profile?.boutique?.nomBoutique || '';
    this.editBoutiqueDescription = this.profile?.boutique?.description || '';
    this.editBoutiqueTelephone = this.profile?.boutique?.telephone || '';
    this.error = '';
  }

  updateInfoBoutique(): void {
    if (!this.editBoutiqueNom.trim()) {
      this.error = 'Le nom de la boutique est obligatoire.';
      return;
    }

    this.loadingAction = true;
    this.error = '';

    this.profileService.updateInfoBoutique(
      this.editBoutiqueNom,
      this.editBoutiqueDescription,
      this.editBoutiqueTelephone
    ).subscribe({
      next: (res: any) => {
        this.loadingAction = false;
        if (res.success) {
          this.showSuccess('Informations boutique mises à jour !');
          this.closeModal('editBoutiqueModal');
          this.loadProfile();
        }
      },
      error: (err) => {
        this.loadingAction = false;
        console.error(err);
        this.error = err?.error?.message || 'Erreur lors de la mise à jour.';
      }
    });
  }

  // ══════════════════════════════════════════════
  // ÉDITION CONTACT BOUTIQUE
  // ══════════════════════════════════════════════

  openEditContactModal(): void {
    this.editContactTelephone = this.profile?.boutique?.telephone || '';
    this.editContactSiteWeb = this.profile?.boutique?.siteWeb || '';
    this.editContactRue = this.profile?.adresse?.rue || '';
    this.editContactVille = this.profile?.adresse?.ville || '';
    this.editContactCodePostal = this.profile?.adresse?.codePostal || '';
    this.editContactPays = this.profile?.adresse?.pays || '';
    this.error = '';
  }

  updateContactBoutique(): void {
    this.loadingAction = true;
    this.error = '';

    this.profileService.updateContactBoutique(
      this.editContactTelephone,
      this.editContactSiteWeb,
      this.editContactRue,
      this.editContactVille,
      this.editContactCodePostal,
      this.editContactPays
    ).subscribe({
      next: (res: any) => {
        this.loadingAction = false;
        if (res.success) {
          this.showSuccess('Contact boutique mis à jour !');
          this.closeModal('editContactModal');
          this.loadProfile();
        }
      },
      error: (err) => {
        this.loadingAction = false;
        console.error(err);
        this.error = err?.error?.message || 'Erreur lors de la mise à jour.';
      }
    });
  }

  // ══════════════════════════════════════════════
  // HELPERS
  // ══════════════════════════════════════════════

  getInitiales(): string {
    if (!this.profile?.boutique?.nomBoutique) return '?';
    return this.profile.boutique.nomBoutique
      .split(' ')
      .slice(0, 2)
      .map((w: string) => w[0])
      .join('')
      .toUpperCase() || '?';
  }

  getLogoColor(): string {
    const colors = ['#b84a14', '#1a4b8c', '#2d7a4f', '#6c3483', '#a07010', '#c02020'];
    const seed = this.profile?.boutique?.nomBoutique?.charCodeAt(0) || 0;
    return colors[seed % colors.length];
  }

  getRoleBadgeClass(): string {
    const role = this.profile?.role?.toLowerCase();
    if (role === 'admin') return 'badge-admin';
    if (role === 'vendeur') return 'badge-vendeur';
    return 'badge-default';
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

  closeModal(modalId: string): void {
    const modal = document.getElementById(modalId);
    if (modal) {
      const backdrop = document.querySelector('.modal-backdrop');
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
      if (backdrop) backdrop.remove();
    }
  }
}
