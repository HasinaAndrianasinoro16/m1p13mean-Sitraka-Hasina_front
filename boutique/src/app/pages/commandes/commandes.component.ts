import { Component, OnInit } from '@angular/core';
import { CommandeService } from '../../services/commande/commande.service';

@Component({
  selector: 'app-commandes',
  templateUrl: './commandes.component.html',
  styleUrls: ['./commandes.component.css']
})
export class CommandesComponent implements OnInit {

  commandes: any[] = [];

  currentPage: number = 1;
  limit: number       = 5;
  totalPages: number  = 0;
  pages: number[]     = [];

  loading: boolean = false;
  error: string    = '';

  constructor(private commandeService: CommandeService) {}

  ngOnInit(): void {
    this.loadCommandes(this.currentPage);
  }

  loadCommandes(page: number): void {
    this.loading = true;
    this.error   = '';

    this.commandeService.getCommandes(page, this.limit).subscribe({
      next: (response: any) => {
        this.loading = false;

        if (response.success && response.data) {
          this.commandes = (Array.isArray(response.data.commandes)
            ? response.data.commandes : [])
            .filter((c: any) => c != null);

          const pagination = response.data.pagination;
          this.currentPage = pagination.page;
          this.totalPages  = pagination.totalPages;
          this.pages       = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Erreur chargement commandes:', err);
        this.error = 'Erreur lors du chargement des commandes';
      }
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.loadCommandes(page);
    }
  }

  refresh(): void {
    this.loadCommandes(this.currentPage);
  }

  getStatutBadgeClass(statut: string): string {
    const classes: { [key: string]: string } = {
      'en_attente':    'badge-attente',
      'confirmee':     'badge-confirmee',
      'en_preparation':'badge-en-cours',
      'en_livraison':  'badge-en-cours',
      'expediee':     'badge-en-cours',
      'livree':        'badge-livree',
      'annulee':       'badge-annulee'
    };
    return classes[statut] || 'badge-attente';
  }

  getStatutTexte(statut: string): string {
    const textes: { [key: string]: string } = {
      'en_attente':    'En attente',
      'confirmee':     'Confirmée',
      'en_preparation':'En préparation',
      'expediee':      'Expediée',
      'en_livraison':  'En livraison',
      'livree':        'Livrée',
      'annulee':       'Annulée'
    };
    return textes[statut] || statut;
  }

  getStatutIcon(statut: string): string {
    const icons: { [key: string]: string } = {
      'en_attente':    'nc-watch-time',
      'confirmee':     'nc-check-2',
      'en_preparation':'nc-box',
      'expediee':     'nc-delivery-fast',
      'en_livraison':  'nc-delivery-fast',
      'livree':        'nc-check-2',
      'annulee':       'nc-simple-remove'
    };
    return icons[statut] || 'nc-bullet-list-67';
  }


  getInitiales(client: any): string {
    if (!client) return '?';
    const p = client.prenom?.[0] || client.nomComplet?.[0] || '';
    const n = client.nom?.[0]    || client.nomComplet?.[1] || '';
    return (p + n).toUpperCase() || '?';
  }

  getAvatarColor(client: any): string {
    const colors = ['#b84a14','#1a4b8c','#2d7a4f','#6c3483','#a07010','#1a6b8c'];
    const seed   = client?.nom?.charCodeAt(0)
      || client?.nomComplet?.charCodeAt(0)
      || 0;
    return colors[seed % colors.length];
  }


  clickConfirmerCommande(id: string): void {
    if (!id) {
      this.error = 'Commande introuvable';
      return;
    }

    this.commandeService.confirmerCommande(id).subscribe({
      next: (response: any) => {
        if (response.success) {
          const idx = this.commandes.findIndex((c: any) => c._id === id);
          if (idx !== -1) {
            this.commandes[idx] = { ...this.commandes[idx], statut: 'confirmee' };
          }
        }
      },
      error: (err) => {
        console.error('Erreur confirmation:', err);
        this.error = err?.error?.message || 'Erreur lors de la confirmation';
      }
    });
  }

  clickPreparerCommande(id: string): void {
    if (!id) {
      this.error = 'Commande introuvable';
      return;
    }

    this.commandeService.preparerCommande(id).subscribe({
      next: (response: any) => {
        if (response.success) {
         alert('la commande est en cours de preparation');
         this.loadCommandes(this.currentPage);
        }
      },
      error: (err) => {
        console.error('Erreur preparation:', err);
        this.error = err?.error?.message || 'Erreur lors de la preparation';
      }
    });
  }

  clickExpedierCommande(id: string): void {
    if (!id) {
      this.error = 'Commande introuvable';
      return;
    }

    this.commandeService.expedierCommande(id).subscribe({
      next: (response: any) => {
        if (response.success) {
          alert('votre commande a été expédier');
          this.loadCommandes(this.currentPage);
        }
      },
      error: (err) => {
        console.error('Erreur expédition:', err);
        this.error = err?.error?.message || 'Erreur lors de la expédition';
      }
    })
  }

  clickLivrerCommande(id: string): void {
    if (!id) {
      this.error = 'Commande introuvable';
      return;
    }

    this.commandeService.livrerCommande(id).subscribe({
      next: (response: any) => {
        if (response.success) {
          alert('la commande a été livrer');
          this.loadCommandes(this.currentPage);
        }
      },
      error: (err) => {
        console.error('Erreur livraison:', err);
        this.error = err?.error?.message || 'Erreur lors de la livraison';
      }
    });
  }

}
