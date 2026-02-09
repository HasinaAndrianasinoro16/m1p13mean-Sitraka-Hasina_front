import { Component, OnInit } from '@angular/core';
import { ProduitService } from "../../services/produit/produit.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-detail-produits',
  templateUrl: './detail-produits.component.html',
  styleUrls: ['./detail-produits.component.css']
})
export class DetailProduitsComponent implements OnInit {

  produit: any = null;
  selectedImage: File | null = null;
  error: string = '';
  loadingImage = false;

  constructor(
    private produitService: ProduitService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadDetailProduit();
  }

  loadDetailProduit(): void {
    const id = this.route.snapshot.queryParamMap.get('id');

    if (!id) {
      this.error = 'Produit introuvable';
      return;
    }

    this.produitService.getProduitInfo(id).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.produit = response.data.produit;
        }
      },
      error: (err) => {
        console.error(err);
        this.error = 'Erreur lors de la récupération du produit';
      }
    });
  }

  /* =======================
   * SELECTION IMAGE
   * ======================= */
  onImageSelected(event: any): void {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image valide');
      return;
    }

    this.selectedImage = file;
  }

  /* =======================
   * UPLOAD IMAGE
   * ======================= */
  clickModifImage(): void {
    if (!this.selectedImage) {
      alert('Veuillez choisir une image');
      return;
    }

    this.loadingImage = true;

    this.produitService.modifImagePrincipale(
      this.produit._id,
      this.selectedImage
    ).subscribe({
      next: (res: any) => {
        if (res.success) {
          alert('Image ajoutée avec succès');
          this.selectedImage = null;
          this.loadDetailProduit();
        }
        this.loadingImage = false;
      },
      error: (err) => {
        console.error(err);
        alert('Erreur lors de l’upload de l’image');
        this.loadingImage = false;
      }
    });
  }
}
