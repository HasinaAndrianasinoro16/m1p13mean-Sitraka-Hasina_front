import { Component, OnInit } from '@angular/core';
import { CommandeService } from '../../services/commande/commande.service';

@Component({
  selector: 'app-commandes',
  templateUrl: './commandes.component.html',
  styleUrls: ['./commandes.component.css']
})
export class CommandesComponent implements OnInit {

  commandes: any[] = [];

  // Pagination
  currentPage: number = 1;
  limit: number = 10;
  totalPages: number = 0;
  pages: number[] = [];

  // États
  loading: boolean = false;
  error: string = '';

  constructor(private commandeService: CommandeService) {}

  ngOnInit(): void {
    this.loadCommandes(this.currentPage);
  }

  loadCommandes(page: number): void {
    this.loading = true;
    this.error = '';

    this.commandeService.getCommandes(page, this.limit).subscribe({
      next: (response: any) => {
        this.loading = false;

        if (response.success && response.data) {
          this.commandes = response.data.commandes || [];

          // Pagination
          const pagination = response.data.pagination;
          this.currentPage = pagination.page;
          this.totalPages = pagination.totalPages;
          this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);

          console.log('Commandes chargées:', this.commandes);
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

  // Obtenir la classe du badge selon le statut
  getStatutBadgeClass(statut: string): string {
    const classes: { [key: string]: string } = {
      'en_attente': 'bg-warning text-dark',
      'confirmee': 'bg-info text-white',
      'en_preparation': 'bg-primary',
      'en_livraison': 'bg-secondary',
      'livree': 'bg-success',
      'annulee': 'bg-danger'
    };
    return classes[statut] || 'bg-secondary';
  }

  // Obtenir le texte du statut
  getStatutTexte(statut: string): string {
    const textes: { [key: string]: string } = {
      'en_attente': 'En attente',
      'confirmee': 'Confirmée',
      'en_preparation': 'En préparation',
      'en_livraison': 'En livraison',
      'livree': 'Livrée',
      'annulee': 'Annulée'
    };
    return textes[statut] || statut;
  }

  // Obtenir l'icône du statut
  getStatutIcon(statut: string): string {
    const icons: { [key: string]: string } = {
      'en_attente': 'nc-time-alarm',
      'confirmee': 'nc-check-2',
      'en_preparation': 'nc-box',
      'en_livraison': 'nc-delivery-fast',
      'livree': 'nc-check-2',
      'annulee': 'nc-simple-remove'
    };
    return icons[statut] || 'nc-bullet-list-67';
  }

  clickConfirmerCommande(id: string): void {
    if(!id){
      this.error = 'Commande introuvable';
      alert('Commande introuvable');
      return;
    }

    this.commandeService.confirmerCommande(id).subscribe({
      next: (response: any) => {
        if(response.success) {
          alert('la commande a ete validee');
          this.loadCommandes(this.currentPage);
        }
      }
    })

  }
}
