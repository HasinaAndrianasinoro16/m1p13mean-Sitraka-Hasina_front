import { Component, OnInit } from '@angular/core';
import { CommandeService } from '../../services/commande/commande.service';

@Component({
  selector: 'app-commandes',
  templateUrl: './commandes.component.html',
  styleUrls: ['./commandes.component.css']
})
export class CommandesComponent implements OnInit {

  commandes: any[] = [];

  loading: boolean = false;
  error: string = '';
  successMessage: string = '';
  generatingInvoice: boolean = false;

  // Confirmation inline
  confirmAnnulId: string | null = null;
  confirmReceptionId: string | null = null;
  confirmPaiementId: string | null = null;

  // Pagination
  currentPage: number = 1;
  limit: number = 10;
  totalPages: number = 0;
  pages: number[] = [];

  constructor(private commandeService: CommandeService) {}

  ngOnInit(): void {
    this.loadCommande(this.currentPage);
  }

  loadCommande(page: number): void {
    this.loading = true;
    this.error = '';

    this.commandeService.getListeCommandes(page, this.limit).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.success && res.data) {
          this.commandes = (Array.isArray(res.data.commandes)
            ? res.data.commandes : [])
            .filter((c: any) => c != null);

          const p = res.data.pagination;
          this.currentPage = p.page;
          this.totalPages = p.totalPages;
          this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        }
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        this.error = 'Erreur lors de la récupération des commandes.';
      }
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.loadCommande(page);
    }
  }

  // ── Annulation ──
  demanderAnnulation(id: string): void {
    this.confirmAnnulId = id;
  }

  annulerDemandeAnnulation(): void {
    this.confirmAnnulId = null;
  }

  confirmerAnnulation(id: string): void {
    this.confirmAnnulId = null;

    this.commandeService.annulerCommande(id).subscribe({
      next: (res: any) => {
        if (res.success) {
          const idx = this.commandes.findIndex((c: any) => c._id === id);
          if (idx !== -1) {
            this.commandes[idx] = { ...this.commandes[idx], statut: 'annulee' };
          }
          this.showSuccess('Commande annulée avec succès.');
        }
      },
      error: (err) => {
        console.error(err);
        this.error = err?.error?.message || 'Erreur lors de l\'annulation.';
      }
    });
  }

  // ── Réception ──
  demanderReception(id: string): void {
    this.confirmReceptionId = id;
  }

  annulerDemandeReception(): void {
    this.confirmReceptionId = null;
  }

  confirmerReception(id: string): void {
    this.confirmReceptionId = null;

    this.commandeService.confirmerReceptionCommande(id).subscribe({
      next: (res: any) => {
        if (res.success) {
          const idx = this.commandes.findIndex((c: any) => c._id === id);
          if (idx !== -1) {
            this.commandes[idx] = { ...this.commandes[idx], statut: 'livree' };
          }
          this.showSuccess('Commande réceptionnée avec succès.');
        }
      },
      error: (err) => {
        console.error(err);
        this.error = err?.error?.message || 'Erreur lors de la réception.';
      }
    });
  }

  demanderPaiement(id: string): void {
    this.confirmPaiementId = id;
  }

  annulerDemandePaiement(): void {
    this.confirmPaiementId = null;
  }

  // ── Paiement avec génération de facture ──
  confirmerPaiement(id: string): void {
    this.confirmPaiementId = null;

    this.commandeService.payerCommande(id).subscribe({
      next: (res: any) => {
        if (res.success) {
          const idx = this.commandes.findIndex((c: any) => c._id === id);
          if (idx !== -1) {
            this.commandes[idx] = { ...this.commandes[idx], paiementStatut: 'paye' };
          }
          this.showSuccess('Paiement effectué avec succès.');

          //ito commentena rah ohatra ka ts ilaina le generer facture
          setTimeout(() => this.genererFacture(id), 500);
        }
      },
      error: (err) => {
        console.error(err);
        this.error = err?.error?.message || 'Erreur lors du paiement.';
      }
    });
  }

  // ── Génération de facture ──
  genererFacture(commandeId: string): void {
    this.generatingInvoice = true;

    // Récupérer les détails de la commande
    this.commandeService.getDetailsCommandes(commandeId).subscribe({
      next: (res: any) => {
        this.generatingInvoice = false;
        if (res.success && res.data) {
          this.creerFacturePDF(res.data.commande);
        }
      },
      error: (err) => {
        this.generatingInvoice = false;
        console.error(err);
        this.error = 'Erreur lors de la génération de la facture.';
      }
    });
  }

  private async creerFacturePDF(commande: any): Promise<void> {
    try {
      const factureWindow = window.open('', '_blank');
      if (!factureWindow) {
        this.error = 'Veuillez autoriser les pop-ups pour télécharger la facture.';
        return;
      }

      const factureHTML = this.genererHTMLFacture(commande);
      factureWindow.document.write(factureHTML);
      factureWindow.document.close();

      setTimeout(() => {
        factureWindow.print();
      }, 500);

      this.showSuccess('Facture générée ! Vérifiez la fenêtre d\'impression.');
    } catch (error) {
      console.error('Erreur génération PDF:', error);
      this.error = 'Erreur lors de la génération du PDF.';
    }
  }

  private genererHTMLFacture(cmd: any): string {
    const dateFacture = new Date().toLocaleDateString('fr-FR');
    const numeroFacture = `FAC-${cmd.numero}-${Date.now().toString().slice(-6)}`;

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Facture ${numeroFacture}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; padding: 40px; background: #fff; color: #333; }
    .facture { max-width: 800px; margin: 0 auto; }
    .header { border-bottom: 3px solid #b84a14; padding-bottom: 20px; margin-bottom: 30px; }
    .header-top { display: flex; justify-content: space-between; align-items: start; }
    .logo { font-size: 28px; font-weight: bold; color: #b84a14; }
    .facture-info { text-align: right; }
    .facture-numero { font-size: 24px; font-weight: bold; color: #1a1a1a; }
    .facture-date { color: #666; margin-top: 5px; }
    .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin: 30px 0; }
    .partie { background: #fafaf8; padding: 20px; border-radius: 8px; border-left: 3px solid #b84a14; }
    .partie-titre { font-weight: bold; color: #b84a14; margin-bottom: 10px; }
    .partie-ligne { margin: 5px 0; font-size: 14px; }
    .table-container { margin: 30px 0; }
    table { width: 100%; border-collapse: collapse; }
    thead { background: #f0ece6; }
    th { padding: 12px; text-align: left; font-weight: bold; font-size: 12px; text-transform: uppercase; color: #6c6c6c; }
    td { padding: 12px; border-bottom: 1px solid #f0ece6; }
    .produit-nom { font-weight: 600; color: #1a1a1a; }
    .text-right { text-align: right; }
    .totaux { margin-top: 30px; display: flex; justify-content: flex-end; }
    .totaux-box { background: #fafaf8; padding: 20px; border-radius: 8px; min-width: 300px; }
    .total-ligne { display: flex; justify-content: space-between; padding: 8px 0; }
    .total-ligne.final { border-top: 2px solid #b84a14; margin-top: 10px; padding-top: 15px; font-size: 18px; font-weight: bold; color: #b84a14; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #f0ece6; text-align: center; color: #9e9a92; font-size: 12px; }
    .badge-paye { display: inline-block; background: #eaf4ee; color: #2d7a4f; padding: 5px 15px; border-radius: 20px; font-weight: bold; font-size: 12px; }
    @media print {
      body { padding: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="facture">
    <!-- HEADER -->
    <div class="header">
      <div class="header-top">
        <div class="logo">E-COMMERCE</div>
        <div class="facture-info">
          <div class="facture-numero">FACTURE</div>
          <div class="facture-date">N° ${numeroFacture}</div>
          <div class="facture-date">Date: ${dateFacture}</div>
        </div>
      </div>
    </div>

    <!-- PARTIES -->
    <div class="parties">
      <div class="partie">
        <div class="partie-titre">CLIENT</div>
        <div class="partie-ligne"><strong>${cmd.client?.nomComplet || 'Client'}</strong></div>
        <div class="partie-ligne">${cmd.client?.email || ''}</div>
        <div class="partie-ligne">${cmd.client?.telephone || ''}</div>
      </div>
      <div class="partie">
        <div class="partie-titre">LIVRAISON</div>
        <div class="partie-ligne"><strong>${cmd.adresseLivraison?.prenom || ''} ${cmd.adresseLivraison?.nom || ''}</strong></div>
        <div class="partie-ligne">${cmd.adresseLivraison?.rue || ''}</div>
        <div class="partie-ligne">${cmd.adresseLivraison?.codePostal || ''} ${cmd.adresseLivraison?.ville || ''}</div>
        <div class="partie-ligne">${cmd.adresseLivraison?.telephone || ''}</div>
      </div>
    </div>

    <!-- PRODUITS -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>PRODUIT</th>
            <th class="text-right">PRIX UNIT.</th>
            <th class="text-right">QTÉ</th>
            <th class="text-right">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          ${(cmd.items || []).map((item: any) => `
            <tr>
              <td class="produit-nom">${item.nom || 'Produit'}</td>
              <td class="text-right">${this.formatNumber(item.prix)} Ar</td>
              <td class="text-right">x${item.quantite}</td>
              <td class="text-right">${this.formatNumber(item.sousTotal)} Ar</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- TOTAUX -->
    <div class="totaux">
      <div class="totaux-box">
        <div class="total-ligne">
          <span>Sous-total:</span>
          <strong>${this.formatNumber(cmd.sousTotal)} Ar</strong>
        </div>
        ${cmd.economies > 0 ? `
        <div class="total-ligne" style="color: #2d7a4f;">
          <span>Économies:</span>
          <strong>- ${this.formatNumber(cmd.economies)} Ar</strong>
        </div>
        ` : ''}
        <div class="total-ligne final">
          <span>TOTAL:</span>
          <strong>${this.formatNumber(cmd.total)} Ar</strong>
        </div>
        <div style="text-align: right; margin-top: 15px;">
          <span class="badge-paye">✓ PAYÉ</span>
        </div>
      </div>
    </div>

    <!-- FOOTER -->
    <div class="footer">
      <div>Merci pour votre commande !</div>
      <div style="margin-top: 5px;">Commande #${cmd.numero} - Facture générée le ${dateFacture}</div>
      <div style="margin-top: 10px;">Mode de paiement: ${cmd.modePaiement || 'Non spécifié'}</div>
    </div>
  </div>

  <script>
    // Auto-print après chargement
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 300);
    };
  </script>
</body>
</html>
    `;
  }

  // ── Helpers statut ──
  getStatutBadgeClass(statut: string): string {
    const m: { [k: string]: string } = {
      'en_attente': 'badge-attente',
      'confirmee': 'badge-confirmee',
      'en_preparation': 'badge-en-cours',
      'en_livraison': 'badge-en-cours',
      'livree': 'badge-livree',
      'annulee': 'badge-annulee'
    };
    return m[statut] || 'badge-attente';
  }

  getStatutTexte(statut: string): string {
    const m: { [k: string]: string } = {
      'en_attente': 'En attente',
      'confirmee': 'Confirmée',
      'en_preparation': 'En préparation',
      'en_livraison': 'En livraison',
      'livree': 'Livrée',
      'annulee': 'Annulée'
    };
    return m[statut] || statut;
  }

  getStatutIcon(statut: string): string {
    const m: { [k: string]: string } = {
      'en_attente': 'nc-watch-time',
      'confirmee': 'nc-check-2',
      'en_preparation': 'nc-box',
      'en_livraison': 'nc-delivery-fast',
      'livree': 'nc-check-2',
      'annulee': 'nc-simple-remove'
    };
    return m[statut] || 'nc-bullet-list-67';
  }

  canAnnuler(statut: string): boolean {
    return statut === 'en_attente';
  }

  canReceptionner(statut: string): boolean {
    return statut === 'en_livraison';
  }

  canPayer(statut: string, paiementStatut: string): boolean {
    return statut === 'livree' && paiementStatut === 'en_attente';
  }

  showVoirDetails(statut: string, paiementStatut: string): boolean {
    return !(this.canAnnuler(statut) || this.canReceptionner(statut) || this.canPayer(statut, paiementStatut));
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('fr-FR').format(num || 0);
  }

  showSuccess(msg: string): void {
    this.successMessage = msg;
    setTimeout(() => (this.successMessage = ''), 3500);
  }
}
