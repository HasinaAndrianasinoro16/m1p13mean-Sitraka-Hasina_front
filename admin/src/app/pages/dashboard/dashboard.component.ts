import { Component, OnInit } from '@angular/core';
import { getAPIUrl } from "../../link/url";
import {DashboardService} from "../../services/dashboard/dashboard.service";


@Component({
  selector: 'dashboard-cmp',
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  magasin: number = 0;
  user: number = 0;
  attente: number = 0;
  valide: number = 0;

  // URL de base
  baseurl = getAPIUrl('admin');

  loading: boolean = true;
  error: string = '';

  constructor(private dashboardService: DashboardService) {
  }

  ngOnInit() {
    this.dashboardService.getStats().subscribe({
      next: (response: any) => {
        if (response.success) {
          const stats = response.data.stats;
          this.magasin = stats.boutiques.total;
          this.user = stats.utilisateurs.total;
          this.attente = stats.boutiques.enAttente;
          this.valide = stats.boutiques.validees;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = "Erreur lors de la récupération des statistiques";
        this.loading = false;
      }
    });
  }

  // constructor(
  //   private http: HttpClient,
  // ) {}
  //
  // ngOnInit() {
  //   const token = localStorage.getItem('token');
  //
  //   this.http.get(`${this.baseurl}/dashboard`, {
  //     headers: {
  //       'Authorization': `Bearer ${token}`
  //     }
  //   }).subscribe({
  //     next: (response: any) => {
  //       if(response.success) {
  //         const stats = response.data.stats;
  //         this.magasin = stats.boutiques.total;
  //         this.user = stats.utilisateurs.total;
  //         this.loading = false;
  //       }
  //     },
  //     error: (err) => {
  //       console.error(err);
  //       this.error = "Erreur lors de la récupération des statistiques";
  //       this.loading = false;
  //     }
  //   });
  // }

}
