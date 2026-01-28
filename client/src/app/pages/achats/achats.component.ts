import { Component } from '@angular/core';

@Component({
  selector: 'app-achats',
  templateUrl: './achats.component.html',
  styleUrls: ['./achats.component.css']
})
export class AchatsComponent {

  produits = [
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
    },
    {
      id: 7,
      nom: 'Riz blanc 25kg',
      prix: 120000,
      boutique: 'Boutique Analakely',
      stock: 15,
      image: 'assets/img/angular2-logo.png',
      quantite: 1
    },
    {
      id: 8,
      nom: 'Huile végétale 5L',
      prix: 45000,
      boutique: 'Tana Market',
      stock: 30,
      image: 'assets/img/angular2-logo.png',
      quantite: 1
    },
    {
      id: 9,
      nom: 'Sucre 1kg',
      prix: 3500,
      boutique: 'Jumbo Shop',
      stock: 0,
      image: 'assets/img/angular2-logo.png',
      quantite: 1
    }
  ];

  ajouterAuPanier(produit: any) {
    if (produit.quantite > produit.stock) {
      alert('Stock insuffisant ❌');
      return;
    }

    alert(`🛒 ${produit.quantite} × ${produit.nom} ajouté(s) au panier`);
  }
}
