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
  boutiquesDataS: any[] = [];
  boutiquesDataR: any[] = [];

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

  currentPageR: number = 1;
  limitR: number = 5;
  totalPagesR: number = 0;
  pagesR: number[] = [];

  currentPageS: number = 1;
  limitS: number = 5;
  totalPagesS: number = 0;
  pagesS: number[] = [];

  constructor(private boutiquesService: BoutiquesService) {}


  ngOnInit(): void {
    this.loadBoutiquesAttente(this.currentPage);
    this.loadBoutiquesValidee(this.currentPageV);
    this.loadBoutiqueRejetee(this.currentPageR);
    this.loadBoutiqueSuspendu(this.currentPageS);
  }

  loadBoutiqueSuspendu(page: number) {
    this.loading = true;
    this.error = '';

    this.boutiquesService.getBoutiqueSuspendu(page,this.limitS).subscribe({
      next:(response: any) => {
        if(response.success) {
          this.boutiquesDataS = response.data.boutiques;

          const pagination = response.data.pagination;
          this.currentPageS = pagination.page;
          this.totalPagesS = pagination.totalPages;

          this.pagesS = Array.from(
            {length: this.totalPages},
            (_,i)=> i+1
          );
        }
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = "Erreur lors de la récupération des boutiques en suspendue.";
        this.loading = false;
      }
    });
  }

  loadBoutiqueRejetee(page: number) {
    this.loading = true;
    this.error = '';

    this.boutiquesService.getBoutiqueRejete(page,this.limitR).subscribe({
      next:(response: any) =>{
        if(response.success){
          this.boutiquesDataR = response.data.boutiques;

          const pagination = response.data.pagination;
          this.currentPageR = pagination.page;
          this.totalPagesR = pagination.totalPages;

          this.pagesR = Array.from(
            {length: this.totalPagesR},
            (_,i)=> i+1
          );

        }
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = "Erreur lors de la récupération des boutiques en rejetee.";
        this.loading = false;
      }
    });

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

  goToPageR(page: number): void {
    if(page >= 1 && page <= this.totalPagesR && page !== this.currentPageR) {
      this.loadBoutiqueRejetee(page);
    }
  }

  goToPageS(page: number): void {
    if(page >= 1 && page <= this.totalPagesS && page !== this.currentPageS) {
      this.loadBoutiqueSuspendu(page);
    }
  }

  loadBoutiquesValidee(page: number) {
    this.boutiquesService.getBoutiquesValidee(page, this.limitV).subscribe({
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
          alert('boutique valider')
          this.loadBoutiquesAttente(this.currentPage);
          this.loadBoutiquesValidee(this.currentPageV);
          this.loadBoutiqueRejetee(this.currentPageR);
          this.loadBoutiqueSuspendu(this.currentPageS);
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
          alert('boutique rejeter')
          this.loadBoutiquesAttente(this.currentPage);
          this.loadBoutiquesValidee(this.currentPageV);
          this.loadBoutiqueRejetee(this.currentPageR);
          this.loadBoutiqueSuspendu(this.currentPageS);
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  clickSuspendre(id: string | undefined): void {
    this.boutiquesService.suspendreBoutique(id).subscribe({
      next: (response: any) => {
        if (response.success) {
          alert('boutique suspendue');
          this.loadBoutiquesAttente(this.currentPage);
          this.loadBoutiquesValidee(this.currentPageV);
          this.loadBoutiqueRejetee(this.currentPageR);
          this.loadBoutiqueSuspendu(this.currentPageS);
        }
      }
    });
  }

  clickReactiver(id: string | undefined): void {
    this.boutiquesService.reactiverBoutique(id).subscribe({
      next: (response: any) => {
        if (response.success) {
          alert('boutique reactiver');
          this.loadBoutiquesAttente(this.currentPage);
          this.loadBoutiquesValidee(this.currentPageV);
          this.loadBoutiqueRejetee(this.currentPageR);
          this.loadBoutiqueSuspendu(this.currentPageS);
        }
      }
    });
  }

  clickSupprimer(id: string | undefined): void {
   if(confirm('vouvlez vous vraiment supprimer cette boutique')){
     this.boutiquesService.supprimerBoutique(id).subscribe({
       next: (response: any) => {
         if (response.success) {
           alert('boutique supprimer definitivement');
           this.loadBoutiquesAttente(this.currentPage);
           this.loadBoutiquesValidee(this.currentPageV);
           this.loadBoutiqueRejetee(this.currentPageR);
           this.loadBoutiqueSuspendu(this.currentPageS);
         }
       }
     });
   }
  }

}
