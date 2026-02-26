import { Component, OnInit } from "@angular/core";
import { ProduitService } from "../../services/produit/produit.service";
import { PanierService } from "../../services/panier/panier.service";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

@Component({
  selector: "app-achats",
  templateUrl: "./achats.component.html",
  styleUrls: ["./achats.component.css"],
})
export class AchatsComponent implements OnInit {
  produits: any[] = [];
  loading: boolean = false;
  error: string = "";
  successMessage: string = "";

  // Pagination (depuis le serveur)
  pagination = {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  };

  // Filtres
  filters = {
    search: "",
    boutique: "",
    categorie: "",
    prixMin: null as number | null,
    prixMax: null as number | null,
    enPromo: false,
    sort: "recent",
  };

  // Listes pour les dropdowns
  boutiques: any[] = [];
  categories: any[] = [];

  // Pour le debounce de la recherche
  private searchSubject = new Subject<string>();

  constructor(
    private catalogueService: ProduitService,
    private panierService: PanierService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Charger les categories et boutiques pour les filtres
    this.loadCategories();
    this.loadBoutiques();

    // Charger les produits
    this.loadProduits();

    // Debounce pour la recherche (attendre 400ms apres la derniere frappe)
    this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => {
        this.pagination.page = 1;
        this.loadProduits();
      });
  }

  /**
   * Charge les categories depuis l'API
   */
  loadCategories(): void {
    this.catalogueService.getCategories().subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.categories = Array.isArray(res.data)
            ? res.data
            : res.data.categories || [];
        }
      },
      error: (err) => console.error("Erreur chargement categories:", err),
    });
  }

  /**
   * Charge les boutiques depuis l'API
   */
  loadBoutiques(): void {
    this.catalogueService.getBoutiques().subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.boutiques = Array.isArray(res.data)
            ? res.data
            : res.data.boutiques || [];
        }
      },
      error: (err) => console.error("Erreur chargement boutiques:", err),
    });
  }

  /**
   * Charge les produits avec pagination et filtres cote serveur
   */
  loadProduits(): void {
    this.loading = true;
    this.error = "";

    // Construire les parametres de requete
    const params: any = {
      page: this.pagination.page,
      limit: this.pagination.limit,
      sort: this.filters.sort,
    };

    // Ajouter les filtres optionnels
    if (this.filters.search) {
      params.search = this.filters.search;
    }
    if (this.filters.categorie) {
      params.categorie = this.filters.categorie;
    }
    if (this.filters.boutique) {
      params.boutique = this.filters.boutique;
    }
    if (this.filters.prixMin !== null && this.filters.prixMin > 0) {
      params.prixMin = this.filters.prixMin;
    }
    if (this.filters.prixMax !== null && this.filters.prixMax > 0) {
      params.prixMax = this.filters.prixMax;
    }
    if (this.filters.enPromo) {
      params.enPromo = true;
    }

    this.catalogueService.getListeProduits(params).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          // Mapper les produits
          this.produits = (
            Array.isArray(res.data.produits) ? res.data.produits : []
          )
            .filter((p: any) => p != null)
            .map((p: any) => ({
              id: p._id,
              nom: p.nom,
              slug: p.slug,
              description: p.description,
              prix: p.prix,
              prixActuel: p.prixActuel ?? p.prix,
              prixPromo: p.prixPromo,
              enPromo: p.enPromo,
              pourcentageReduction: p.pourcentageReduction || 0,
              boutique: p.boutique?.nomBoutique || "Boutique inconnue",
              boutiqueId: p.boutique?._id || "",
              stock: p.stock || 0,
              categorie: p.categorie?.nom || "Sans catégorie",
              categorieId: p.categorie?._id || "",
              image: p.imagePrincipale || "assets/img/default-product.jpg",
              quantite: 1,
            }));

          // Mettre a jour la pagination depuis la reponse serveur
          if (res.data.pagination) {
            this.pagination.page = res.data.pagination.page;
            this.pagination.limit = res.data.pagination.limit;
            this.pagination.total = res.data.pagination.total;
            this.pagination.totalPages = res.data.pagination.totalPages;
          }
        }
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        this.error = "Erreur lors du chargement des produits.";
      },
    });
  }

  /**
   * Getter pour les produits (pour compatibilite template)
   */
  get produitsFiltres(): any[] {
    return this.produits;
  }

  /**
   * Appele lors de la saisie dans le champ recherche
   */
  onSearchChange(value: string): void {
    this.searchSubject.next(value);
  }

  /**
   * Applique les filtres et retourne a la page 1
   */
  onFilterChange(): void {
    this.pagination.page = 1;
    this.loadProduits();
  }

  /**
   * Reset les filtres
   */
  resetFilters(): void {
    this.filters = {
      search: "",
      boutique: "",
      categorie: "",
      prixMin: null,
      prixMax: null,
      enPromo: false,
      sort: "recent",
    };
    this.pagination.page = 1;
    this.loadProduits();
  }

  /**
   * Change de page
   */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.pagination.totalPages) {
      this.pagination.page = page;
      this.loadProduits();
      this.scrollToResults();
    }
  }

  /**
   * Page precedente
   */
  previousPage(): void {
    if (this.pagination.page > 1) {
      this.goToPage(this.pagination.page - 1);
    }
  }

  /**
   * Page suivante
   */
  nextPage(): void {
    if (this.pagination.page < this.pagination.totalPages) {
      this.goToPage(this.pagination.page + 1);
    }
  }

  /**
   * Genere un tableau de numeros de pages pour l'affichage
   */
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const total = this.pagination.totalPages;
    const current = this.pagination.page;
    const maxVisible = 5;

    if (total <= maxVisible) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, current - 2);
      let end = Math.min(total, current + 2);

      if (current <= 3) {
        end = maxVisible;
      } else if (current >= total - 2) {
        start = total - maxVisible + 1;
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  }

  /**
   * Verifie s'il faut afficher les ellipses au debut
   */
  showStartEllipsis(): boolean {
    return this.pagination.totalPages > 5 && this.pagination.page > 3;
  }

  /**
   * Verifie s'il faut afficher les ellipses a la fin
   */
  showEndEllipsis(): boolean {
    return (
      this.pagination.totalPages > 5 &&
      this.pagination.page < this.pagination.totalPages - 2
    );
  }

  /**
   * Scroll vers les resultats
   */
  scrollToResults(): void {
    const element = document.querySelector(".ach-results");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  /**
   * Change le nombre d'elements par page
   */
  onLimitChange(newLimit: string | number): void {
    this.pagination.limit = +newLimit; // Convertir en number
    this.pagination.page = 1;
    this.loadProduits();
  }

  /**
   * Change le tri
   */
  onSortChange(): void {
    this.pagination.page = 1;
    this.loadProduits();
  }

  ajouterAuPanier(produit: any): void {
    if (!localStorage.getItem("token")) {
      alert("Vous devez être connecté pour ajouter des produits au panier.");
      setTimeout(() => this.router.navigate(["/login"]), 100);
      return;
    }

    if (produit.stock === 0) {
      alert("Produit indisponible.");
      return;
    }

    if (produit.quantite < 1) {
      alert("Quantité invalide.");
      return;
    }

    if (produit.quantite > produit.stock) {
      alert(`Stock insuffisant (max : ${produit.stock}).`);
      return;
    }

    this.panierService.ajoutPanier(produit.id, produit.quantite).subscribe({
      next: (res: any) => {
        if (res.success) {
          alert(`${produit.quantite} × ${produit.nom} ajouté(s) au panier !`);
          // this.showSuccess(
          //   `${produit.quantite} × ${produit.nom} ajouté(s) au panier !`,
          // );
          produit.quantite = 1;

        }
      },
      error: (err) => {
        console.error(err);
        alert(err?.error?.message || "Erreur lors de l'ajout au panier.");
      },
    });
  }

  showSuccess(msg: string): void {
    this.successMessage = msg;
    setTimeout(() => (this.successMessage = ""), 3500);
  }

  getStockClass(stock: number): string {
    if (stock > 10) return "stock-ok";
    if (stock > 0) return "stock-low";
    return "stock-empty";
  }
}
