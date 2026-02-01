import { Component } from '@angular/core';

@Component({
  selector: 'app-commentaires',
  templateUrl: './commentaires.component.html',
  styleUrls: ['./commentaires.component.css']
})
export class CommentairesComponent {

  boutiques = [
    {
      id: 1,
      nom: 'Boutique Analakely',
      avis: [
        { note: 8, commentaire: 'Très bon accueil' },
        { note: 9, commentaire: 'Produits de qualité' }
      ]
    },
    {
      id: 2,
      nom: 'Tana Market',
      avis: []
    }
  ];

  selectedBoutique: any = null;

  note: number = 5;
  commentaire: string = '';

  getNoteMoyenne(boutique: any): number {
    if (boutique.avis.length === 0) return 0;
    const total = boutique.avis.reduce((sum: number, a: any) => sum + a.note, 0);
    return Math.round((total / boutique.avis.length) * 10) / 10;
  }

  ouvrirCommentaire(boutique: any) {
    this.selectedBoutique = boutique;
    this.note = 5;
    this.commentaire = '';
  }

  ajouterAvis() {
    if (!this.selectedBoutique) return;

    this.selectedBoutique.avis.push({
      note: this.note,
      commentaire: this.commentaire
    });
  }
}
