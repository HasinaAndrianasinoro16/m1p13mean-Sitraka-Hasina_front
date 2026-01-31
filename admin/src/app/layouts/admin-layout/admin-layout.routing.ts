import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import {ValidationComponent} from '../../pages/validation/validation.component';
import {StatComponent} from "../../pages/stat/stat.component";
import {LoginComponent} from '../../pages/login/login.component';
import {ExportComponent} from "../../pages/export/export.component";
import {AuthGuard} from "../../guards/auth.guard";
import {DetailBoutiqueComponent} from "../../pages/detail-boutique/detail-boutique.component";

export const AdminLayoutRoutes: Routes = [
    {path: 'dashboard',       component: DashboardComponent,    canActivate: [AuthGuard] },
    {path: 'validation',      component: ValidationComponent,   canActivate: [AuthGuard] },
    {path: 'statistique',     component: StatComponent,         canActivate: [AuthGuard] },
    {path: 'login',           component: LoginComponent, },
    {path: 'import',          component: ExportComponent,       canActivate: [AuthGuard] },
    {path: 'detail-boutique', component: DetailBoutiqueComponent, canActivate: [AuthGuard] },
];
