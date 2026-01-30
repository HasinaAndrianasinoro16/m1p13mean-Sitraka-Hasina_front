import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { NotificationsComponent } from '../../pages/notifications/notifications.component';
import {LoginComponent} from "../../pages/login/login.component";
import {ProduitsComponent} from "../../pages/produits/produits.component";
import {CommandesComponent} from "../../pages/commandes/commandes.component";
import {AchatsComponent} from "../../pages/achats/achats.component";
import {PanierComponent} from "../../pages/panier/panier.component";
import {StatComponent} from "../../pages/stat/stat.component";
import {CommentairesComponent} from "../../pages/commentaires/commentaires.component";
import {ApreciationsComponent} from "../../pages/apreciations/apreciations.component";
import {RegisterComponent} from "../../pages/register/register.component";

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'notifications',  component: NotificationsComponent },
    {path: 'login',           component: LoginComponent },
    {path: 'produits',        component: ProduitsComponent },
    {path: 'commandes',      component: CommandesComponent },
    {path: 'achats',     component: AchatsComponent },
    {path: 'panier',     component: PanierComponent },
    {path: 'stat',     component: StatComponent },
    {path: 'commentaire', component: CommentairesComponent},
    {path: 'appreciation', component: ApreciationsComponent},
    {path: 'register', component: RegisterComponent },
];
