import { Component, OnInit } from '@angular/core';
import { BoutiquesService } from '../../services/boutiques/boutiques.service';

@Component({
  selector: 'app-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.scss']
})
export class ValidationComponent implements OnInit {

  boutiqueDataA: any[] = [];
  boutiqueDataV: any[] = [];

  loading: boolean = false;
  error: string = '';


  currentPage: number = 1;
  limit: number = 5;
  totalPages: number = 0;
  pages: number[] = [];

  currentPageV; number = 1;
  limitV: number = 5;
  totalPagesV: number = 0;
  pagesV: number[] = [];

  constructor(private boutiquesService: BoutiquesService) {}


  ngOnInit(): void {
    this.loadBoutiquesAttente(this.currentPage);
    this.loadBoutiquesValidee(this.currentPageV);
  }


  loadBoutiquesAttente(page: number): void {
    this.loading = true;
    this.error = '';

    this.boutiquesService.getBoutiquesEnAttente(page, this.limit).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.boutiqueDataA = response.data.boutiques;

          const pagination = response.data.pagination;
          this.currentPage = pagination.page;
          this.totalPages = pagination.totalPages;

          this.pages = Array.from(
            { length: this.totalPages },
            (_, i) => i + 1
          );
        }
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = "Erreur lors de la récupération des boutiques en attente.";
        this.loading = false;
      }
    });
  }


  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.loadBoutiquesAttente(page);
    }
  }

  goToPageV(page: number): void {
    if(page >= 1 && page <= this.totalPagesV && page !== this.currentPageV) {
      this.loadBoutiquesValidee(page);
    }
  }

  loadBoutiquesValidee(page: number) {
    this.boutiquesService.getBoutiquesValidee().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.boutiqueDataV = response.data.boutiques;

          const pagination = response.data.pagination;
          this.currentPageV = pagination.page;
          this.totalPagesV = pagination.totalPages;

          this.pagesV = Array.from(
            { length: this.totalPagesV },
            (_, i) => i + 1
          );
        }
      },
      error: (err) => {
        console.error(err);
        this.error = "Erreur lors de la récupération des boutiques validées.";
      }
    });
  }

  clickValideeBoutique(id: string | undefined): void {
    this.boutiquesService.valideeboutique(id).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.loadBoutiquesAttente(this.currentPage);
          this.loadBoutiquesValidee(this.currentPageV);
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  clickRejeterBoutique(id: string | undefined): void {
    this.boutiquesService.rejeteBoutique(id).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.loadBoutiquesAttente(this.currentPage);
          this.loadBoutiquesValidee(this.currentPageV);
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

}
