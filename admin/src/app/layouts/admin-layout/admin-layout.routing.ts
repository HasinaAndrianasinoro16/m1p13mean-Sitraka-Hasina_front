import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import {ValidationComponent} from '../../pages/validation/validation.component';
import {StatComponent} from "../../pages/stat/stat.component";
import {LoginComponent} from '../../pages/login/login.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    {path: 'validation',      component: ValidationComponent },
    {path: 'statistique',      component: StatComponent },
    {path: 'login',            component: LoginComponent },
];
