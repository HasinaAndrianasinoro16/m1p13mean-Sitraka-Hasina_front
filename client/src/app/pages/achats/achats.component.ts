import { Component, OnInit } from '@angular/core';
import {ProduitService} from "../../services/produit/produit.service";
import {PanierService} from "../../services/panier/panier.service";

@Component({
  selector: 'app-achats',
  templateUrl: './achats.component.html',
  styleUrls: ['./achats.component.css']
})
export class AchatsComponent implements OnInit {

  produits: any[] = [];
  loading = false;
  error = '';

  // quantite: number = 1;

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

  constructor(private catalogueService: ProduitService, private panierService: PanierService) { }

  ngOnInit(): void {
    this.loadProduits();
  }

  loadProduits(): void {
    this.loading = true;

    this.catalogueService.getListeProduits().subscribe({
      next: (res) => {
        if (res.success) {

          this.produits = res.data.produits.map((p: any) => ({
            id: p._id,
            nom: p.nom,
            prix: p.prixActuel ?? p.prix,
            boutique: p.boutique?.nomBoutique || 'Boutique inconnue',
            stock: p.stock,
            categorie: p.categorie?.nom || 'aucune categorie',
            image: p.imagePrincipaleUrl || 'assets/img/default-product.jpg',
            quantite: 1
          }));

          this.boutiques = [
            ...new Set(this.produits.map(p => p.boutique))
          ];

          this.categories =[
            ...new Set(this.produits.map(p => p.categorie))
          ]

        }

        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Erreur lors du chargement des produits';
        this.loading = false;
      }
    });
  }

  /* =======================
   * PRODUITS FILTRÉS
   * ======================= */
  get produitsFiltres(): any[] {
    return this.produits.filter(p => {

      const matchNom =
        !this.filters.nom ||
        p.nom.toLowerCase().includes(this.filters.nom.toLowerCase());

      const matchBoutique =
        !this.filters.boutique ||
        p.boutique === this.filters.boutique;

      const matchCategorie =
        !this.filters.categorie ||
        p.categorie === this.filters.categorie;

      const matchPrixMin =
        this.filters.prixMin === null ||
        p.prix >= this.filters.prixMin;

      const matchPrixMax =
        this.filters.prixMax === null ||
        p.prix <= this.filters.prixMax;

      const matchStock =
        !this.filters.stockOnly || p.stock > 0;

      return (
        matchNom &&
        matchBoutique &&
        matchCategorie &&
        matchPrixMin &&
        matchPrixMax &&
        matchStock
      );
    });
  }

  ajouterAuPanier(produit: any): void {

    if (localStorage.getItem('token') == null) {
      alert('vous devez vous connectez pour cette action')
      return;
    }

    if (produit.stock === 0) {
      alert(' Produit indisponible');
      return;
    }

    if (produit.quantite < 1) {
      alert('Quantité invalide');
      return;
    }

    if (produit.quantite > produit.stock) {
      alert(' Stock insuffisant');
      return;
    }

    this.panierService.ajoutPanier(produit.id, produit.quantite).subscribe({
      next: (res: any) => {
        if (res.success) {
          alert(`🛒 ${produit.quantite} × ${produit.nom} ajouté(s) au panier`);
          this.loadProduits()
        }
      },
      error: (err) => {
        console.error(err);
        alert('Erreur lors de l\'ajout du produit ');
      }
    })



  }
}
