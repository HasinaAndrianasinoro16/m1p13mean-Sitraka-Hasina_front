import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminLayoutRoutes } from './admin-layout.routing';

import { DashboardComponent }       from '../../pages/dashboard/dashboard.component';
import { ValidationComponent} from "../../pages/validation/validation.component";
import {StatComponent} from "../../pages/stat/stat.component";

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {ExportComponent} from "../../pages/export/export.component";
import {LoginComponent} from "../../pages/login/login.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    NgbModule
  ],
  declarations: [
    DashboardComponent,
    ValidationComponent,
    StatComponent,
    ExportComponent,
    LoginComponent,
  ]
})

export class AdminLayoutModule {}
