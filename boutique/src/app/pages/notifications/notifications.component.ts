import { Component, OnInit } from '@angular/core';
import {NotificationsService} from "../../services/notifications/notifications.service";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  loading: boolean = false;
  error: string    = '';

  notifications: any[] = [];

  currentPage: number  = 1;
  limit: number        = 5;
  totalPages: number   = 0;
  pages: number[]      = [];

  constructor(private notificationService: NotificationsService) {}

  ngOnInit(): void {
    this.loadNotification(this.currentPage);
  }

  loadNotification(page: number): void {
    this.loading = true;
    this.error   = '';

    this.notificationService.getListeNotifications(page, this.limit).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.success && res.data) {
          // ✅ Guard Array.isArray pour éviter null
          this.notifications = Array.isArray(res.data.notifications)
            ? res.data.notifications : [];

          const pagination   = res.data.pagination;
          this.currentPage   = pagination.page;
          this.totalPages    = pagination.totalPages;
          this.pages         = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        }
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.error   = 'Erreur lors de la récupération des notifications.';
      }
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.loadNotification(page);
    }
  }

  toutMarquerLue(): void {
    this.notificationService.toutMarquerLue().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.notifications = this.notifications.map(n => ({ ...n, lu: true }));
          window.location.reload();
        }
      },
      error: (err) => console.error(err)
    });
  }

  get nonLuesCount(): number {
    return this.notifications.filter(n => !n.lu).length;
  }

  getIconClass(n: any): string {
    const type = (n.type || '').toUpperCase();
    if (type.includes('CONFIRM') || type.includes('LIVR') || type.includes('SUCCESS'))
      return 'icon-success';
    if (type.includes('ANNUL') || type.includes('REFUS') || type.includes('ECHOU'))
      return 'icon-danger';
    if (type.includes('ATTENTE') || type.includes('RETARD') || type.includes('PENDING'))
      return 'icon-warning';
    if (type.includes('MESSAGE') || type.includes('INFO'))
      return 'icon-info';
    return 'icon-default';
  }

  getIcon(n: any): string {
    const type = (n.type || '').toUpperCase();
    if (type.includes('CONFIRM') || type.includes('LIVR')) return 'nc-check-2';
    if (type.includes('ANNUL')   || type.includes('REFUS')) return 'nc-simple-remove';
    if (type.includes('ATTENTE') || type.includes('RETARD'))return 'nc-watch-time';
    if (type.includes('MESSAGE'))                           return 'nc-chat-33';
    return 'nc-bell-55';
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
}
