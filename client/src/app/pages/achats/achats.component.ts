import { Component, OnInit } from '@angular/core';
import { ProduitService } from '../../services/produit/produit.service';
import { PanierService } from '../../services/panier/panier.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-achats',
  templateUrl: './achats.component.html',
  styleUrls: ['./achats.component.css']
})
export class AchatsComponent implements OnInit {

  produits: any[] = [];
  loading: boolean = false;
  error: string = '';
  successMessage: string = '';

  filters = {
    nom: '',
    boutique: '',
    categorie: '',
    prixMin: null as number | null,
    prixMax: null as number | null,
    stockOnly: false
  };

  boutiques: string[] = [];
  categories: string[] = [];

  constructor(
    private catalogueService: ProduitService,
    private panierService: PanierService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProduits();
  }

  loadProduits(): void {
    this.loading = true;
    this.error = '';

    this.catalogueService.getListeProduits().subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.produits = (Array.isArray(res.data.produits) ? res.data.produits : [])
            .filter((p: any) => p != null)
            .map((p: any) => ({
              id: p._id,
              nom: p.nom,
              prix: p.prixActuel ?? p.prix,
              boutique: p.boutique?.nomBoutique || 'Boutique inconnue',
              stock: p.stock || 0,
              categorie: p.categorie?.nom || 'Sans catégorie',
              image: p.imagePrincipaleUrl || 'assets/img/default-product.jpg',
              quantite: 1
            }));

          this.boutiques = [...new Set(this.produits.map(p => p.boutique))];
          this.categories = [...new Set(this.produits.map(p => p.categorie))];
        }
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        this.error = 'Erreur lors du chargement des produits.';
      }
    });
  }

  get produitsFiltres(): any[] {
    return this.produits.filter(p => {
      const matchNom = !this.filters.nom ||
        p.nom.toLowerCase().includes(this.filters.nom.toLowerCase());

      const matchBoutique = !this.filters.boutique ||
        p.boutique === this.filters.boutique;

      const matchCategorie = !this.filters.categorie ||
        p.categorie === this.filters.categorie;

      const matchPrixMin = this.filters.prixMin === null ||
        p.prix >= this.filters.prixMin;

      const matchPrixMax = this.filters.prixMax === null ||
        p.prix <= this.filters.prixMax;

      const matchStock = !this.filters.stockOnly || p.stock > 0;

      return matchNom && matchBoutique && matchCategorie &&
        matchPrixMin && matchPrixMax && matchStock;
    });
  }

  resetFilters(): void {
    this.filters = {
      nom: '',
      boutique: '',
      categorie: '',
      prixMin: null,
      prixMax: null,
      stockOnly: false
    };
  }

  ajouterAuPanier(produit: any): void {
    if (!localStorage.getItem('token')) {
      alert('Vous devez être connecté pour ajouter des produits au panier.');
      // this.error = 'Vous devez être connecté pour ajouter des produits au panier.';
      setTimeout(() => this.router.navigate(['/login']),100);
      return;
    }

    if (produit.stock === 0) {
      alert('Produit indisponible.');
      // this.error = 'Produit indisponible.';
      return;
    }

    if (produit.quantite < 1) {
      alert('Quantité invalide.');
      // this.error = 'Quantité invalide.';
      return;
    }

    if (produit.quantite > produit.stock) {
      alert(`Stock insuffisant (max : ${produit.stock}).`);
      // this.error = `Stock insuffisant (max : ${produit.stock}).`;
      return;
    }

    this.panierService.ajoutPanier(produit.id, produit.quantite).subscribe({
      next: (res: any) => {
        if (res.success) {
          alert(`${produit.quantite} × ${produit.nom} ajouté(s) au panier !`);
          // this.showSuccess(`${produit.quantite} × ${produit.nom} ajouté(s) au panier !`);
          produit.quantite = 1; // Reset
        }
      },
      error: (err) => {
        console.error(err);
        alert(err?.error?.message || 'Erreur lors de l\'ajout au panier.');
        // this.error = err?.error?.message || 'Erreur lors de l\'ajout au panier.';
      }
    });
  }

  showSuccess(msg: string): void {
    this.successMessage = msg;
    setTimeout(() => (this.successMessage = ''), 3500);
  }

  getStockClass(stock: number): string {
    if (stock > 10) return 'stock-ok';
    if (stock > 0) return 'stock-low';
    return 'stock-empty';
  }
}
