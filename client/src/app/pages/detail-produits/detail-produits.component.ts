import { Component, OnInit } from '@angular/core';
import {ProduitService} from "../../services/produit/produit.service";
import {ActivatedRoute} from "@angular/router";
import {PanierService} from "../../services/panier/panier.service";

@Component({
  selector: 'app-detail-produits',
  templateUrl: './detail-produits.component.html',
  styleUrls: ['./detail-produits.component.css']
})
export class DetailProduitsComponent implements OnInit {

  produit: any = null;

  quantite: number = 1;

  error: string= '';

  constructor(private produitService: ProduitService, private route: ActivatedRoute, private panierService: PanierService) { }

  ngOnInit(): void {
    this.loadDetailProduit();
  }

  loadDetailProduit(): void {
    const id = this.route.snapshot.queryParamMap.get('id');
    this.produitService.getProduitInfo(id).subscribe({
      next: (response: any) => {
        if(response.success){
          this.produit = response.data.produit;
        }
      },
      error: (err) => {
      console.error(err);
      this.error = 'erreur lors de la recuperation des data';
    }
    })
  }

  clickAjoutPanier(nomProduit:string, stock: number): void {
    if (localStorage.getItem('token') == null) {
      alert('vous devez vous connectez pour cette action')
      return;
    }

    if (stock === 0) {
      alert(' Produit indisponible');
      return;
    }

    if (this.quantite < 1) {
      alert('Quantité invalide');
      return;
    }

    if (this.quantite > stock) {
      alert(' Stock insuffisant');
      return;
    }
    const id = this.route.snapshot.queryParamMap.get('id');
    this.panierService.ajoutPanier(id, this.quantite).subscribe({
      next: (response: any) => {
        if(response.success){
          alert(`🛒 ${this.quantite} × ${nomProduit} ajouté(s) au panier`);
          this.loadDetailProduit();
        }
      }
    })
  }

}
