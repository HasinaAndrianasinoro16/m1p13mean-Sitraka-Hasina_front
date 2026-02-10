import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    {path: '/achats',     title: 'Achats',         icon:'nc-layout-11',       class: '' },
    {path: '/panier',     title: 'Mon Panier',         icon:'nc-basket',       class: '' },
    {path: '/commentaire', title: 'Commentaire',         icon:'nc-chat-33',       class: '' },
    {path: '/commande', title: 'Commande',         icon:'nc-bullet-list-67',       class: '' },
];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }

  constructor(private router: Router) {}

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
