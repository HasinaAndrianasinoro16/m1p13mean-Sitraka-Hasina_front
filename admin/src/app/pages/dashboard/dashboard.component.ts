import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard/dashboard.service';

@Component({
  selector: 'dashboard-cmp',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  stats = {
    boutiques: 0,
    utilisateurs: 0,
    boutiquesPendantes: 0,
    boutiquesValidees: 0,
    chiffreTotal: 0,
    chiffreMois: 0
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
            boutiques: s.boutiques?.total || 0,
            utilisateurs: s.utilisateurs?.total || 0,
            boutiquesPendantes: s.boutiques?.enAttente || 0,
            boutiquesValidees: s.boutiques?.validees || 0,
            chiffreTotal: s.chiffreAffaires?.total || 0,
            chiffreMois: s.chiffreAffaires?.mois || 0
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
