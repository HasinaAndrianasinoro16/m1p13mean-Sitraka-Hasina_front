import { Component, OnInit, AfterViewInit } from '@angular/core';
import Chart from 'chart.js';
import { DashboardService } from '../../services/dashboard/dashboard.service';

@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.scss']
})
export class StatComponent implements OnInit, AfterViewInit {

  // Charts instances
  private chartHours: any;
  private chartEmail: any;
  private speedChart: any;

  // Données
  graphData: any = null;
  periodeSelectionnee: string = '7jours';

  // États
  loading: boolean = false;
  error: string = '';

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {}

  // AfterViewInit = DOM disponible → canvas accessible
  ngAfterViewInit(): void {
    this.loadGraphData(this.periodeSelectionnee);
  }

  // Charger les données et initialiser les graphiques
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
        console.log('Graph data:', response);

        if (response.success && response.data) {
          this.graphData = response.data;
          this.initCharts(response.data);
        } else {
          // Pas de données : graphiques avec données vides
          this.initCharts(null);
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Erreur chargement graphiques:', err);
        this.error = 'Erreur lors du chargement des statistiques';

        // Afficher quand même les graphiques avec données vides
        this.initCharts(null);
      }
    });
  }

  // Initialiser ou mettre à jour tous les graphiques
  private initCharts(data: any): void {
    // Détruire les anciens graphiques si ils existent
    if (this.chartHours) this.chartHours.destroy();
    if (this.chartEmail) this.chartEmail.destroy();
    if (this.speedChart) this.speedChart.destroy();

    this.initChartHours(data);
    this.initChartEmail(data);
    this.initSpeedChart(data);
  }

  // ===== Graphique lignes principal =====
  private initChartHours(data: any): void {
    const canvas = document.getElementById('chartHours') as HTMLCanvasElement;
    if (!canvas) return;

    // Extraire les labels et données depuis l'API, sinon utiliser des valeurs par défaut
    const labels = data?.chartHours?.labels || data?.labels || ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
    const dataset1 = data?.chartHours?.commandes || data?.commandes || [0, 0, 0, 0, 0, 0, 0];
    const dataset2 = data?.chartHours?.revenus || data?.revenus || [0, 0, 0, 0, 0, 0, 0];
    const dataset3 = data?.chartHours?.visiteurs || data?.visiteurs || [0, 0, 0, 0, 0, 0, 0];

    this.chartHours = new Chart(canvas.getContext('2d'), {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Commandes',
            borderColor: '#6bd098',
            backgroundColor: '#6bd09820',
            pointRadius: 4,
            pointHoverRadius: 6,
            borderWidth: 3,
            fill: true,
            data: dataset1
          },
          {
            label: 'Revenus',
            borderColor: '#f17e5d',
            backgroundColor: '#f17e5d20',
            pointRadius: 4,
            pointHoverRadius: 6,
            borderWidth: 3,
            fill: true,
            data: dataset2
          },
          {
            label: 'Visiteurs',
            borderColor: '#fcc468',
            backgroundColor: '#fcc46820',
            pointRadius: 4,
            pointHoverRadius: 6,
            borderWidth: 3,
            fill: true,
            data: dataset3
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

  // ===== Graphique camembert =====
  private initChartEmail(data: any): void {
    const canvas = document.getElementById('chartEmail') as HTMLCanvasElement;
    if (!canvas) return;

    const pieLabels = data?.repartition?.labels || ['Livrées', 'En attente', 'En cours', 'Annulées'];
    const pieData = data?.repartition?.values || data?.pieData || [0, 0, 0, 0];

    this.chartEmail = new Chart(canvas.getContext('2d'), {
      type: 'pie',
      data: {
        labels: pieLabels,
        datasets: [{
          pointRadius: 0,
          pointHoverRadius: 0,
          backgroundColor: ['#6bd098', '#fcc468', '#4acccd', '#ef8157'],
          borderWidth: 0,
          data: pieData
        }]
      },
      options: {
        legend: { display: true, position: 'bottom' },
        tooltips: { enabled: true },
        scales: {
          yAxes: [{ ticks: { display: false }, gridLines: { drawBorder: false } }],
          xAxes: [{ ticks: { display: false }, gridLines: { display: false } }]
        }
      }
    });
  }

  // ===== Graphique comparaison =====
  private initSpeedChart(data: any): void {
    const canvas = document.getElementById('speedChart') as HTMLCanvasElement;
    if (!canvas) return;

    const labels = data?.comparaison?.labels || data?.labels || ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];
    const anneeActuelle = data?.comparaison?.anneeActuelle || data?.anneeActuelle || new Array(labels.length).fill(0);
    const anneePassee = data?.comparaison?.anneePassee || data?.anneePassee || new Array(labels.length).fill(0);

    this.speedChart = new Chart(canvas.getContext('2d'), {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Année actuelle',
            fill: false,
            borderColor: '#51CACF',
            backgroundColor: 'transparent',
            pointBorderColor: '#51CACF',
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBorderWidth: 3,
            data: anneeActuelle
          },
          {
            label: 'Année précédente',
            fill: false,
            borderColor: '#fbc658',
            backgroundColor: 'transparent',
            pointBorderColor: '#fbc658',
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBorderWidth: 3,
            data: anneePassee
          }
        ]
      },
      options: {
        legend: { display: true, position: 'top' },
        tooltips: { enabled: true, mode: 'index', intersect: false },
        scales: {
          yAxes: [{ ticks: { fontColor: '#9f9f9f', beginAtZero: true } }],
          xAxes: [{ ticks: { fontColor: '#9f9f9f' }, gridLines: { display: false } }]
        }
      }
    });
  }
}
