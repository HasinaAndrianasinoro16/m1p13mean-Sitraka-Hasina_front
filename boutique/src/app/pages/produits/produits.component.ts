import { Component } from '@angular/core';

interface Produit {
  nom: string;
  prix: number;
  stock: number;
  image: string;
}

@Component({
  selector: 'app-produits',
  templateUrl: './produits.component.html'
})
export class ProduitsComponent {

  produits: Produit[] = [
    { nom: 'Chaussures Nike', prix: 120000, stock: 45, image: '' },
    { nom: 'T-shirt Adidas', prix: 35000, stock: 10, image: ''  },
    { nom: 'Casquette Puma', prix: 25000, stock: 5, image: ''  },
    { nom: 'Sac à dos', prix: 80000, stock: 30, image: ''  },
    { nom: 'Montre sportive', prix: 150000, stock: 8, image: ''  },
    { nom: 'Veste', prix: 95000, stock: 12, image: ''  }
  ];

  // Nouveau produit
  nouveauProduit: Produit = {
    nom: '',
    prix: 0,
    stock: 0,
    image: ''
  };

  // Ajout stock
  produitSelectionne!: Produit;
  quantiteAjout: number = 0;

  // Pagination
  pageActuelle: number = 1;
  elementsParPage: number = 5;

  // PRODUITS PAGINÉS
  get produitsPaginees(): Produit[] {
    const start = (this.pageActuelle - 1) * this.elementsParPage;
    return this.produits.slice(start, start + this.elementsParPage);
  }

  get totalPages(): number {
    return Math.ceil(this.produits.length / this.elementsParPage);
  }

  changerPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.pageActuelle = page;
    }
  }

  // AJOUT PRODUIT
  ajouterProduit() {
    if (!this.nouveauProduit.nom || this.nouveauProduit.prix <= 0) return;

    this.produits.push({ ...this.nouveauProduit });

    this.nouveauProduit = { nom: '', prix: 0, stock: 0, image: ''  };
    this.pageActuelle = this.totalPages;
  }

  // OUVERTURE MODAL STOCK
  ouvrirAjoutStock(produit: Produit) {
    this.produitSelectionne = produit;
    this.quantiteAjout = 0;
  }

  // AJOUT STOCK
  ajouterStock() {
    if (this.quantiteAjout > 0) {
      this.produitSelectionne.stock += this.quantiteAjout;
    }
  }
}
