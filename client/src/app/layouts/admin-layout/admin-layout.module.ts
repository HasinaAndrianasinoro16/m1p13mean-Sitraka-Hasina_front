import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminLayoutRoutes } from './admin-layout.routing';

import { DashboardComponent }       from '../../pages/dashboard/dashboard.component';
import {LoginComponent }      from '../../pages/login/login.component';
import {ProduitsComponent} from "../../pages/produits/produits.component";

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {CommandesComponent} from "../../pages/commandes/commandes.component";
import {AchatsComponent} from "../../pages/achats/achats.component";
import {PanierComponent} from "../../pages/panier/panier.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    NgbModule
  ],
  declarations: [
    DashboardComponent,
    LoginComponent,
    ProduitsComponent,
    CommandesComponent,
    AchatsComponent,
    PanierComponent
  ]
})

export class AdminLayoutModule {}
