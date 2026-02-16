import { Component, OnInit } from '@angular/core';
import { AvisService } from '../../services/avis/avis.service';

@Component({
  selector: 'app-apreciations',
  templateUrl: './apreciations.component.html',
  styleUrls: ['./apreciations.component.css']
})
export class ApreciationsComponent implements OnInit {

  // Données
  avis: any[] = [];
  stats: any = null;
  boutiqueNom: string = '';

  // Pagination
  currentPage: number = 1;
  totalPages: number = 0;
  pages: number[] = [];

  // États globaux
  loading: boolean = false;
  error: string = '';

  // Réponse inline
  avisSelectionne: any = null;
  reponseTexte: string = '';
  reponseLoading: boolean = false;
  reponseError: string = '';

  constructor(private avisService: AvisService) {}

  ngOnInit(): void {
    this.loadAvis();
  }

  loadAvis(page: number = 1): void {
    this.loading = true;
    this.error = '';

    this.avisService.getBoutiqueAvis().subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.success && response.data) {
          const data     = response.data;
          this.avis      = data.avis || [];
          this.stats     = data.stats;
          const p        = data.pagination;
          this.currentPage = p.page;
          this.totalPages  = p.totalPages;
          this.pages       = Array.from({ length: this.totalPages }, (_, i) => i + 1);
          if (this.avis.length > 0) {
            this.boutiqueNom = this.avis[0].boutique?.nomBoutique || '';
          }
        }
      },
      error: () => {
        this.loading = false;
        this.error = 'Erreur lors du chargement des avis.';
      }
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.fermerReponse();
      this.loadAvis(page);
    }
  }

  // ── Ouvrir le formulaire de réponse ──
  ouvrirReponse(avis: any): void {
    // Toggle : si déjà ouvert sur le même avis → fermer
    if (this.avisSelectionne?._id === avis._id) {
      this.fermerReponse();
      return;
    }
    this.avisSelectionne = avis;
    // Pré-remplir si une réponse existe déjà (mode modification)
    this.reponseTexte   = avis.reponse?.contenu || '';
    this.reponseError   = '';
    this.reponseLoading = false;

    // Scroll vers le formulaire
    setTimeout(() => {
      const el = document.getElementById('form-' + avis._id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }

  // ── Fermer le formulaire ──
  fermerReponse(): void {
    this.avisSelectionne = null;
    this.reponseTexte    = '';
    this.reponseError    = '';
    this.reponseLoading  = false;
  }

  // ── Envoyer ou Modifier la réponse ──
  envoyerReponse(avis: any): void {
    if (!this.reponseTexte.trim()) {
      this.reponseError = 'La réponse ne peut pas être vide.';
      return;
    }

    this.reponseLoading = true;
    this.reponseError   = '';

    // ✅ Réponse existante → PUT (modifier), sinon → POST (créer)
    const request$ = avis.reponse?.contenu
      ? this.avisService.modifierReponse(avis._id, this.reponseTexte.trim())
      : this.avisService.repondreAvis(avis._id, this.reponseTexte.trim());

    request$.subscribe({
      next: (response: any) => {
        this.reponseLoading = false;

        if (response.success) {
          // Mise à jour locale immédiate sans rechargement
          const idx = this.avis.findIndex((a: any) => a._id === avis._id);
          if (idx !== -1) {
            this.avis[idx].reponse = {
              contenu: this.reponseTexte.trim(),
              date: new Date().toISOString()
            };
          }
          this.fermerReponse();
        }
      },
      error: (err) => {
        this.reponseLoading = false;
        this.reponseError = err?.error?.message || 'Erreur lors de l\'envoi de la réponse.';
      }
    });
  }

  // ── Helpers ──
  get noteMoyenne(): number { return this.stats?.noteMoyenne || 0; }
  get totalAvis(): number   { return this.stats?.totalAvis    || 0; }

  getNoteClass(note: number): string {
    if (note >= 4) return 'note-high';
    if (note >= 3) return 'note-mid';
    return 'note-low';
  }

  getStars(note: number): number[]      { return Array(note).fill(0); }
  getEmptyStars(note: number): number[] { return Array(5 - note).fill(0); }

  getBarWidth(count: number): number {
    return this.totalAvis ? Math.round((count / this.totalAvis) * 100) : 0;
  }

  getInitiales(client: any): string {
    if (!client) return '?';
    return ((client.prenom?.[0] || '') + (client.nom?.[0] || '')).toUpperCase() || '?';
  }

  getAvatarColor(client: any): string {
    const colors = ['#b84a14','#1a4b8c','#2d7a4f','#6c3483','#a07010','#1a6b8c'];
    return colors[(client?.nom?.charCodeAt(0) || 0) % colors.length];
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  }
}
