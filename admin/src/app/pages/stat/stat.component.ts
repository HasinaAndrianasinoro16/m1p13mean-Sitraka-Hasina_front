import { Component, OnInit, AfterViewInit } from '@angular/core';
import Chart from 'chart.js';
import { DashboardService } from '../../services/dashboard/dashboard.service';

@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.scss']
})
export class StatComponent implements OnInit, AfterViewInit {

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
    this.loadGraphData('7jours');
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
          this.initTousLesGraphiques(response.data);
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Erreur chargement graphiques:', err);
        this.error = 'Erreur lors du chargement des statistiques';
      }
    });
  }

  private detruireGraphiques(): void {
    if (this.chartEvolution)    this.chartEvolution.destroy();
    if (this.chartStatuts)      this.chartStatuts.destroy();
    if (this.chartCategories)   this.chartCategories.destroy();
    if (this.chartInscriptions) this.chartInscriptions.destroy();
  }

  private initTousLesGraphiques(data: any): void {
    this.initChartEvolution(data);
    this.initChartStatuts(data);
    this.initChartCategories(data);
    this.initChartInscriptions(data);
  }

  // ===== 1. Graphique Évolution : commandes + CA par période =====
  private initChartEvolution(data: any): void {
    const canvas = document.getElementById('chartEvolution') as HTMLCanvasElement;
    if (!canvas) return;

    const periodes = data.commandesParPeriode || [];

    // Extraire les labels (dates) et les données
    const labels  = periodes.map((p: any) => p._id);
    const nbCmds  = periodes.map((p: any) => p.commandes);
    const livrees  = periodes.map((p: any) => p.livrees);
    const annulees = periodes.map((p: any) => p.annulees);

    this.chartEvolution = new Chart(canvas.getContext('2d'), {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Commandes',
            borderColor: '#6bd098',
            backgroundColor: '#6bd09820',
            pointRadius: 5,
            pointHoverRadius: 7,
            borderWidth: 3,
            fill: true,
            data: nbCmds
          },
          {
            label: 'Livrées',
            borderColor: '#51CACF',
            backgroundColor: '#51CACF20',
            pointRadius: 5,
            pointHoverRadius: 7,
            borderWidth: 3,
            fill: true,
            data: livrees
          },
          {
            label: 'Annulées',
            borderColor: '#ef8157',
            backgroundColor: '#ef815720',
            pointRadius: 5,
            pointHoverRadius: 7,
            borderWidth: 3,
            fill: true,
            data: annulees
          }
        ]
      },
      options: {
        legend: { display: true, position: 'top' },
        tooltips: { enabled: true, mode: 'index', intersect: false },
        scales: {
          yAxes: [{
            ticks: { fontColor: '#9f9f9f', beginAtZero: true, maxTicksLimit: 5 },
            gridLines: { drawBorder: false, color: 'rgba(0,0,0,0.05)' }
          }],
          xAxes: [{
            gridLines: { display: false },
            ticks: { fontColor: '#9f9f9f', padding: 10 }
          }]
        }
      }
    });
  }

  // ===== 2. Camembert : Commandes par statut =====
  private initChartStatuts(data: any): void {
    const canvas = document.getElementById('chartStatuts') as HTMLCanvasElement;
    if (!canvas) return;

    const statutsMap: { [key: string]: string } = {
      'en_attente':    'En attente',
      'confirmee':     'Confirmée',
      'en_preparation':'En préparation',
      'en_livraison':  'En livraison',
      'livree':        'Livrée',
      'annulee':       'Annulée'
    };

    const statuts = data.commandesParStatut || [];
    const labels  = statuts.map((s: any) => statutsMap[s.statut] || s.statut);
    const values  = statuts.map((s: any) => s.count);

    this.chartStatuts = new Chart(canvas.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          backgroundColor: ['#fcc468', '#6bd098', '#4acccd', '#51CACF', '#6bd098', '#ef8157'],
          borderWidth: 2,
          data: values
        }]
      },
      options: {
        legend: { display: true, position: 'bottom' },
        tooltips: { enabled: true },
        cutoutPercentage: 60
      }
    });
  }

  // ===== 3. Barres : Produits par catégorie =====
  private initChartCategories(data: any): void {
    const canvas = document.getElementById('chartCategories') as HTMLCanvasElement;
    if (!canvas) return;

    const categories = data.produitsParCategorie || [];
    const labels     = categories.map((c: any) => c.categorie);
    const counts     = categories.map((c: any) => c.count);

    this.chartCategories = new Chart(canvas.getContext('2d'), {
      type: 'horizontalBar',
      data: {
        labels,
        datasets: [{
          label: 'Nombre de produits',
          backgroundColor: ['#6bd098', '#fcc468', '#51CACF', '#ef8157', '#4acccd'],
          borderWidth: 0,
          data: counts
        }]
      },
      options: {
        legend: { display: false },
        tooltips: { enabled: true },
        scales: {
          xAxes: [{ ticks: { beginAtZero: true, fontColor: '#9f9f9f' }, gridLines: { color: 'rgba(0,0,0,0.05)' } }],
          yAxes: [{ ticks: { fontColor: '#9f9f9f' }, gridLines: { display: false } }]
        }
      }
    });
  }

  // ===== 4. Barres groupées : Inscriptions par période =====
  private initChartInscriptions(data: any): void {
    const canvas = document.getElementById('chartInscriptions') as HTMLCanvasElement;
    if (!canvas) return;

    const inscriptions = data.inscriptionsParPeriode || [];
    const labels       = inscriptions.map((i: any) => i.date);
    const clients      = inscriptions.map((i: any) => i.clients);
    const boutiques    = inscriptions.map((i: any) => i.boutiques);

    this.chartInscriptions = new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Clients',
            backgroundColor: '#6bd098',
            borderWidth: 0,
            data: clients
          },
          {
            label: 'Boutiques',
            backgroundColor: '#fcc468',
            borderWidth: 0,
            data: boutiques
          }
        ]
      },
      options: {
        legend: { display: true, position: 'top' },
        tooltips: { enabled: true, mode: 'index', intersect: false },
        scales: {
          yAxes: [{ ticks: { beginAtZero: true, fontColor: '#9f9f9f' }, gridLines: { color: 'rgba(0,0,0,0.05)' } }],
          xAxes: [{ ticks: { fontColor: '#9f9f9f' }, gridLines: { display: false } }]
        }
      }
    });
  }

  // Helpers pour le template
  getTotalCommandes(): number {
    return (this.graphData?.commandesParPeriode || [])
      .reduce((sum: number, p: any) => sum + p.commandes, 0);
  }

  getTotalCA(): number {
    return (this.graphData?.commandesParPeriode || [])
      .reduce((sum: number, p: any) => sum + p.ca, 0);
  }

  getTopBoutiques(): any[] {
    return this.graphData?.topBoutiquesCA || [];
  }
}
