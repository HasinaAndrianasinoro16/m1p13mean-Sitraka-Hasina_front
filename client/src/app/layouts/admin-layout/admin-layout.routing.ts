import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { NotificationsComponent } from '../../pages/notifications/notifications.component';
import {LoginComponent} from "../../pages/login/login.component";
import {ProduitsComponent} from "../../pages/produits/produits.component";
import {CommandesComponent} from "../../pages/commandes/commandes.component";
import {AchatsComponent} from "../../pages/achats/achats.component";
import {PanierComponent} from "../../pages/panier/panier.component";

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'notifications',  component: NotificationsComponent },
    {path: 'login',           component: LoginComponent },
    {path: 'produits',        component: ProduitsComponent },
    {path: 'commandes',      component: CommandesComponent },
    {path: 'achats',     component: AchatsComponent },
    {path: 'panier',     component: PanierComponent },
];
