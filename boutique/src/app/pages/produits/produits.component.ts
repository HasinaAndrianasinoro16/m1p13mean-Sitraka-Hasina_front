import { Component, OnInit } from '@angular/core';
import { ProduitService }   from '../../services/produit/produit.service';
import { CategorieService } from '../../services/categorie/categorie.service';

@Component({
  selector: 'app-produits',
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.css']
})
export class ProduitsComponent implements OnInit {

  // ── Formulaire création produit ──
  nomProduit:  string = '';
  description: string = '';
  prix:        number = 0;
  stock:       number = 0;
  categorie:   string = '';

  // ── Catégories ──
  categories: any[] = [];

  // ── Ajout de stock ──
  addStock:     number = 0;
  selectedId:   string = '';
  currentStock: number = 0;

  // ── Liste produits ──
  produitData: any[] = [];

  // ── États ──
  loading:        boolean = false;
  loadingAction:  boolean = false;  // spinner boutons modal
  error:          string  = '';
  successMessage: string  = '';

  // ── Pagination ──
  currentPage: number   = 1;
  limit:       number   = 5;
  totalPages:  number   = 0;
  pages:       number[] = [];

  constructor(
    private produitService:   ProduitService,
    private categorieService: CategorieService
  ) {}

  ngOnInit(): void {
    this.loadProduits(this.currentPage);
    this.loadCategorie();
  }

  // ── Catégories ──
  loadCategorie(): void {
    this.categorieService.getCategorieListe().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.categories = Array.isArray(response.data.categories)
            ? response.data.categories : [];
        }
      },
      error: (err) => console.error('Erreur catégories:', err)
    });
  }

  // ── Produits ──
  loadProduits(page: number): void {
    this.loading = true;
    this.error   = '';

    this.produitService.getProduitListe(page, this.limit).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.success && response.data) {
          this.produitData = Array.isArray(response.data.produits)
            ? response.data.produits.filter((p: any) => p != null) : [];

          const pagination = response.data.pagination;
          this.currentPage = pagination.page;
          this.totalPages  = pagination.totalPages;
          this.pages       = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        }
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        this.error = 'Erreur lors de la récupération des produits.';
      }
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.loadProduits(page);
    }
  }

  // ── Créer un produit ──
  clickAddProduit(): void {
    if (!this.nomProduit.trim()) {
      this.error = 'Le nom du produit est obligatoire.';
      return;
    }
    if (this.prix <= 0) {
      this.error = 'Le prix doit être supérieur à 0.';
      return;
    }

    this.loadingAction = true;
    this.error         = '';

    this.produitService.createProduit(
      this.nomProduit, this.description, this.prix, this.stock, this.categorie
    ).subscribe({
      next: (res: any) => {
        this.loadingAction = false;
        if (res.success) {
          this.showSuccess('Produit créé avec succès !');
          this.resetFormulaire();
          this.loadProduits(this.currentPage);
        }
      },
      error: (err) => {
        this.loadingAction = false;
        console.error(err);
        this.error = err?.error?.message || 'Erreur lors de la création du produit.';
      }
    });
  }

  // ── Ajouter du stock ──
  clickAddStock(id: string, stock: number): void {
    if (!id) { this.error = 'Produit introuvable.'; return; }
    if (!this.addStock || this.addStock <= 0) { this.error = 'Quantité invalide.'; return; }

    this.loadingAction = true;
    this.error         = '';

    this.produitService.newAjoutStock(id, stock, this.addStock).subscribe({
      next: (res: any) => {
        this.loadingAction = false;
        if (res.success) {
          this.showSuccess(`+${this.addStock} unités ajoutées au stock !`);
          // Mise à jour locale immédiate
          const idx = this.produitData.findIndex((p: any) => p.id === id || p._id === id);
          if (idx !== -1) {
            this.produitData[idx] = {
              ...this.produitData[idx],
              stock: (this.produitData[idx].stock || 0) + this.addStock
            };
          }
          this.addStock = 0;
        }
      },
      error: (err) => {
        this.loadingAction = false;
        console.error(err);
        this.error = err?.error?.message || 'Erreur lors de l\'ajout du stock.';
      }
    });
  }

  // ── Stocker l'id sélectionné pour le modal stock ──
  clickInfo(id: string, stock: number): void {
    this.selectedId   = id;
    this.currentStock = stock;
    this.addStock     = 0;
    this.error        = '';
  }

  // ── Helpers ──
  resetFormulaire(): void {
    this.nomProduit  = '';
    this.description = '';
    this.prix        = 0;
    this.stock       = 0;
    this.categorie   = '';
  }

  showSuccess(msg: string): void {
    this.successMessage = msg;
    setTimeout(() => this.successMessage = '', 3500);
  }

  get formulaireValide(): boolean {
    return this.nomProduit.trim().length > 0 && this.prix > 0;
  }
}
