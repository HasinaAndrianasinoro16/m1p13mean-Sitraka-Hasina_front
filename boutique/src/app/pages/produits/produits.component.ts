import { Component, OnInit } from "@angular/core";
import { ProduitService } from "../../services/produit/produit.service";
import { CategorieService } from "../../services/categorie/categorie.service";

@Component({
  selector: "app-produits",
  templateUrl: "./produits.component.html",
  styleUrls: ["./produits.component.css"],
})
export class ProduitsComponent implements OnInit {
  // ── Formulaire création produit ──
  nomProduit: string = "";
  description: string = "";
  prix: number = 0;
  stock: number = 0;
  categorie: string = "";

  // ── Catégories ──
  categories: any[] = [];

  // ── Ajout de stock ──
  addStock: number = 0;
  selectedId: string = "";
  currentStock: number = 0;

  // ── Gestion Promo ──
  selectedProduit: any = null;
  prixPromo: number = 0;

  // ── Liste produits ──
  produitData: any[] = [];

  // ── États ──
  loading: boolean = false;
  loadingAction: boolean = false;
  error: string = "";
  successMessage: string = "";

  // ── Pagination ──
  currentPage: number = 1;
  limit: number = 5;
  totalPages: number = 0;
  pages: number[] = [];

  constructor(
    private produitService: ProduitService,
    private categorieService: CategorieService,
  ) {}

  ngOnInit(): void {
    this.loadProduits(this.currentPage);
    this.loadCategorie();
  }

  // ══════════════════════════════════════════
  // CHARGEMENT DONNÉES
  // ══════════════════════════════════════════

  loadCategorie(): void {
    this.categorieService.getCategorieListe().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.categories = Array.isArray(response.data.categories)
            ? response.data.categories
            : [];
        }
      },
      error: (err) => console.error("Erreur catégories:", err),
    });
  }

  loadProduits(page: number): void {
    this.loading = true;
    this.error = "";

    this.produitService.getProduitListe(page, this.limit).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.success && response.data) {
          this.produitData = Array.isArray(response.data.produits)
            ? response.data.produits.filter((p: any) => p != null)
            : [];

          const pagination = response.data.pagination;
          this.currentPage = pagination.page;
          this.totalPages = pagination.totalPages;
          this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        }
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        this.error = "Erreur lors de la récupération des produits.";
      },
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.loadProduits(page);
    }
  }

  // ══════════════════════════════════════════
  // CRÉATION PRODUIT
  // ══════════════════════════════════════════

  clickAddProduit(): void {
    if (!this.nomProduit.trim()) {
      this.error = "Le nom du produit est obligatoire.";
      return;
    }
    if (this.prix <= 0) {
      this.error = "Le prix doit être supérieur à 0.";
      return;
    }

    this.loadingAction = true;
    this.error = "";

    this.produitService
      .createProduit(
        this.nomProduit,
        this.description,
        this.prix,
        this.stock,
        this.categorie,
      )
      .subscribe({
        next: (res: any) => {
          this.loadingAction = false;
          if (res.success) {
            this.showSuccess("Produit créé avec succès !");
            this.resetFormulaire();
            this.loadProduits(this.currentPage);
          }
        },
        error: (err) => {
          this.loadingAction = false;
          console.error(err);
          this.error =
            err?.error?.message || "Erreur lors de la création du produit.";
        },
      });
  }

  // ══════════════════════════════════════════
  // GESTION STOCK
  // ══════════════════════════════════════════

  clickInfo(id: string, stock: number): void {
    this.selectedId = id;
    this.currentStock = stock;
    this.addStock = 0;
    this.error = "";
  }

  clickAddStock(id: string, stock: number): void {
    if (!id) {
      this.error = "Produit introuvable.";
      return;
    }
    if (!this.addStock || this.addStock <= 0) {
      this.error = "Quantité invalide.";
      return;
    }

    this.loadingAction = true;
    this.error = "";

    this.produitService.newAjoutStock(id, stock, this.addStock).subscribe({
      next: (res: any) => {
        this.loadingAction = false;
        if (res.success) {
          this.showSuccess(`+${this.addStock} unités ajoutées au stock !`);
          const idx = this.produitData.findIndex(
            (p: any) => p.id === id || p._id === id,
          );
          if (idx !== -1) {
            this.produitData[idx] = {
              ...this.produitData[idx],
              stock: (this.produitData[idx].stock || 0) + this.addStock,
            };
          }
          this.addStock = 0;
        }
      },
      error: (err) => {
        this.loadingAction = false;
        console.error(err);
        this.error = err?.error?.message || "Erreur lors de l'ajout du stock.";
      },
    });
  }

  // ══════════════════════════════════════════
  // GESTION DES PROMOTIONS
  // ══════════════════════════════════════════

  /**
   * Ouvre le modal promo avec les infos du produit
   */
  openPromoModal(produit: any): void {
    this.selectedProduit = produit;
    this.error = "";

    // Pré-remplir avec le prix promo existant ou suggérer -10%
    if (this.isEnPromo(produit)) {
      this.prixPromo = produit.prixPromo;
    } else {
      this.prixPromo = Math.round(produit.prix * 0.9);
    }
  }

  /**
   * Applique la promotion
   */
  appliquerPromo(): void {
    if (!this.selectedProduit) return;

    // Validations
    if (!this.prixPromo || this.prixPromo <= 0) {
      this.error = "Le prix promo doit être supérieur à 0.";
      return;
    }

    if (this.prixPromo >= this.selectedProduit.prix) {
      this.error = "Le prix promo doit être inférieur au prix normal.";
      return;
    }

    this.loadingAction = true;
    this.error = "";

    const produitId = this.selectedProduit._id || this.selectedProduit.id;

    this.produitService.mettreEnPromo(produitId, this.prixPromo).subscribe({
      next: (res: any) => {
        this.loadingAction = false;
        if (res.success) {
          this.showSuccess("Promotion appliquée avec succès !");
          this.loadProduits(this.currentPage);
          this.resetPromoForm();
        }
      },
      error: (err) => {
        this.loadingAction = false;
        console.error(err);
        this.error =
          err?.error?.message || "Erreur lors de l'application de la promo.";
      },
    });
  }

  /**
   * Retire la promotion
   */
  retirerPromo(): void {
    if (!this.selectedProduit) return;

    if (!confirm("Voulez-vous vraiment retirer cette promotion ?")) return;

    this.loadingAction = true;
    this.error = "";

    const produitId = this.selectedProduit._id || this.selectedProduit.id;

    this.produitService.retirerPromo(produitId).subscribe({
      next: (res: any) => {
        this.loadingAction = false;
        if (res.success) {
          this.showSuccess("Promotion retirée avec succès !");
          this.loadProduits(this.currentPage);
          this.resetPromoForm();
        }
      },
      error: (err) => {
        this.loadingAction = false;
        console.error(err);
        this.error =
          err?.error?.message || "Erreur lors du retrait de la promo.";
      },
    });
  }

  /**
   * Vérifie si un produit est actuellement en promo
   * Utilise le champ enPromo du backend
   */
  isEnPromo(produit: any): boolean {
    if (!produit) return false;
    return (
      produit.enPromo === true && produit.prixPromo && produit.prixPromo > 0
    );
  }

  /**
   * Calcule le pourcentage de réduction
   */
  getReductionPercent(produit: any): number {
    if (!produit || !produit.prix || !produit.prixPromo) return 0;
    return Math.round((1 - produit.prixPromo / produit.prix) * 100);
  }

  /**
   * Calcule le pourcentage de réduction pour l'aperçu
   */
  getPreviewReductionPercent(): number {
    if (!this.selectedProduit || !this.selectedProduit.prix || !this.prixPromo)
      return 0;
    if (this.prixPromo >= this.selectedProduit.prix) return 0;
    return Math.round((1 - this.prixPromo / this.selectedProduit.prix) * 100);
  }

  /**
   * Reset le formulaire promo
   */
  resetPromoForm(): void {
    this.selectedProduit = null;
    this.prixPromo = 0;
  }

  // ══════════════════════════════════════════
  // SUPPRESSION
  // ══════════════════════════════════════════

  clickSupprimerProduits(id: string): void {
    if (confirm("Voulez-vous supprimer ce produit définitivement ?")) {
      this.loadingAction = true;
      this.error = "";
      this.produitService.supprimerProduit(id).subscribe({
        next: (res: any) => {
          this.loadingAction = false;
          if (res.success) {
            this.showSuccess("Le produit a été supprimé définitivement");
            this.loadProduits(this.currentPage);
          }
        },
        error: (err) => {
          this.loadingAction = false;
          console.error(err);
          this.error =
            err?.error?.message || "Erreur lors de la suppression du produit.";
        },
      });
    }
  }

  // ══════════════════════════════════════════
  // HELPERS
  // ══════════════════════════════════════════

  resetFormulaire(): void {
    this.nomProduit = "";
    this.description = "";
    this.prix = 0;
    this.stock = 0;
    this.categorie = "";
  }

  showSuccess(msg: string): void {
    this.successMessage = msg;
    setTimeout(() => (this.successMessage = ""), 3500);
  }

  get formulaireValide(): boolean {
    return this.nomProduit.trim().length > 0 && this.prix > 0;
  }

  get promoFormValide(): boolean {
    return (
      this.prixPromo > 0 &&
      this.prixPromo < (this.selectedProduit?.prix || Infinity)
    );
  }
}
