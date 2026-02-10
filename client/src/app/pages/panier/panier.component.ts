import { Component, OnInit } from '@angular/core';
import {PanierService} from "../../services/panier/panier.service";
import {CommandeService} from "../../services/commande/commande.service";

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

  //validation du panier
  nom: string = '';
  prenom: string = '';
  telephone: string = '';
  rue: string = '';
  instruction: string = '';

  constructor(private panierService: PanierService, private commandeService: CommandeService) {}

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

  clickViderPanier(): void {
    if(confirm('Voulez vous vraiment vider votre Panier')){
      this.panierService.viderPanier().subscribe({
        next: () => {
          alert('Panier vidé');
          this.panier = [];
          this.total = 0;
          this.loadPanier();
          return;
        },
        error: () => {
          alert(' Erreur pendant qu\'on vide le panier');
        }
      });
    }
  }

  validerPanier(): void {
    this.commandeService.passerCommande(this.nom, this.prenom, this.telephone, this.rue,this.instruction).subscribe({
      next: (res) => {
        if(res.success){
          alert('Panier validé');
          this.panier = [];
          this.total = 0;
          this.loadPanier();
          return
        }
      },
      error: () => {
        alert(' Panier non valider');
      }
    });
  }
}
