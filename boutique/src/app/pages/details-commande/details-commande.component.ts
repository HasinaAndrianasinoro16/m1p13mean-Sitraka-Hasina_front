import { Component, OnInit } from '@angular/core';
import {CommandeService} from "../../services/commande/commande.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-details-commande',
  templateUrl: './details-commande.component.html',
  styleUrls: ['./details-commande.component.css']
})
export class DetailsCommandeComponent implements OnInit {

  commande: any = null;
  error: string = '';

  constructor(private commandeService: CommandeService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadDetailCommande();
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
