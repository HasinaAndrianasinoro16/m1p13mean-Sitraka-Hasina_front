import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    { path: '/dashboard',     title: 'Dashboard',         icon:'nc-bank',             class: '' },
    { path: '/validation',    title: 'Validation',        icon:'nc-check-2',          class: '' },
    { path: '/statistique',   title: 'Statistique',       icon:'nc-chart-bar-32',     class: '' },
    // { path: '/import',        title: 'Import',            icon:'nc-single-copy-04',   class: '' },
];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];

    constructor(private router: Router) {}

    ngOnInit() {
          this.menuItems = ROUTES.filter(menuItem => menuItem);
      }

  logout() {
    // Confirmation avant déconnexion
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      localStorage.clear();

      // localStorage.removeItem('token');
      // localStorage.removeItem('role');
      // localStorage.removeItem('user');

      this.router.navigate(['/login']).then(() => {
        alert('Déconnexion réussie');
      });
    }
  }


  protected readonly localStorage = localStorage;
}
