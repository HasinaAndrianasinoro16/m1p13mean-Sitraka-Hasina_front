import { Component, OnInit } from '@angular/core';
import { PanierService } from '../../services/panier/panier.service';
import { CommandeService } from '../../services/commande/commande.service';

@Component({
  selector: 'app-panier',
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.css']
})
export class PanierComponent implements OnInit {

  panier: any[] = [];
  total: number = 0;

  produitSelectionner: string = '';
  idSelectionner: string = '';
  quantiteSelectionner: number = 0;
  stock: number = 0;
  quantite: number = 0;

  nom: string = '';
  prenom: string = '';
  telephone: string = '';
  rue: string = '';
  instruction: string = '';

  loading:  boolean = false;
  error: string  = '';
  successMessage: string  = '';

  constructor(
    private panierService:   PanierService,
    private commandeService: CommandeService
  ) {}

  ngOnInit(): void {
    this.loadPanier();
  }

  loadPanier(): void {
    this.loading = true;
    this.error   = '';

    this.panierService.getPanier().subscribe({
      next: (res) => {
        this.loading = false;
        const items = res?.data?.panier?.items || [];

        this.panier = items
          .filter((item: any) => item?.produit != null)
          .map((item: any) => {
            const produit = item.produit;

            const prixUnitaire = produit.enPromo && produit.prixPromo
              ? produit.prixPromo
              : produit.prix;

            const prixOriginal = produit.prix;

            return {
              id:       item.produit._id,
              nom:      item.produit.nom,
              prix:     prixUnitaire,
              quantite: item.quantite,
              stocks:   item.produit.stock,
              image:    item.produit.imagePrincipaleUrl || 'assets/img/default-product.jpg'
            };
          });


        // this.panier = items
        //   .filter((item: any) => item?.produit != null)
        //   .map((item: any) => ({
        //     id:       item.produit._id,
        //     nom:      item.produit.nom,
        //     prix:     item.enPromo && item.prixPromo
        //       ? item.prixPromo
        //       : item.prix,
        //     quantite: item.quantite,
        //     stocks:   item.produit.stock,
        //     image:    item.produit.imagePrincipaleUrl || 'assets/img/default-product.jpg'
        //   }));

        this.total = res.data?.panier?.total || this.getTotal();
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        this.error = 'Impossible de charger le panier.';
      }
    });
  }

  getTotal(): number {
    return this.panier.reduce((sum, p) => sum + (p.prix * p.quantite), 0);
  }

  supprimerProduit(index: number): void {
    const produit = this.panier[index];

    this.panierService.retirerProduit(produit.id).subscribe({
      next: () => {
        this.showSuccess('Produit retiré du panier.');
        this.loadPanier();
      },
      error: (err) => {
        console.error(err);
        this.error = 'Erreur lors de la suppression.';
      }
    });
  }

  clickinfo(id: string, produit: string, quantite: number, stock: number): void {
    this.idSelectionner = id;
    this.produitSelectionner = produit;
    this.quantiteSelectionner = quantite;
    this.stock = stock;
    this.quantite = quantite;
  }

  clickModifierPanierQuantite(): void {
    if (this.quantite < 1) {
      this.error = 'La quantité doit être au moins 1.';
      return;
    }
    if (this.quantite > this.stock) {
      this.error = `Stock insuffisant (max : ${this.stock}).`;
      return;
    }

    this.panierService.modifierQuantitePanier(this.idSelectionner, this.quantite).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.showSuccess('Quantité mise à jour.');
          this.loadPanier();
        }
      },
      error: (err) => {
        console.error(err);
        this.error = err?.error?.message || 'Erreur lors de la modification.';
      }
    });
  }

  clickViderPanier(): void {
    this.showConfirmVider = true;
  }

  showConfirmVider: boolean = false;

  confirmerViderPanier(): void {
    this.showConfirmVider = false;
    this.panierService.viderPanier().subscribe({
      next: () => {
        this.showSuccess('Panier vidé.');
        this.panier = [];
        this.total  = 0;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Erreur lors du vidage du panier.';
      }
    });
  }

  annulerViderPanier(): void {
    this.showConfirmVider = false;
  }

  validerPanier(): void {
    if (!this.nom.trim() || !this.prenom.trim()) {
      this.error = 'Nom et prénom obligatoires.';
      return;
    }
    if (!this.telephone.trim()) {
      this.error = 'Téléphone obligatoire.';
      return;
    }

    this.commandeService.passerCommande(
      this.nom, this.prenom, this.telephone, this.rue, this.instruction
    ).subscribe({
      next: (res) => {
        if (res.success) {
          this.showSuccess('Commande validée avec succès !');
          this.panier = [];
          this.total  = 0;
          this.resetFormulaire();
          // ✅ Fermer le modal programmatiquement
          this.closeModal('checkoutModal');
        }
      },
      error: (err) => {
        console.error(err);
        this.error = err?.error?.message || 'Erreur lors de la validation.';
      }
    });
  }

  resetFormulaire(): void {
    this.nom         = '';
    this.prenom      = '';
    this.telephone   = '';
    this.rue         = '';
    this.instruction = '';
  }

  showSuccess(msg: string): void {
    this.successMessage = msg;
    setTimeout(() => (this.successMessage = ''), 3500);
  }

  closeModal(id: string): void {
    const modal = document.getElementById(id);
    if (modal) {
      const backdrop = document.querySelector('.modal-backdrop');
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
      if (backdrop) backdrop.remove();
    }
  }
}
