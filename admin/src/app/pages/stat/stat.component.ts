import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import Chart from 'chart.js';
import { DashboardService } from '../../services/dashboard/dashboard.service';

@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.css']
})
export class StatComponent implements OnInit, AfterViewInit, OnDestroy {

  // Instances des graphiques
  private chartEvolution: any;
  private chartStatuts: any;
  private chartCategories: any;
  private chartInscriptions: any;

  // Données brutes de l'API
  graphData: any = null;
  periodeSelectionnee: string = '7jours';

  // États
  loading: boolean = false;
  error: string = '';

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => this.loadGraphData('7jours'), 100);
  }

  ngOnDestroy(): void {
    this.detruireGraphiques();
  }

  loadGraphData(periode: string): void {
    this.loading = true;
    this.error = '';
    this.periodeSelectionnee = periode;

    const request = periode === '7jours'
      ? this.dashboardService.getGraphSeptjour()
      : this.dashboardService.getGraphPeriode(periode);

    request.subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.success && response.data) {
          this.graphData = response.data;
          this.detruireGraphiques();
          setTimeout(() => this.initTousLesGraphiques(response.data), 100);
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Erreur chargement graphiques:', err);
        this.error = 'Erreur lors du chargement des statistiques.';
      }
    });
  }

  private detruireGraphiques(): void {
    if (this.chartEvolution) this.chartEvolution.destroy();
    if (this.chartStatuts) this.chartStatuts.destroy();
    if (this.chartCategories) this.chartCategories.destroy();
    if (this.chartInscriptions) this.chartInscriptions.destroy();
  }

  private initTousLesGraphiques(data: any): void {
    this.initChartEvolution(data);
    this.initChartStatuts(data);
    this.initChartCategories(data);
    this.initChartInscriptions(data);
  }

  // ===== 1. Évolution commandes =====
  private initChartEvolution(data: any): void {
    const canvas = document.getElementById('chartEvolution') as HTMLCanvasElement;
    if (!canvas) return;

    const periodes = data.commandesParPeriode || [];
    const labels = periodes.map((p: any) => p._id);
    const nbCmds = periodes.map((p: any) => p.commandes);
    const livrees = periodes.map((p: any) => p.livrees || 0);
    const annulees = periodes.map((p: any) => p.annulees || 0);

    this.chartEvolution = new Chart(canvas.getContext('2d'), {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Commandes',
            borderColor: '#2d7a4f',
            backgroundColor: 'rgba(45,122,79,0.1)',
            pointRadius: 4,
            pointHoverRadius: 6,
            borderWidth: 3,
            fill: true,
            data: nbCmds
          },
          {
            label: 'Livrées',
            borderColor: '#1a4b8c',
            backgroundColor: 'rgba(26,75,140,0.1)',
            pointRadius: 4,
            pointHoverRadius: 6,
            borderWidth: 3,
            fill: true,
            data: livrees
          },
          {
            label: 'Annulées',
            borderColor: '#c02020',
            backgroundColor: 'rgba(192,32,32,0.1)',
            pointRadius: 4,
            pointHoverRadius: 6,
            borderWidth: 3,
            fill: true,
            data: annulees
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        legend: { display: false },
        tooltips: { enabled: true, mode: 'index', intersect: false },
        scales: {
          yAxes: [{
            ticks: { fontColor: '#9e9a92', beginAtZero: true, maxTicksLimit: 5 },
            gridLines: { drawBorder: false, color: 'rgba(0,0,0,0.05)' }
          }],
          xAxes: [{
            gridLines: { display: false },
            ticks: { fontColor: '#9e9a92', padding: 10 }
          }]
        }
      }
    });
  }

  // ===== 2. Camembert statuts =====
  private initChartStatuts(data: any): void {
    const canvas = document.getElementById('chartStatuts') as HTMLCanvasElement;
    if (!canvas) return;

    const statutsMap: { [key: string]: string } = {
      'en_attente': 'En attente',
      'confirmee': 'Confirmée',
      'en_preparation': 'En préparation',
      'en_livraison': 'En livraison',
      'livree': 'Livrée',
      'annulee': 'Annulée'
    };

    const statuts = data.commandesParStatut || [];
    const labels = statuts.map((s: any) => statutsMap[s.statut] || s.statut);
    const values = statuts.map((s: any) => s.count);

    this.chartStatuts = new Chart(canvas.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          backgroundColor: ['#a07010', '#2d7a4f', '#b84a14', '#1a4b8c', '#6c3b83', '#c02020'],
          borderWidth: 0,
          data: values
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        legend: { display: true, position: 'bottom', labels: { boxWidth: 12, fontSize: 11 } },
        tooltips: { enabled: true },
        cutoutPercentage: 65
      }
    });
  }

  // ===== 3. Barres catégories =====
  private initChartCategories(data: any): void {
    const canvas = document.getElementById('chartCategories') as HTMLCanvasElement;
    if (!canvas) return;

    const categories = data.produitsParCategorie || [];
    const labels = categories.map((c: any) => c.categorie);
    const counts = categories.map((c: any) => c.count);

    this.chartCategories = new Chart(canvas.getContext('2d'), {
      type: 'horizontalBar',
      data: {
        labels,
        datasets: [{
          label: 'Produits',
          backgroundColor: '#b84a14',
          borderWidth: 0,
          data: counts
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: false },
        tooltips: { enabled: true },
        scales: {
          xAxes: [{
            ticks: { beginAtZero: true, fontColor: '#9e9a92' },
            gridLines: { color: 'rgba(0,0,0,0.05)' }
          }],
          yAxes: [{
            ticks: { fontColor: '#9e9a92' },
            gridLines: { display: false }
          }]
        }
      }
    });
  }

  // ===== 4. Barres inscriptions =====
  private initChartInscriptions(data: any): void {
    const canvas = document.getElementById('chartInscriptions') as HTMLCanvasElement;
    if (!canvas) return;

    const inscriptions = data.inscriptionsParPeriode || [];
    const labels = inscriptions.map((i: any) => i.date);
    const clients = inscriptions.map((i: any) => i.clients || 0);
    const boutiques = inscriptions.map((i: any) => i.boutiques || 0);

    this.chartInscriptions = new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Clients',
            backgroundColor: '#1a4b8c',
            borderWidth: 0,
            data: clients
          },
          {
            label: 'Boutiques',
            backgroundColor: '#b84a14',
            borderWidth: 0,
            data: boutiques
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: false },
        tooltips: { enabled: true, mode: 'index', intersect: false },
        scales: {
          yAxes: [{
            ticks: { beginAtZero: true, fontColor: '#9e9a92' },
            gridLines: { color: 'rgba(0,0,0,0.05)' }
          }],
          xAxes: [{
            ticks: { fontColor: '#9e9a92' },
            gridLines: { display: false }
          }]
        }
      }
    });
  }

  // ── Helpers ──
  getTotalCommandes(): number {
    return (this.graphData?.commandesParPeriode || [])
      .reduce((sum: number, p: any) => sum + (p.commandes || 0), 0);
  }

  getTotalCA(): number {
    return (this.graphData?.commandesParPeriode || [])
      .reduce((sum: number, p: any) => sum + (p.ca || 0), 0);
  }

  getTopBoutiques(): any[] {
    return this.graphData?.topBoutiquesCA || [];
  }

  getBoutiquesValidees(): number {
    const statuts = this.graphData?.boutiquesParStatut || [];
    const validees = statuts.find((s: any) => s.statut === 'validees');
    return validees?.count || 0;
  }

  getNbCategories(): number {
    return (this.graphData?.produitsParCategorie || []).length;
  }

  getPeriodeLabel(): string {
    const labels: any = {
      '7jours': '7 derniers jours',
      '30jours': '30 derniers jours',
      '12mois': '12 derniers mois'
    };
    return labels[this.periodeSelectionnee] || '';
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('fr-FR').format(num);
  }
}
