import { Component } from '@angular/core';

@Component({
  selector: 'app-panier',
  templateUrl: './panier.component.html'
})
export class PanierComponent {

  panier = [
    {
      id: 1,
      nom: 'Riz blanc 25kg',
      prix: 120000,
      quantite: 2,
      image: 'assets/img/angular2-logo.png'
    },
    {
      id: 2,
      nom: 'Huile végétale 5L',
      prix: 45000,
      quantite: 1,
      image: 'assets/img/angular2-logo.png'
    },
    {
      id: 3,
      nom: 'Riz blanc 25kg',
      prix: 120000,
      quantite: 2,
      image: 'assets/img/angular2-logo.png'
    },
    {
      id: 4,
      nom: 'Huile végétale 5L',
      prix: 45000,
      quantite: 1,
      image: 'assets/img/angular2-logo.png'
    }
  ];

  getTotal(): number {
    return this.panier.reduce((total, p) => total + (p.prix * p.quantite), 0);
  }

  supprimerProduit(index: number) {
    this.panier.splice(index, 1);
  }

  validerPanier() {
    if (this.panier.length === 0) {
      alert('Votre panier est vide ❌');
      return;
    }

    alert('✅ Panier validé avec succès !');
    this.panier = [];
  }
}
