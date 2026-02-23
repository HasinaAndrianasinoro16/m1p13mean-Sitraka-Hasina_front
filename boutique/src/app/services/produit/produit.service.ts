import { Injectable } from "@angular/core";
import { getAPIUrl } from "../../pages/link/url";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, switchMap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ProduitService {
  baseUrl = getAPIUrl("boutique");

  constructor(private http: HttpClient) {}

  // ══════════════════════════════════════════
  // HEADERS HELPER
  // ══════════════════════════════════════════

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem("token");
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  private getHeadersWithContentType(): HttpHeaders {
    const token = localStorage.getItem("token");
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    });
  }

  // ══════════════════════════════════════════
  // LECTURE
  // ══════════════════════════════════════════

  getProduitListe(page: number = 1, limit: number = 10): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/produits?page=${page}&limit=${limit}&active=true`,
      { headers: this.getHeaders() },
    );
  }

  getProduitInfo(id: string | undefined): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/produits/${id}`, {
      headers: this.getHeaders(),
    });
  }

  // ══════════════════════════════════════════
  // CRÉATION
  // ══════════════════════════════════════════

  createProduit(
    nom: string,
    description: string,
    prix: number,
    stock: number,
    categorie: string,
  ): Observable<any> {
    const produitData = {
      nom: nom,
      description: description,
      prix: prix,
      stock: stock,
      seuilAlerte: 5,
      categorie: categorie,
    };
    return this.http.post<any>(`${this.baseUrl}/produits`, produitData, {
      headers: this.getHeaders(),
    });
  }

  // ══════════════════════════════════════════
  // MODIFICATION
  // ══════════════════════════════════════════

  /**
   * Modifier les informations générales d'un produit
   */
  modifierProduit(
    id: string,
    data: {
      nom?: string;
      description?: string;
      prix?: number;
      categorie?: string;
    },
  ): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/produits/${id}`, data, {
      headers: this.getHeadersWithContentType(),
    });
  }

  // ══════════════════════════════════════════
  // STOCK
  // ══════════════════════════════════════════

  newAjoutStock(
    id: string,
    currentStock: number,
    stock: number,
  ): Observable<any> {
    const newStock = currentStock + stock;
    const stockData = {
      stock: newStock,
      seuilAlerte: 5,
    };

    return this.http.put<any>(
      `${this.baseUrl}/produits/${id}/stock`,
      stockData,
      { headers: this.getHeadersWithContentType() },
    );
  }

  // ══════════════════════════════════════════
  // IMAGE
  // ══════════════════════════════════════════

  modifImagePrincipale(id: string, img: File): Observable<any> {
    const formData = new FormData();
    formData.append("image", img);

    // Pas de Content-Type pour FormData
    return this.http.put<any>(
      `${this.baseUrl}/produits/${id}/image`,
      formData,
      { headers: this.getHeaders() },
    );
  }

  // ══════════════════════════════════════════
  // SUPPRESSION
  // ══════════════════════════════════════════

  supprimerProduit(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/produits/${id}`, {
      headers: this.getHeaders(),
    });
  }

  // ══════════════════════════════════════════
  // PROMOTIONS
  // ══════════════════════════════════════════

  /**
   * Mettre un produit en promotion
   * @param id - ID du produit
   * @param prixPromo - Prix promotionnel
   */
  mettreEnPromo(id: string, prixPromo: number): Observable<any> {
    const promoData = {
      prixPromo: prixPromo,
      enPromo: true,
    };

    return this.http.put<any>(
      `${this.baseUrl}/produits/${id}/promo`,
      promoData,
      { headers: this.getHeadersWithContentType() },
    );
  }

  /**
   * Retirer la promotion d'un produit
   * @param id - ID du produit
   */
  retirerPromo(id: string): Observable<any> {
    const promoData = {
      enPromo: false,
    };

    return this.http.put<any>(
      `${this.baseUrl}/produits/${id}/promo`,
      promoData,
      { headers: this.getHeadersWithContentType() },
    );
  }

  /**
   * Modifier le prix promo d'un produit (sans changer enPromo)
   * @param id - ID du produit
   * @param prixPromo - Nouveau prix promotionnel
   */
  modifierPrixPromo(id: string, prixPromo: number): Observable<any> {
    const promoData = {
      prixPromo: prixPromo,
    };

    return this.http.put<any>(
      `${this.baseUrl}/produits/${id}/promo`,
      promoData,
      { headers: this.getHeadersWithContentType() },
    );
  }

  // ══════════════════════════════════════════
  // MÉTHODE LEGACY (ne fonctionne pas - gardée pour référence)
  // ══════════════════════════════════════════

  ajoutStock(id: string, stock: number): Observable<any> {
    return this.getProduitInfo(id).pipe(
      switchMap((response: any) => {
        const stockActuel = response.data.produit.stock ?? 0;
        const newStock = stockActuel + stock;

        const dataStock = {
          stock: newStock,
          seuilAlerte: 5,
        };

        return this.http.put<any>(
          `${this.baseUrl}/produits/${id}/stock`,
          dataStock,
          { headers: this.getHeaders() },
        );
      }),
    );
  }
}
