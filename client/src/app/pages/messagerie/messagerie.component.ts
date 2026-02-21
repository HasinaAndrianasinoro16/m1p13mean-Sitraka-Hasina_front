import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { MessagerieService } from '../../services/messagerie/messagerie.service';
import { interval, Subscription } from 'rxjs';
import { BoutiqueService } from "../../services/boutique/boutique.service";

@Component({
  selector: 'app-messagerie',
  templateUrl: './messagerie.component.html',
  styleUrls: ['./messagerie.component.css']
})
export class MessagerieComponent implements OnInit, OnDestroy, AfterViewChecked {

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  conversations: any[] = [];
  boutiques: any = null;
  conversationActive: any = null;
  messages: any[] = [];

  searchQuery: string = '';
  filtreActif: 'tous' | 'non_lus' | 'archives' = 'tous';

  nouveauMessage: string = '';

  loading: boolean = false;
  loadingMessages: boolean = false;
  error: string = '';
  successMessage: string = '';

  selectedBoutiqueId: string = '';
  nouveauSujet: string = 'Renseignement produit';
  nouveauMessageInitial: string = 'Bonjour, j\'ai une question concernant vos produits.';
  showNewConversationModal: boolean = false;

  currentUserId: string = '';
  currentUserRole: string = 'CLIENT';

  // Polling
  private pollingSubscription?: Subscription;
  private shouldScrollToBottom = false;

  constructor(
    private messagerieService: MessagerieService,
    private boutiqueService: BoutiqueService
  ) {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserId = user._id || user.id;
        this.currentUserRole = user.role || 'CLIENT';
      } catch (e) {
        console.error('Erreur parsing user:', e);
      }
    }
  }

  ngOnInit(): void {
    this.loadConversations();
    this.startPolling();
    this.loadBoutiques();
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  loadBoutiques() {
    this.boutiqueService.getListeBoutique(1, 100).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.boutiques = res.data.boutiques;
        }
      },
      error: (err) => {
        console.error('Erreur chargement boutiques:', err);
      }
    });
  }

  demarrerConversation() {
    if (!this.selectedBoutiqueId) {
      this.error = 'Veuillez sélectionner une boutique';
      return;
    }

    this.loading = true;
    this.messagerieService.demarrerConvBoutique(
      this.selectedBoutiqueId,
      this.nouveauMessageInitial,
      this.nouveauSujet
    ).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.success) {
          this.showNewConversationModal = false;
          this.successMessage = 'Conversation démarrée avec succès';

          this.loadConversations();

          this.selectedBoutiqueId = '';
          this.nouveauSujet = 'Renseignement produit';
          this.nouveauMessageInitial = 'Bonjour, j\'ai une question concernant vos produits.';
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Erreur démarrage conversation:', err);
        this.error = 'Erreur lors du démarrage de la conversation';
      }
    });
  }

  startPolling(): void {
    this.pollingSubscription = interval(20000).subscribe(() => {
      if (this.conversationActive) {
        this.loadMessages(this.conversationActive._id, false);
      }
      this.loadConversations(false);
    });
  }

  stopPolling(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  loadConversations(showLoading = true): void {
    if (showLoading) this.loading = true;

    this.messagerieService.listerMesConversations(1, 50).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.success && res.data) {
          this.conversations = (res.data.conversations || []).filter((c: any) => c != null);

          if (this.conversationActive) {
            const updatedConv = this.conversations.find(c => c._id === this.conversationActive._id);
            if (updatedConv) {
              this.conversationActive = updatedConv;
            }
          }
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Erreur chargement conversations:', err);
        if (showLoading) {
          this.error = 'Erreur lors du chargement des conversations.';
        }
      }
    });
  }

  selectionnerConversation(conv: any): void {
    this.conversationActive = conv;
    this.loadMessages(conv._id);
    this.marquerCommeLue(conv._id);
  }

  loadMessages(convId: string, showLoading = true): void {
    if (showLoading) this.loadingMessages = true;

    this.messagerieService.detailsConvPlusMessage(convId, 1, 50).subscribe({
      next: (res: any) => {
        this.loadingMessages = false;
        if (res.success && res.data) {
          this.messages = (res.data.messages || []).filter((m: any) => m != null);

          this.messages.sort((a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );

          console.log('Messages chargés:', this.messages); // Pour debug

          this.shouldScrollToBottom = true;
        }
      },
      error: (err) => {
        this.loadingMessages = false;
        console.error('Erreur chargement messages:', err);
        if (showLoading) {
          this.error = 'Erreur lors du chargement des messages.';
        }
      }
    });
  }

  envoyerMessage(): void {
    if (!this.nouveauMessage.trim() || !this.conversationActive) return;

    const content = this.nouveauMessage.trim();
    this.nouveauMessage = '';

    this.messagerieService.envoyerMessage(this.conversationActive._id, content).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.loadMessages(this.conversationActive._id, false);
          this.loadConversations(false);
          this.shouldScrollToBottom = true;
        }
      },
      error: (err) => {
        console.error('Erreur envoi message:', err);
        this.error = 'Erreur lors de l\'envoi du message.';
        this.nouveauMessage = content;
      }
    });
  }

  marquerCommeLue(convId: string): void {
    this.messagerieService.marquerCommeLue(convId).subscribe({
      next: () => {
        const conv = this.conversations.find(c => c._id === convId);
        if (conv) {
          conv.unreadCount = 0;
          conv.clientUnreadCount = 0;
        }
        if (this.conversationActive?._id === convId) {
          this.conversationActive.unreadCount = 0;
          this.conversationActive.clientUnreadCount = 0;
        }
      },
      error: (err) => console.error('Erreur marquage lecture:', err)
    });
  }

  onSearchChange(): void {
    if (!this.searchQuery.trim() || this.searchQuery.trim().length < 2) {
      this.loadConversations();
      return;
    }

    this.messagerieService.rechercherDansMesConversation(this.searchQuery, 1, 20).subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.conversations = (res.data.results || [])
            .map((r: any) => r.conversation)
            .filter((c: any) => c != null);
        }
      },
      error: (err) => {
        console.error('Erreur recherche:', err);
        this.error = 'Erreur lors de la recherche.';
      }
    });
  }

  appliquerFiltre(filtre: 'tous' | 'non_lus' | 'archives'): void {
    this.filtreActif = filtre;
  }

  getInitiales(conv: any): string {
    if (!conv) return '?';
    const other = this.getAutreParticipant(conv);
    if (!other) return '?';

    if (other.boutique?.nomBoutique) {
      return other.boutique.nomBoutique.substring(0, 2).toUpperCase();
    }

    const prenom = other.prenom?.[0] || '';
    const nom = other.nom?.[0] || '';
    return (prenom + nom).toUpperCase() || '?';
  }

  getAutreParticipant(conv: any): any {
    if (!conv) return null;

    if (conv.boutique) {
      return conv.boutique;
    }

    if (conv.client) {
      return conv.client;
    }

    return null;
  }

  getNomAutreParticipant(conv: any): string {
    const other = this.getAutreParticipant(conv);
    if (!other) return 'Inconnu';

    if (other.boutique?.nomBoutique) {
      return other.boutique.nomBoutique;
    }

    if (other.nomComplet) {
      return other.nomComplet;
    }

    if (other.prenom && other.nom) {
      return `${other.prenom} ${other.nom}`;
    }

    return 'Inconnu';
  }

  getAvatarColor(conv: any): string {
    const colors = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    ];
    const index = (conv?._id?.charCodeAt(0) || 0) % colors.length;
    return colors[index];
  }

  formatTime(date: string): string {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 7) return d.toLocaleDateString('fr-FR');
    if (days > 0) return `${days}j`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}min`;
    return 'À l\'instant';
  }

  formatMessageTime(date: string): string {
    if (!date) return '';
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  isMessageFromMe(msg: any): boolean {
    if (!msg || !msg.sender) return false;

    if (msg.sender._id === this.currentUserId) {
      return true;
    }

    if (this.currentUserRole === 'CLIENT' && msg.senderRole === 'CLIENT') {
      return true;
    }

    if (this.currentUserRole === 'BOUTIQUE' && msg.senderRole === 'BOUTIQUE') {
      return true;
    }

    return false;
  }

  getUnreadCount(conv: any): number {
    if (!conv) return 0;

    // Selon le rôle de l'utilisateur connecté
    if (this.currentUserRole === 'CLIENT') {
      return conv.clientUnreadCount || 0;
    } else {
      return conv.boutiqueUnreadCount || 0;
    }
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        setTimeout(() => {
          const element = this.messagesContainer.nativeElement;
          element.scrollTop = element.scrollHeight;
        }, 100);
      }
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }

  showSuccess(msg: string): void {
    this.successMessage = msg;
    setTimeout(() => (this.successMessage = ''), 3500);
  }

  clearError(): void {
    this.error = '';
  }
}
