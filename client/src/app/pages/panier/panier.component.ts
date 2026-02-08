import { Component, OnInit } from '@angular/core';
import {PanierService} from "../../services/panier/panier.service";

@Component({
  selector: 'app-panier',
  templateUrl: './panier.component.html'
})
export class PanierComponent implements OnInit {

  panier: any[] = [];
  total = 0;

  produitSelectionner: string = '';
  idSelectionner: string = '';
  quantiteSelectionner: number = 0;
  stock: number = 0;

  quantite: number = 0;

  constructor(private panierService: PanierService) {}

  ngOnInit(): void {
    this.loadPanier();
  }

  // 🔹 Charger le panier depuis l’API
  loadPanier(): void {
    this.panierService.getPanier().subscribe({
      next: (res) => {
        const items = res?.data?.panier?.items || [];

        // 🔁 Adapter la structure backend → frontend
        this.panier = items.map((item: any) => ({
          id: item.produit._id,
          nom: item.produit.nom,
          prix: item.prixUnitaire,
          quantite: item.quantite,
          stocks: item.produit.stock,
          image: item.produit.imagePrincipaleUrl
            ? item.produit.imagePrincipaleUrl
            : 'assets/img/default-product.jpg',
        }));

        this.total = res.data.panier.total;
      },
      error: () => {
        alert('Impossible de charger le panier');
      }
    });
  }

  getTotal(): number {
    return this.panier.reduce(
      (total, p) => total + (p.prix * p.quantite),
      0
    );
  }

  supprimerProduit(index: number): void {
    const produit = this.panier[index];

    this.panierService.retirerProduit(produit.id).subscribe({
      next: () => {
        this.panier.splice(index, 1);
        this.loadPanier()
      },
      error: () => {
        alert(' Erreur lors de la suppression');
      }
    });
  }

  clickinfo(id: string, produit: string, quantite: number, stock: number): void {
    this.idSelectionner = id;
    this.produitSelectionner = produit;
    this.quantiteSelectionner = quantite;
    this.stock = stock;
  }

  clickModiferPanierQuantite(): void {
    if(this.quantite < 1){
      alert('quantite invalides');
      return;
    }
    if(this.stock < this.quantite) {
      alert(' Attention la quantite depasse le stock disponible');
      return;
    }
    this.panierService.modifierQuantitePanier(this.idSelectionner, this.quantite).subscribe({
      next: (res : any) => {
        if (res.success) {
          this.loadPanier();
        }
      },
      error: (err) => {
        console.error(err);
        alert('Erreur lors de la création du produit ');
      }
    });
  }

  validerPanier(): void {
    if (this.panier.length === 0) {
      alert('Votre panier est vide ');
      return;
    }

    this.panierService.viderPanier('').subscribe({
      next: () => {
        alert('Panier validé avec succès !');
        this.panier = [];
        this.total = 0;
        this.loadPanier()
      },
      error: () => {
        alert(' Erreur lors de la validation');
      }
    });
  }
}
