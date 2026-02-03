import { Routes } from '@angular/router';

import { NotificationsComponent } from '../../pages/notifications/notifications.component';
import {LoginComponent} from "../../pages/login/login.component";
import {AchatsComponent} from "../../pages/achats/achats.component";
import {PanierComponent} from "../../pages/panier/panier.component";
import {CommentairesComponent} from "../../pages/commentaires/commentaires.component";
import {RegisterComponent} from "../../pages/register/register.component";
import {ProfileComponent} from "../../pages/profile/profile.component";
import {AuthGuard} from "../../guards/auth.guard";

export const AdminLayoutRoutes: Routes = [
    { path: 'notifications',  component: NotificationsComponent, canActivate: [AuthGuard] },
    {path: 'login',           component: LoginComponent },
    {path: 'achats',     component: AchatsComponent },
    {path: 'panier',     component: PanierComponent, canActivate: [AuthGuard] },
    {path: 'commentaire', component: CommentairesComponent, canActivate: [AuthGuard] },
    {path: 'register', component: RegisterComponent },
    {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
];
