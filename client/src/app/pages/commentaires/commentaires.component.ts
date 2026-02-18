import { Component, OnInit } from '@angular/core';
import { BoutiqueService } from '../../services/boutique/boutique.service';

@Component({
  selector: 'app-commentaires',
  templateUrl: './commentaires.component.html',
  styleUrls: ['./commentaires.component.css']
})
export class CommentairesComponent implements OnInit {

  boutiques: any[] = [];
  boutiquesFiltered: any[] = [];

  loading: boolean = false;
  error:   string  = '';

  currentPage: number   = 1;
  limit:       number   = 12;
  totalPages:  number   = 0;
  pages:       number[] = [];

  searchText:  string = '';
  sortActive:  string = 'produits_desc';

  constructor(private boutiqueService: BoutiqueService) {}

  ngOnInit(): void {
    this.loadBoutiques(this.currentPage);
  }

  loadBoutiques(page: number): void {
    this.loading = true;
    this.error   = '';

    this.boutiqueService.getListeBoutique(page, this.limit).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.success && response.data) {
          this.boutiques = Array.isArray(response.data.boutiques)
            ? response.data.boutiques.filter((b: any) => b != null) : [];

          this.applyLocalFilter();

          const p        = response.data.pagination;
          this.currentPage = p.page;
          this.totalPages  = p.totalPages;
          this.pages       = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        }
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        this.error = 'Erreur lors du chargement des boutiques.';
      }
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.loadBoutiques(page);
    }
  }

  onSearchChange(): void {
    this.applyLocalFilter();
  }

  applyLocalFilter(): void {
    if (!this.searchText.trim()) {
      this.boutiquesFiltered = [...this.boutiques];
      return;
    }

    const search = this.searchText.toLowerCase().trim();
    this.boutiquesFiltered = this.boutiques.filter((b: any) => {
      const nom  = (b.nomBoutique || '').toLowerCase();
      const desc = (b.description || '').toLowerCase();
      return nom.includes(search) || desc.includes(search);
    });
  }

  getStars(note: number): number[] {
    return Array(Math.round(note)).fill(0);
  }

  getEmptyStars(note: number): number[] {
    return Array(5 - Math.round(note)).fill(0);
  }

  getLogoColor(boutique: any): string {
    const colors = ['#b84a14','#1a4b8c','#2d7a4f','#6c3483','#a07010','#c02020'];
    const seed   = boutique.nomBoutique?.charCodeAt(0) || 0;
    return colors[seed % colors.length];
  }

  getInitiales(boutique: any): string {
    if (!boutique?.nomBoutique) return '?';
    return boutique.nomBoutique
      .split(' ')
      .slice(0, 2)
      .map((w: string) => w[0])
      .join('')
      .toUpperCase();
  }
}
