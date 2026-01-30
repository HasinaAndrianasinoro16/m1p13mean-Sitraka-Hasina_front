import { Component } from '@angular/core';

@Component({
  selector: 'app-apreciations',
  templateUrl: './apreciations.component.html',
  styleUrls: ['./apreciations.component.css']
})
export class ApreciationsComponent {

  boutiqueNom = 'Boutique Star Shop';

  avis = [
    { note: 9, commentaire: 'Très bonne boutique, livraison rapide 👍' },
    { note: 7, commentaire: 'Bon rapport qualité/prix' },
    { note: 5, commentaire: '' },
    { note: 8, commentaire: 'Service client réactif' }
  ];

  get noteMoyenne(): number {
    if (this.avis.length === 0) return 0;
    return Math.round(
      this.avis.reduce((a, b) => a + b.note, 0) / this.avis.length
    );
  }
}
