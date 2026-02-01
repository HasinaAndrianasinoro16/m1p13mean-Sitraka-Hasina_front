import { Component, OnInit } from '@angular/core';


export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    { path: '/dashboard',     title: 'Dashboard',         icon:'nc-bank',       class: '' },
    {path: '/produits',     title: 'Produits',         icon:'nc-bag-16',       class: '' },
    {path: '/commandes',     title: 'Commandes',         icon:'nc-bullet-list-67',       class: '' },
    {path: '/stat',       title:'Statistique',         icon:'nc-chart-bar-32',       class: '' },
    {path: '/appreciation', title: 'Appreciation',         icon:'nc-favourite-28',       class: '' },
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

  protected readonly localStorage = localStorage;
}
