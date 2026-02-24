import { Component, OnInit } from '@angular/core';
import { BoutiquesService } from '../../services/boutiques/boutiques.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-detail-boutique',
  templateUrl: './detail-boutique.component.html',
  styleUrls: ['./detail-boutique.component.css']
})
export class DetailBoutiqueComponent implements OnInit {

  boutiqueData: any = null;
  loading: boolean = false;
  error: string = '';

  constructor(
    private boutiquesService: BoutiquesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBoutiqueData();
  }

  loadBoutiqueData(): void {
    const id = this.route.snapshot.queryParamMap.get('id');

    if (!id) {
      this.error = 'ID de boutique manquant.';
      return;
    }

    this.loading = true;
    this.error = '';

    this.boutiquesService.getBoutiqueById(id).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.success && response.data?.boutique) {
          this.boutiqueData = response.data.boutique;
        } else {
          this.error = 'Boutique introuvable.';
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Erreur chargement boutique:', err);
        this.error = 'Erreur lors de la récupération des informations.';
      }
    });
  }

  /**
   * Génère les initiales pour l'avatar
   */
  getInitiales(): string {
    if (!this.boutiqueData?.boutique?.nomBoutique) return '?';

    const nom = this.boutiqueData.boutique.nomBoutique.trim();
    const words = nom.split(' ').filter((w: string) => w.length > 0);

    if (words.length === 0) return '?';
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();

    return (words[0][0] + words[1][0]).toUpperCase();
  }

  /**
   * Vérifie si des stats sont disponibles
   */
  hasStats(): boolean {
    if (!this.boutiqueData) return false;

    return (
      this.boutiqueData.produitsActifs !== undefined ||
      this.boutiqueData.noteMoyenne !== undefined ||
      this.boutiqueData.nombreAvis !== undefined
    );
  }

  /**
   * Retour à la liste
   */
  retour(): void {
    this.router.navigate(['/validation']);
  }
}
