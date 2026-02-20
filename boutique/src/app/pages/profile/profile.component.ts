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
  error: string = '';
  successMessage: string = '';

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

  // ── Helpers ──
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
}
