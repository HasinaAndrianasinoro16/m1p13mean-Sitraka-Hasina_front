import { Component, OnInit } from '@angular/core';


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
}
