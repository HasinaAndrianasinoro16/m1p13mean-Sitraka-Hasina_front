import { Component } from '@angular/core';

@Component({
  selector: 'app-commandes',
  templateUrl: './commandes.component.html',
  styleUrls: ['./commandes.component.css']
})
export class CommandesComponent {

  commandes = [
    {
      numero: 'CMD-001',
      destinataire: 'Jean Rakoto',
      produit: 'Riz blanc',
      quantite: 5,
      prixTotal: 25000
    },
    {
      numero: 'CMD-002',
      destinataire: 'Marie Rasoanaivo',
      produit: 'Huile',
      quantite: 2,
      prixTotal: 18000
    },
    {
      numero: 'CMD-003',
      destinataire: 'Paul Andry',
      produit: 'Sucre',
      quantite: 3,
      prixTotal: 12000
    },
    {
      numero: 'CMD-004',
      destinataire: 'Sitraka',
      produit: 'Farine',
      quantite: 4,
      prixTotal: 16000
    }
  ];

  currentPage = 1;
  itemsPerPage = 3;

  get paginatedCommandes() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.commandes.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number[] {
    return Array(Math.ceil(this.commandes.length / this.itemsPerPage))
      .fill(0)
      .map((_, i) => i + 1);
  }

  changePage(page: number) {
    this.currentPage = page;
  }

  validerCommande(cmd: any) {
    alert(`Commande ${cmd.numero} validée ✅`);
  }

  refuserCommande(cmd: any) {
    alert(`Commande ${cmd.numero} refusée ❌`);
  }
}
