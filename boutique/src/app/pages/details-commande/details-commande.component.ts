import { Component, OnInit } from '@angular/core';
import {CommandeService} from "../../services/commande/commande.service";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-details-commande',
  templateUrl: './details-commande.component.html',
  styleUrls: ['./details-commande.component.css']
})
export class DetailsCommandeComponent implements OnInit {

  commande: any = null;
  loading: boolean = false;
  error: string = '';

  constructor(private commandeService: CommandeService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.loadDetailCommande();
  }

  getStatutBadgeClass(statut: string): string {
    const m: { [k: string]: string } = {
      'en_attente':    'badge-attente',
      'confirmee':     'badge-confirmee',
      'en_preparation':'badge-en-cours',
      'en_livraison':  'badge-en-cours',
      'expediee':  'badge-en-cours',
      'livree':        'badge-livree',
      'annulee':       'badge-annulee'
    };
    return m[statut] || 'badge-attente';
  }

  getStatutTexte(statut: string): string {
    const m: { [k: string]: string } = {
      'en_attente':    'En attente',
      'confirmee':     'Confirmée',
      'en_preparation':'En préparation',
      'en_livraison':  'En livraison',
      'expediee':     'Expediée',
      'livree':        'Livrée',
      'annulee':       'Annulée'
    };
    return m[statut] || statut;
  }

  getStatutIcon(statut: string): string {
    const m: { [k: string]: string } = {
      'en_attente':    'nc-watch-time',
      'confirmee':     'nc-check-2',
      'en_preparation':'nc-box',
      'en_livraison':  'nc-delivery-fast',
      'expediee':     'nc-spaceship',
      'livree':        'nc-check-2',
      'annulee':       'nc-simple-remove'
    };
    return m[statut] || 'nc-bullet-list-67';
  }

  retour(): void {
    this.router.navigate(['/commandes']);
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  loadDetailCommande(): void {
    const id = this.route.snapshot.queryParamMap.get('id');
    if(!id){
      this.error = 'Commande introuvable';
      return;
    }

    this.commandeService.getDetailsCommandes(id).subscribe({
      next: (response: any)=>{
        this.commande = response.data.commande;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Erreur lors de la récupération du produit';
      }
    });
  }

}
