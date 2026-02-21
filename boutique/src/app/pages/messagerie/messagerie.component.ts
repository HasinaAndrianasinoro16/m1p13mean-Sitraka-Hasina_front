import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { MessagerieService } from '../../services/messagerie/messagerie.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-messagerie',
  templateUrl: './messagerie.component.html',
  styleUrls: ['./messagerie.component.css']
})
export class MessagerieComponent implements OnInit, OnDestroy, AfterViewChecked {

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  conversations: any[] = [];
  conversationActive: any = null;
  messages: any[] = [];

  searchQuery: string = '';
  filtreActif: 'tous' | 'non_lus' | 'archives' = 'tous';

  nouveauMessage: string = '';

  loading: boolean = false;
  loadingMessages: boolean = false;
  error: string = '';
  successMessage: string = '';

  currentUserId: string = '';
  currentUserRole: string = 'BOUTIQUE';
  currentBoutiqueId: string = ''; 

  private pollingSubscription?: Subscription;
  private shouldScrollToBottom = false;

  constructor(
    private messagerieService: MessagerieService
  ) {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserId = user._id || user.id;
        this.currentUserRole = user.role || 'BOUTIQUE';
        if (user.boutiqueId || user.boutique?._id) {
          this.currentBoutiqueId = user.boutiqueId || user.boutique?._id;
        }
      } catch (e) {
        console.error('Erreur parsing user:', e);
      }
    }
  }

  ngOnInit(): void {
    this.loadConversations();
    this.startPolling();
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
          conv.boutiqueUnreadCount = 0;
        }
        if (this.conversationActive?._id === convId) {
          this.conversationActive.boutiqueUnreadCount = 0;
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
    const participant = this.getAutreParticipant(conv);
    if (!participant) return '?';

    if (participant.prenom && participant.nom) {
      return (participant.prenom[0] + participant.nom[0]).toUpperCase();
    }

    if (participant.nomComplet) {
      const parts = participant.nomComplet.split(' ');
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return participant.nomComplet.substring(0, 2).toUpperCase();
    }

    return '?';
  }

  getAutreParticipant(conv: any): any {
    if (!conv) return null;

    if (conv.client) {
      return conv.client;
    }

    return null;
  }

  getNomAutreParticipant(conv: any): string {
    const participant = this.getAutreParticipant(conv);
    if (!participant) return 'Client';

    if (participant.nomComplet) {
      return participant.nomComplet;
    }

    if (participant.prenom && participant.nom) {
      return `${participant.prenom} ${participant.nom}`;
    }

    if (participant.email) {
      return participant.email.split('@')[0];
    }

    return 'Client';
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
    if (!msg) return false;

    if (msg.senderRole === 'BOUTIQUE') {
      return true;
    }

    if (msg.sender && msg.sender._id === this.currentUserId) {
      return true;
    }

    if (this.currentBoutiqueId && msg.sender?.boutique?._id === this.currentBoutiqueId) {
      return true;
    }

    return false;
  }

  getUnreadCount(conv: any): number {
    if (!conv) return 0;

    return conv.boutiqueUnreadCount || 0;
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
