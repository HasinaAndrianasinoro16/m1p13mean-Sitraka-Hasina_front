import { Component, OnInit } from '@angular/core';
import {CommandeService} from "../../services/commande/commande.service";

@Component({
  selector: 'app-commandes',
  templateUrl: './commandes.component.html',
  styleUrls: ['./commandes.component.css']
})
export class CommandesComponent implements OnInit {

  commandes: any = null;

  //erreur
  loading: boolean = false;
  error: string = '';

  //pagination
  currentPage: number = 1;
  limit: number = 5;
  totalPages: number = 0;
  pages: number[] = [];

  constructor(private commandeService: CommandeService) { }

  ngOnInit(): void {
    this.loadCommande(this.currentPage)
  }

  loadCommande(page: number): void {
    this.loading = true;
    this.error = '';
    this.commandeService.getListeCommandes(page, this.limit).subscribe({
      next: (res: any) =>{
        if(res.success){
          this.commandes = res.data.commandes;

          const pagination =res.data.pagination;
          this.currentPage = pagination.page;
          this.totalPages =pagination.totalPages;

          this.pages = Array.from(
            {length: this.totalPages},
            (_, i )=> i+1
          );
        }
      },
      error: (err) => {
        console.error(err);
        this.error = "Erreur lors de la récupération des commandes.";
        this.loading = false;
      }
    })
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.loadCommande(page);
    }
  }

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


}
