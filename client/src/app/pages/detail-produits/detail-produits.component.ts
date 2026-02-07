import { Component, OnInit } from '@angular/core';
import {ProduitService} from "../../services/produit/produit.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-detail-produits',
  templateUrl: './detail-produits.component.html',
  styleUrls: ['./detail-produits.component.css']
})
export class DetailProduitsComponent implements OnInit {

  produit: any = null;

  error: string= '';

  constructor(private produitService: ProduitService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadDetailProduit();
  }

  loadDetailProduit(): void {
    const id = this.route.snapshot.queryParamMap.get('id');
    this.produitService.getProduitInfo(id).subscribe({
      next: (response: any) => {
        if(response.success){
          this.produit = response.data.produit;
        }
      },
      error: (err) => {
      console.error(err);
      this.error = 'erreur lors de la recuperation des data';
    }
    })
  }

}
