import { Component, OnInit } from '@angular/core';
import {BoutiquesService} from "../../services/boutiques/boutiques.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-detail-boutique',
  templateUrl: './detail-boutique.component.html',
  styleUrls: ['./detail-boutique.component.scss']
})
export class DetailBoutiqueComponent implements OnInit {

  boutiqueData: any = null;

  error: string = '';

  constructor(private boutiquesService: BoutiquesService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadBoutiqueData();
  }

  loadBoutiqueData(): void {
    const id = this.route.snapshot.queryParamMap.get('id');
    this.boutiquesService.getBoutiqueById(id).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.boutiqueData = response.data.boutique;
        }
      },
      error: (err) => {
        console.error(err);
        this.error = 'erreur lors de la recuperation des data';
      }
    });
  }

}
