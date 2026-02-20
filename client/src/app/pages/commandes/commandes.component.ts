import { Component, OnInit } from '@angular/core';
import { CommandeService } from '../../services/commande/commande.service';

@Component({
  selector: 'app-commandes',
  templateUrl: './commandes.component.html',
  styleUrls: ['./commandes.component.css']
})
export class CommandesComponent implements OnInit {

  commandes: any[] = [];

  loading: boolean = false;
  error: string = '';
  successMessage: string = '';

  // Confirmation inline
  confirmAnnulId: string | null = null;
  confirmReceptionId: string | null = null;
  confirmPaiementId: string | null = null;

  // Pagination
  currentPage: number = 1;
  limit: number = 10;
  totalPages: number = 0;
  pages: number[] = [];

  constructor(private commandeService: CommandeService) {}

  ngOnInit(): void {
    this.loadCommande(this.currentPage);
  }

  loadCommande(page: number): void {
    this.loading = true;
    this.error = '';

    this.commandeService.getListeCommandes(page, this.limit).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.success && res.data) {
          this.commandes = (Array.isArray(res.data.commandes)
            ? res.data.commandes : [])
            .filter((c: any) => c != null);

          const p = res.data.pagination;
          this.currentPage = p.page;
          this.totalPages = p.totalPages;
          this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        }
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        this.error = 'Erreur lors de la récupération des commandes.';
      }
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.loadCommande(page);
    }
  }

  // ── Annulation ──
  demanderAnnulation(id: string): void {
    this.confirmAnnulId = id;
  }

  annulerDemandeAnnulation(): void {
    this.confirmAnnulId = null;
  }

  confirmerAnnulation(id: string): void {
    this.confirmAnnulId = null;

    this.commandeService.annulerCommande(id).subscribe({
      next: (res: any) => {
        if (res.success) {
          const idx = this.commandes.findIndex((c: any) => c._id === id);
          if (idx !== -1) {
            this.commandes[idx] = { ...this.commandes[idx], statut: 'annulee' };
          }
          this.showSuccess('Commande annulée avec succès.');
        }
      },
      error: (err) => {
        console.error(err);
        this.error = err?.error?.message || 'Erreur lors de l\'annulation.';
      }
    });
  }

  // ── Réception ──
  demanderReception(id: string): void {
    this.confirmReceptionId = id;
  }

  annulerDemandeReception(): void {
    this.confirmReceptionId = null;
  }

  confirmerReception(id: string): void {
    this.confirmReceptionId = null;

    this.commandeService.confirmerReceptionCommande(id).subscribe({
      next: (res: any) => {
        if (res.success) {
          const idx = this.commandes.findIndex((c: any) => c._id === id);
          if (idx !== -1) {
            this.commandes[idx] = { ...this.commandes[idx], statut: 'livree' };
          }
          this.showSuccess('Commande réceptionnée avec succès.');
        }
      },
      error: (err) => {
        console.error(err);
        this.error = err?.error?.message || 'Erreur lors de la réception.';
      }
    });
  }

  // ── Paiement ──
  demanderPaiement(id: string): void {
    this.confirmPaiementId = id;
  }

  annulerDemandePaiement(): void {
    this.confirmPaiementId = null;
  }

  confirmerPaiement(id: string): void {
    this.confirmPaiementId = null;

    this.commandeService.payerCommande(id).subscribe({
      next: (res: any) => {
        if (res.success) {
          const idx = this.commandes.findIndex((c: any) => c._id === id);
          if (idx !== -1) {
            this.commandes[idx] = { ...this.commandes[idx], paiementStatut: 'paye' };
          }
          this.showSuccess('Paiement effectué avec succès.');
        }
      },
      error: (err) => {
        console.error(err);
        this.error = err?.error?.message || 'Erreur lors du paiement.';
      }
    });
  }

  // ── Helpers statut ──
  getStatutBadgeClass(statut: string): string {
    const m: { [k: string]: string } = {
      'en_attente': 'badge-attente',
      'confirmee': 'badge-confirmee',
      'en_preparation': 'badge-en-cours',
      'en_livraison': 'badge-en-cours',
      'livree': 'badge-livree',
      'annulee': 'badge-annulee'
    };
    return m[statut] || 'badge-attente';
  }

  getStatutTexte(statut: string): string {
    const m: { [k: string]: string } = {
      'en_attente': 'En attente',
      'confirmee': 'Confirmée',
      'en_preparation': 'En préparation',
      'en_livraison': 'En livraison',
      'livree': 'Livrée',
      'annulee': 'Annulée'
    };
    return m[statut] || statut;
  }

  getStatutIcon(statut: string): string {
    const m: { [k: string]: string } = {
      'en_attente': 'nc-watch-time',
      'confirmee': 'nc-check-2',
      'en_preparation': 'nc-box',
      'en_livraison': 'nc-delivery-fast',
      'livree': 'nc-check-2',
      'annulee': 'nc-simple-remove'
    };
    return m[statut] || 'nc-bullet-list-67';
  }

  canAnnuler(statut: string): boolean {
    return statut === 'en_attente';
  }

  canReceptionner(statut: string): boolean {
    return statut === 'en_livraison';
  }

  canPayer(statut: string, paiementStatut: string): boolean {
    return statut === 'livree' && paiementStatut === 'en_attente';
  }

  showVoirDetails(statut: string, paiementStatut: string): boolean {
    return !(this.canAnnuler(statut) || this.canReceptionner(statut) || this.canPayer(statut, paiementStatut));
  }

  showSuccess(msg: string): void {
    this.successMessage = msg;
    setTimeout(() => this.successMessage = '', 3500);
  }
}
