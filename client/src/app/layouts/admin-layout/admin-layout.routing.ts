import { Routes } from '@angular/router';

import { NotificationsComponent } from '../../pages/notifications/notifications.component';
import {LoginComponent} from "../../pages/login/login.component";
import {AchatsComponent} from "../../pages/achats/achats.component";
import {PanierComponent} from "../../pages/panier/panier.component";
import {CommentairesComponent} from "../../pages/commentaires/commentaires.component";
import {RegisterComponent} from "../../pages/register/register.component";

export const AdminLayoutRoutes: Routes = [
    { path: 'notifications',  component: NotificationsComponent },
    {path: 'login',           component: LoginComponent },
    {path: 'achats',     component: AchatsComponent },
    {path: 'panier',     component: PanierComponent },
    {path: 'commentaire', component: CommentairesComponent},
    {path: 'register', component: RegisterComponent },
];
