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
import {StatComponent} from "../../pages/stat/stat.component";
import {CommentairesComponent} from "../../pages/commentaires/commentaires.component";
import {ApreciationsComponent} from "../../pages/apreciations/apreciations.component";
import {RegisterComponent} from "../../pages/register/register.component";

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
    PanierComponent,
    StatComponent,
    CommentairesComponent,
    ApreciationsComponent,
    RegisterComponent,
  ]
})

export class AdminLayoutModule {}
