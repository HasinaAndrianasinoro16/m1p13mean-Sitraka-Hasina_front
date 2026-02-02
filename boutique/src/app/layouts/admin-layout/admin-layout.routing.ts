import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import {LoginComponent} from "../../pages/login/login.component";
import {ProduitsComponent} from "../../pages/produits/produits.component";
import {CommandesComponent} from "../../pages/commandes/commandes.component";
import {StatComponent} from "../../pages/stat/stat.component";
import {ApreciationsComponent} from "../../pages/apreciations/apreciations.component";
import {RegisterBoutiqueComponent} from "../../pages/register-boutique/register-boutique.component";
import {AuthGuard} from "../../guards/auth.guard";
import {DetailProduitsComponent} from "../../pages/detail-produits/detail-produits.component";

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent, canActivate: [AuthGuard] },
    {path: 'login',           component: LoginComponent },
    {path: 'produits',        component: ProduitsComponent, canActivate: [AuthGuard] },
    {path: 'commandes',      component: CommandesComponent, canActivate: [AuthGuard] },
    {path: 'stat',     component: StatComponent, canActivate: [AuthGuard] },
    {path: 'appreciation', component: ApreciationsComponent, canActivate: [AuthGuard] },
    {path: 'register-boutique', component: RegisterBoutiqueComponent},
    {path: 'detail-produit', component: DetailProduitsComponent, canActivate: [AuthGuard] },
];
