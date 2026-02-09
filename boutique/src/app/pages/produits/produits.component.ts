import { Component } from '@angular/core';
import {ProduitService} from "../../services/produit/produit.service";
import {CategorieService} from "../../services/categorie/categorie.service";

@Component({
  selector: 'app-produits',
  templateUrl: './produits.component.html'
})
export class ProduitsComponent {
  //creation produit
  nomProduit: string = '';
  description: string = '';
  prix: number = 0;
  stock: number = 0;
  categorie: string = '';
  categories: any = null;

  //ajout de stock
  addStock: number = 0;

  selectedId: string = '';
  currentStock: number = 0;

  //liste des produits
  produitData: any = null;

  error: string = '';
  loading:boolean = false;

  //pagination
  currentPage: number = 1;
  limit: number = 5;
  totalPages: number = 0;
  pages: number[] = [];

  constructor(private produitService: ProduitService, private categorieService: CategorieService) {
  }

  ngOnInit(): void {
    this.loadProduits(this.currentPage);
    this.loadCategorie();
  }

  loadCategorie(): void {
    this.categorieService.getCategorieListe().subscribe({
      next: (response: any) => {
        if(response.success) {
          this.categories = response.data.categories;
        }
      },
      error: (err) => {
        console.error(err);
        this.error = "Erreur lors de la récupération des categories.";
        this.loading = false;
      }
    });
  }

  loadProduits(page: number): void {
    this.loading = true;
    this.error = '';

    this.produitService.getProduitListe(page, this.limit).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.produitData = response.data.produits;

          const pagination = response.data.pagination;
          this.currentPage = pagination.page;
          this.totalPages = pagination.totalPages;

          this.pages = Array.from(
            {length: this.totalPages},
            (_, i)=> i+1
          );
        }

        this.loading = false;

      },
      error: (err) => {
        console.error(err);
        this.error = "Erreur lors de la récupération des boutiques en attente.";
        this.loading = false;
      }
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.loadProduits(page);
    }
  }

  clickAddProduit(): void {
    this.produitService.createProduit(this.nomProduit, this.description, this.prix, this.stock, this.categorie).subscribe({
      next: (res: any) => {
        if(res.success) {
          alert('nouveau produit créé avec succès');
          this.loadProduits(this.currentPage);
        }
      },
      error: (err) => {
        console.error(err);
        alert('Erreur lors de la création du produit ');
      }
    })
  }

  clickAddStock(id: string, stock: number): void {
    this.produitService.newAjoutStock(id,stock,this.addStock).subscribe({
      next: (res: any) => {
        if(res.success) {
          alert('nouveau stock ajouter');
          this.loadProduits(this.currentPage);
        }
      },
      error: (err) => {
        console.error(err);
        alert('Erreur lors de la création du produit ');
      }
    })
  }

  clickInfo(id: string, stock: number): void {
    this.selectedId = id;
    this.currentStock = stock;
  }



}
