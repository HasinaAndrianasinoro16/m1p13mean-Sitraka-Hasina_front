import { Component, OnInit } from '@angular/core';
import {DashboardService} from "../../services/dashboard/dashboard.service";
import {response} from "express";


@Component({
    selector: 'dashboard-cmp',
    moduleId: module.id,
    templateUrl: 'dashboard.component.html'
})

export class DashboardComponent implements OnInit{

  produit: number = 0;
  stock: number = 0;
  commande: number = 0;

  loading: boolean = true;
  error: string = '';

  constructor(private dashboardService: DashboardService) { }

    ngOnInit(){
      this.loadStats();
    }

    loadStats(){
      this.dashboardService.getStats().subscribe({
        next: (response: any) => {
          if(response.success){
            const stat = response.data.stats;
            this.produit = stat.produits.total;
            this.stock = stat.stock.quantiteTotale;
            this.commande = response.data.commandes.enAttente;
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
}
