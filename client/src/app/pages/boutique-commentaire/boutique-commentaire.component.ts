import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AvisService } from '../../services/avis/avis.service';
import {UserService} from "../../services/user/user.service";

@Component({
  selector: 'app-boutique-commentaire',
  templateUrl: './boutique-commentaire.component.html',
  styleUrls: ['./boutique-commentaire.component.css']
})
export class BoutiqueCommentaireComponent implements OnInit {

  boutiqueId: string = this.route.snapshot.queryParamMap.get('id');
  myId: string = '';

  stats: any = null;
  avis: any[] = [];

  loading: boolean = false;
  error: string = '';
  successMessage: string = '';

  currentPage: number = 1;
  limit: number = 10;
  totalPages: number = 0;
  pages: number[] = [];

  showForm: boolean = false;
  editMode: boolean = false;
  editAvisId: string = '';
  noteSelect: number = 5;
  commentaireText: string = '';

  constructor(
    private route: ActivatedRoute,
    private avisService: AvisService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
      if (this.boutiqueId) {
        this.loadAvis();
      }
      this.myProfile();

  }

  myProfile(): void {
    this.loading = true;
    this.error = '';

    this.userService.getProfile().subscribe({
      next: (response: any) => {
        if(response.success) {
          this.myId = response.data.user._id;
        }
      }
    });
  }

  loadAvis(): void {
    if (!this.boutiqueId) return;

    this.loading = true;
    this.error = '';

    this.avisService.getAvisBoutiquePublic(this.boutiqueId).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.success && response.data) {
          this.stats = response.data.stats || null;
          this.avis = Array.isArray(response.data.avis)
            ? response.data.avis.filter((a: any) => a != null) : [];

          const p = response.data.pagination;
          this.currentPage = p.page;
          this.totalPages = p.totalPages;
          this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        }
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        this.error = 'Erreur lors du chargement des avis.';
      }
    });
  }

  ouvrirFormulaire(): void {
    this.showForm = true;
    this.editMode = false;
    this.editAvisId = '';
    this.noteSelect = 5;
    this.commentaireText = '';
  }

  fermerFormulaire(): void {
    this.showForm = false;
    this.editMode = false;
    this.editAvisId = '';
    this.noteSelect = 5;
    this.commentaireText = '';
  }

  ouvrirModification(avis: any): void {
    this.showForm = true;
    this.editMode = true;
    this.editAvisId = avis._id;
    this.noteSelect = avis.note;
    this.commentaireText = avis.commentaire;
  }

  envoyerAvis(): void {
    if (!this.commentaireText.trim()) {
      this.error = 'Veuillez saisir un commentaire.';
      return;
    }

    this.loading = true;
    this.error = '';

    const request$ = this.editMode
      ? this.avisService.modifierAvisBoutique(this.editAvisId, this.noteSelect, this.commentaireText.trim())
      : this.avisService.sendAvisBoutique(this.boutiqueId, this.noteSelect, this.commentaireText.trim());

    request$.subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.success) {
          this.showSuccess(this.editMode ? 'Avis modifié avec succès !' : 'Avis ajouté avec succès !');
          this.fermerFormulaire();
          this.loadAvis(); // Recharger la liste
        }
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        this.error = err?.error?.message || 'Erreur lors de l\'envoi de l\'avis.';
      }
    });
  }

  supprimerAvis(avisId: string): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) return;

    this.avisService.supprimerAvisBoutique(avisId).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.showSuccess('Avis supprimé avec succès.');
          this.loadAvis();
        }
      },
      error: (err) => {
        console.error(err);
        this.error = err?.error?.message || 'Erreur lors de la suppression.';
      }
    });
  }

  getStars(note: number): number[] {
    return Array(note).fill(0);
  }

  getEmptyStars(note: number): number[] {
    return Array(5 - note).fill(0);
  }

  getInitiales(client: any): string {
    if (!client) return '?';
    const p = client.prenom?.[0] || '';
    const n = client.nom?.[0] || '';
    return (p + n).toUpperCase() || '?';
  }

  getAvatarColor(client: any): string {
    const colors = ['#b84a14', '#1a4b8c', '#2d7a4f', '#6c3483', '#a07010', '#c02020'];
    const seed = client?.nom?.charCodeAt(0) || 0;
    return colors[seed % colors.length];
  }

  getNoteClass(note: number): string {
    if (note >= 4) return 'note-high';
    if (note >= 2) return 'note-mid';
    return 'note-low';
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  showSuccess(msg: string): void {
    this.successMessage = msg;
    setTimeout(() => (this.successMessage = ''), 3500);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadAvis();
    }
  }
}
