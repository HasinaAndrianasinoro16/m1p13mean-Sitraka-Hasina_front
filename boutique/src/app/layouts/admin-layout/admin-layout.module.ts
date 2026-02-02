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
import {StatComponent} from "../../pages/stat/stat.component";
import {ApreciationsComponent} from "../../pages/apreciations/apreciations.component";
import {RegisterBoutiqueComponent} from "../../pages/register-boutique/register-boutique.component";
import {DetailProduitsComponent} from "../../pages/detail-produits/detail-produits.component";

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
    StatComponent,
    ApreciationsComponent,
    RegisterBoutiqueComponent,
    DetailProduitsComponent,
  ]
})

export class AdminLayoutModule {}
