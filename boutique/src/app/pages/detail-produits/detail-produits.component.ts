import { Component, OnInit } from "@angular/core";
import { ProduitService } from "../../services/produit/produit.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-detail-produits",
  templateUrl: "./detail-produits.component.html",
  styleUrls: ["./detail-produits.component.css"],
})
export class DetailProduitsComponent implements OnInit {
  produit: any = {};
  selectedImage: File | null = null;

  // États
  error: string = "";
  successMessage: string = "";
  loadingImage = false;
  loadingPromo = false;
  loadingEdit = false;

  // Mode édition
  editMode = false;
  editForm = {
    nom: "",
    description: "",
    prix: 0,
  };

  // Formulaire promo
  showPromoForm = false;
  prixPromo: number = 0;

  constructor(
    private produitService: ProduitService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loadDetailProduit();
  }

  loadDetailProduit(): void {
    const id = this.route.snapshot.queryParamMap.get("id");

    if (!id) {
      this.error = "Produit introuvable";
      return;
    }

    this.produitService.getProduitInfo(id).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.produit = response.data.produit;
          this.initEditForm();
          this.initPromoForm();
        }
      },
      error: (err) => {
        console.error(err);
        this.error = "Erreur lors de la récupération du produit";
      },
    });
  }

  // ══════════════════════════════════════════
  // ÉDITION PRODUIT
  // ══════════════════════════════════════════

  initEditForm(): void {
    this.editForm = {
      nom: this.produit.nom || "",
      description: this.produit.description || "",
      prix: this.produit.prix || 0,
    };
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.initEditForm();
    }
  }

  saveEdit(): void {
    if (!this.editForm.nom.trim()) {
      this.error = "Le nom est obligatoire";
      return;
    }
    if (this.editForm.prix <= 0) {
      this.error = "Le prix doit être supérieur à 0";
      return;
    }

    this.loadingEdit = true;
    this.error = "";

    this.produitService
      .modifierProduit(this.produit._id, this.editForm)
      .subscribe({
        next: (res: any) => {
          this.loadingEdit = false;
          if (res.success) {
            this.showSuccess("Produit modifié avec succès");
            this.editMode = false;
            this.loadDetailProduit();
          }
        },
        error: (err) => {
          this.loadingEdit = false;
          console.error(err);
          this.error = err?.error?.message || "Erreur lors de la modification";
        },
      });
  }

  // ══════════════════════════════════════════
  // GESTION PROMO
  // ══════════════════════════════════════════

  initPromoForm(): void {
    if (this.isEnPromo()) {
      this.prixPromo = this.produit.prixPromo || 0;
    } else {
      // Suggérer -10%
      this.prixPromo = Math.round(this.produit.prix * 0.9);
    }
  }

  togglePromoForm(): void {
    this.showPromoForm = !this.showPromoForm;
    if (this.showPromoForm) {
      this.initPromoForm();
    }
  }

  /**
   * Vérifie si le produit est actuellement en promo
   * Utilise le champ enPromo du backend
   */
  isEnPromo(): boolean {
    return (
      this.produit?.enPromo === true &&
      this.produit?.prixPromo &&
      this.produit.prixPromo > 0
    );
  }

  /**
   * Calcule le pourcentage de réduction actuel
   */
  getReductionPercent(): number {
    if (!this.produit?.prix || !this.produit?.prixPromo) return 0;
    return Math.round((1 - this.produit.prixPromo / this.produit.prix) * 100);
  }

  /**
   * Calcule le pourcentage de réduction pour l'aperçu
   */
  getPreviewReductionPercent(): number {
    if (!this.produit?.prix || !this.prixPromo) return 0;
    if (this.prixPromo >= this.produit.prix) return 0;
    return Math.round((1 - this.prixPromo / this.produit.prix) * 100);
  }

  /**
   * Applique la promotion
   */
  appliquerPromo(): void {
    // Validations
    if (!this.prixPromo || this.prixPromo <= 0) {
      this.error = "Le prix promo doit être supérieur à 0.";
      return;
    }

    if (this.prixPromo >= this.produit.prix) {
      this.error = "Le prix promo doit être inférieur au prix normal.";
      return;
    }

    this.loadingPromo = true;
    this.error = "";

    this.produitService
      .mettreEnPromo(this.produit._id, this.prixPromo)
      .subscribe({
        next: (res: any) => {
          this.loadingPromo = false;
          if (res.success) {
            this.showSuccess("Promotion appliquée avec succès !");
            this.showPromoForm = false;
            this.loadDetailProduit();
          }
        },
        error: (err) => {
          this.loadingPromo = false;
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
    if (!confirm("Voulez-vous vraiment retirer cette promotion ?")) return;

    this.loadingPromo = true;
    this.error = "";

    this.produitService.retirerPromo(this.produit._id).subscribe({
      next: (res: any) => {
        this.loadingPromo = false;
        if (res.success) {
          this.showSuccess("Promotion retirée avec succès !");
          this.showPromoForm = false;
          this.loadDetailProduit();
        }
      },
      error: (err) => {
        this.loadingPromo = false;
        console.error(err);
        this.error =
          err?.error?.message || "Erreur lors du retrait de la promo.";
      },
    });
  }

  get promoFormValide(): boolean {
    return this.prixPromo > 0 && this.prixPromo < this.produit?.prix;
  }

  // ══════════════════════════════════════════
  // IMAGE
  // ══════════════════════════════════════════

  onImageSelected(event: any): void {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Veuillez sélectionner une image valide");
      return;
    }

    this.selectedImage = file;
  }

  clickModifImage(): void {
    if (!this.selectedImage) {
      alert("Veuillez choisir une image");
      return;
    }

    this.loadingImage = true;

    this.produitService
      .modifImagePrincipale(this.produit._id, this.selectedImage)
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            this.showSuccess("Image modifiée avec succès");
            this.selectedImage = null;
            this.loadDetailProduit();
          }
          this.loadingImage = false;
        },
        error: (err) => {
          console.error(err);
          this.error = "Erreur lors de l'upload de l'image";
          this.loadingImage = false;
        },
      });
  }

  // ══════════════════════════════════════════
  // HELPERS
  // ══════════════════════════════════════════

  showSuccess(msg: string): void {
    this.successMessage = msg;
    setTimeout(() => (this.successMessage = ""), 3500);
  }
}
