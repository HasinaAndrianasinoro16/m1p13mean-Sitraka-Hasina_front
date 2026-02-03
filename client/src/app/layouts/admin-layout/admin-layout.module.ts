import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminLayoutRoutes } from './admin-layout.routing';

import {LoginComponent }      from '../../pages/login/login.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {AchatsComponent} from "../../pages/achats/achats.component";
import {PanierComponent} from "../../pages/panier/panier.component";
import {CommentairesComponent} from "../../pages/commentaires/commentaires.component";
import {RegisterComponent} from "../../pages/register/register.component";
import {ProfileComponent} from "../../pages/profile/profile.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    NgbModule
  ],
  declarations: [
    LoginComponent,
    AchatsComponent,
    PanierComponent,
    CommentairesComponent,
    RegisterComponent,
    ProfileComponent,
  ]
})

export class AdminLayoutModule {}
