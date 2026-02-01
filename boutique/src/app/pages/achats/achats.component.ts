import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-achats',
  templateUrl: './achats.component.html',
  styleUrls: ['./achats.component.css']
})
export class AchatsComponent implements OnInit {

  /* =======================
   * LISTE DES PRODUITS
   * ======================= */
  produits: any[] = [
    {
      id: 1,
      nom: 'Riz blanc 25kg',
      prix: 120000,
      boutique: 'Boutique Analakely',
      stock: 15,
      image: 'assets/img/angular2-logo.png',
      quantite: 1
    },
    {
      id: 2,
      nom: 'Huile végétale 5L',
      prix: 45000,
      boutique: 'Tana Market',
      stock: 30,
      image: 'assets/img/angular2-logo.png',
      quantite: 1
    },
    {
      id: 3,
      nom: 'Sucre 1kg',
      prix: 3500,
      boutique: 'Jumbo Shop',
      stock: 0,
      image: 'assets/img/angular2-logo.png',
      quantite: 1
    },
    {
      id: 4,
      nom: 'Riz blanc 25kg',
      prix: 120000,
      boutique: 'Boutique Analakely',
      stock: 15,
      image: 'assets/img/angular2-logo.png',
      quantite: 1
    },
    {
      id: 5,
      nom: 'Huile végétale 5L',
      prix: 45000,
      boutique: 'Tana Market',
      stock: 30,
      image: 'assets/img/angular2-logo.png',
      quantite: 1
    },
    {
      id: 6,
      nom: 'Sucre 1kg',
      prix: 3500,
      boutique: 'Jumbo Shop',
      stock: 0,
      image: 'assets/img/angular2-logo.png',
      quantite: 1
    }
  ];

  /* =======================
   * RECHERCHE AVANCÉE
   * ======================= */
  filters = {
    nom: '',
    boutique: '',
    prixMin: null as number | null,
    prixMax: null as number | null,
    stockOnly: false
  };

  boutiques: string[] = [];

  /* =======================
   * INITIALISATION
   * ======================= */

  ngOnInit(): void {
    // Liste unique des boutiques pour le select
    this.boutiques = [...new Set(this.produits.map(p => p.boutique))];
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
        matchPrixMin &&
        matchPrixMax &&
        matchStock
      );
    });
  }

  /* =======================
   * PANIER
   * ======================= */
  ajouterAuPanier(produit: any): void {
    if (produit.stock === 0) {
      alert('❌ Produit indisponible');
      return;
    }

    if (produit.quantite < 1) {
      alert('⚠️ Quantité invalide');
      return;
    }

    if (produit.quantite > produit.stock) {
      alert('❌ Stock insuffisant');
      return;
    }

    // Ici plus tard : service panier
    alert(`🛒 ${produit.quantite} × ${produit.nom} ajouté(s) au panier`);
  }

}
