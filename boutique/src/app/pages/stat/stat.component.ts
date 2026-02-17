import { Component, OnInit, AfterViewInit } from '@angular/core';
import Chart from 'chart.js';
import { DashboardService } from '../../services/dashboard/dashboard.service';

@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.css']
})
export class StatComponent implements OnInit, AfterViewInit {

  periodeActive: string = '30jours';
  periodes = [
    { label: '7 jours',  value: '7jours'  },
    { label: '30 jours', value: '30jours' },
    { label: '12 mois',  value: '12mois'  }
  ];

  loading: boolean = false;
  error: string    = '';

  ventesData:  any[] = [];
  topProduits: any[] = [];

  private chartVentes:   any = null;
  private chartProduits: any = null;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => this.loadGraphique(this.periodeActive), 100);
  }

  changerPeriode(periode: string): void {
    if (this.periodeActive === periode) return;
    this.periodeActive = periode;
    this.loadGraphique(periode);
  }

  loadGraphique(periode: string): void {
    this.loading    = true;
    this.error      = '';
    this.ventesData  = [];
    this.topProduits = [];

    if (this.chartVentes)   { this.chartVentes.destroy();   this.chartVentes   = null; }
    if (this.chartProduits) { this.chartProduits.destroy(); this.chartProduits = null; }

    this.dashboardService.getGraphperiodique(periode).subscribe({
      next: (response: any) => {
        if (response?.success && response?.data) {
          this.ventesData  = Array.isArray(response.data.ventesParPeriode)
            ? response.data.ventesParPeriode : [];
          this.topProduits = Array.isArray(response.data.topProduits)
            ? response.data.topProduits : [];
        }

        this.loading = false;

        setTimeout(() => {
          this.buildChartVentes();
          this.buildChartProduits();
        }, 50);
      },
      error: () => {
        this.loading = false;
        this.error   = 'Erreur lors du chargement des données.';
      }
    });
  }

  buildChartVentes(): void {
    if (!Array.isArray(this.ventesData) || this.ventesData.length === 0) return;

    const canvas: any = document.getElementById('chartVentes');
    if (!canvas) return;

    if (this.chartVentes) { this.chartVentes.destroy(); this.chartVentes = null; }

    const labels  = this.ventesData.map(d => this.formatLabel(d._id));
    const ca      = this.ventesData.map(d => d.ca       || 0);
    const cmds    = this.ventesData.map(d => d.commandes || 0);
    const livrees = this.ventesData.map(d => d.livrees   || 0);

    this.chartVentes = new Chart(canvas.getContext('2d'), {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'CA (Ar)',
            data: ca,
            borderColor: '#b84a14',
            backgroundColor: 'rgba(184,74,20,.08)',
            pointBackgroundColor: '#b84a14',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            borderWidth: 2.5,
            fill: true,
            tension: 0.4,
            yAxisID: 'y-ca'
          },
          {
            label: 'Commandes',
            data: cmds,
            borderColor: '#1a4b8c',
            backgroundColor: 'rgba(26,75,140,.07)',
            pointBackgroundColor: '#1a4b8c',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            yAxisID: 'y-cmds'
          },
          {
            label: 'Livrées',
            data: livrees,
            borderColor: '#2d7a4f',
            backgroundColor: 'transparent',
            pointBackgroundColor: '#2d7a4f',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            borderWidth: 2,
            borderDash: [5, 4],
            fill: false,
            tension: 0.4,
            yAxisID: 'y-cmds'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        legend: { display: false },
        tooltips: {
          mode: 'index',
          intersect: false,
          backgroundColor: '#1a1a1a',
          titleFontColor: '#fff',
          bodyFontColor: '#ccc',
          callbacks: {
            label: (item: any, data: any) => {
              const lbl = data.datasets[item.datasetIndex].label;
              const val = item.yLabel;
              if (lbl === 'CA (Ar)') return ` CA : ${Number(val).toLocaleString('fr-FR')} Ar`;
              return ` ${lbl} : ${val}`;
            }
          }
        },
        scales: {
          yAxes: [
            {
              id: 'y-ca',
              position: 'left',
              ticks: {
                fontColor: '#9e9a92',
                beginAtZero: true,
                maxTicksLimit: 5,
                callback: (v: any) => v >= 1000 ? (v / 1000) + 'k' : v
              },
              gridLines: { color: 'rgba(0,0,0,.04)', drawBorder: false, zeroLineColor: '#e8e4de' }
            },
            {
              id: 'y-cmds',
              position: 'right',
              ticks: { fontColor: '#9e9a92', beginAtZero: true, maxTicksLimit: 5, stepSize: 1 },
              gridLines: { display: false }
            }
          ],
          xAxes: [{
            ticks: { fontColor: '#9e9a92', padding: 10 },
            gridLines: { color: 'rgba(0,0,0,.04)', drawBorder: false, zeroLineColor: 'transparent' }
          }]
        }
      }
    });
  }

  buildChartProduits(): void {
    if (!Array.isArray(this.topProduits) || this.topProduits.length === 0) return;

    const canvas: any = document.getElementById('chartProduits');
    if (!canvas) return;

    if (this.chartProduits) { this.chartProduits.destroy(); this.chartProduits = null; }

    const labels = this.topProduits.map(p => p.nom);
    const ca     = this.topProduits.map(p => p.caGenere || 0);

    this.chartProduits = new Chart(canvas.getContext('2d'), {
      type: 'horizontalBar',
      data: {
        labels,
        datasets: [{
          label: 'CA généré (Ar)',
          data: ca,
          backgroundColor: [
            'rgba(184,74,20,.75)',
            'rgba(26,75,140,.75)',
            'rgba(45,122,79,.75)',
            'rgba(160,112,16,.75)'
          ],
          borderColor: ['#b84a14','#1a4b8c','#2d7a4f','#a07010'],
          borderWidth: 1.5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: false },
        tooltips: {
          backgroundColor: '#1a1a1a',
          titleFontColor: '#fff',
          bodyFontColor: '#ccc',
          callbacks: {
            label: (item: any) => ` CA : ${Number(item.xLabel).toLocaleString('fr-FR')} Ar`
          }
        },
        scales: {
          xAxes: [{
            ticks: {
              fontColor: '#9e9a92',
              beginAtZero: true,
              callback: (v: any) => v >= 1000 ? (v / 1000) + 'k' : v
            },
            gridLines: { color: 'rgba(0,0,0,.04)', drawBorder: false, zeroLineColor: '#e8e4de' }
          }],
          yAxes: [{
            ticks: { fontColor: '#3d3a35' },
            gridLines: { display: false }
          }]
        }
      }
    });
  }

  getTotalCA(): number {
    if (!Array.isArray(this.ventesData) || !this.ventesData.length) return 0;
    return this.ventesData.reduce((s, d) => s + (d?.ca || 0), 0);
  }

  getTotalCommandes(): number {
    if (!Array.isArray(this.ventesData) || !this.ventesData.length) return 0;
    return this.ventesData.reduce((s, d) => s + (d?.commandes || 0), 0);
  }

  getTotalLivrees(): number {
    if (!Array.isArray(this.ventesData) || !this.ventesData.length) return 0;
    return this.ventesData.reduce((s, d) => s + (d?.livrees || 0), 0);
  }

  getTotalAnnulees(): number {
    if (!Array.isArray(this.ventesData) || !this.ventesData.length) return 0;
    return this.ventesData.reduce((s, d) => s + (d?.annulees || 0), 0);
  }

  formatLabel(id: string): string {
    if (!id) return '';
    if (id.length === 10) {
      const [, m, d] = id.split('-');
      return `${d}/${m}`;
    }
    if (id.length === 7) {
      const [y, m] = id.split('-');
      const mois = ['','Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];
      return `${mois[+m]} ${y.slice(2)}`;
    }
    return id;
  }

  formatNumber(n: number): string {
    if (!n || isNaN(n)) return '0';
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000)     return (n / 1_000).toFixed(0) + 'k';
    return String(n);
  }
}
