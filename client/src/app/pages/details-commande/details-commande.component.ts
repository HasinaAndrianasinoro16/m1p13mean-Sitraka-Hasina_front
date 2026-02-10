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
