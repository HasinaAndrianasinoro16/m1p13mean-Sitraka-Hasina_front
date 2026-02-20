import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard/dashboard.service';

@Component({
  selector: 'dashboard-cmp',
  moduleId: module.id,
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  stats = {
    produits: 0,
    stock: 0,
    commandes: 0,
    valeurTotale: 0
  };

  loading: boolean = false;
  error: string = '';

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.loading = true;
    this.error = '';

    this.dashboardService.getStats().subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.success && response.data?.stats) {
          const s = response.data.stats;
          this.stats = {
            produits: s.produits?.total || 0,
            stock: s.stock?.quantiteTotale || 0,
            commandes: s.commandes?.enCours || 0,
            valeurTotale: s.stock?.valeurTotale || 0
          };
        }
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        this.error = 'Erreur lors du chargement des statistiques.';
      }
    });
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('fr-FR').format(num);
  }
}
