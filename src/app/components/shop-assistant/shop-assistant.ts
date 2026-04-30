import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ChatbotRecommendationService } from '../../services/chatbot-recommendation.service';
import { ChatbotLlmService } from '../../services/chatbot-llm.service';
import { MonitoringService } from '../../services/monitoring.service';

interface ChatMessage {
  role: 'assistant' | 'user';
  text: string;
  products?: Product[];
}

@Component({
  selector: 'app-shop-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shop-assistant.html',
  styleUrls: ['./shop-assistant.css']
})
export class ShopAssistantComponent implements OnInit, OnDestroy {
  open = false;
  loadingProducts = true;
  sending = false;
  userInput = '';
  settingsOpen = false;
  llmModel = 'openrouter/free';
  messages: ChatMessage[] = [
    {
      role: 'assistant',
      text: 'Szia! A TDL Webshop termékei alapján tudok ajánlani, és épületgépészeti kérdésekben is segítek.'
    }
  ];

  quickQuestions = [
    'Milyen klímát ajánlasz egy 25 m2-es szobába?',
    'Milyen termék kell radiátor bekötéshez?',
    'Mutass vízszerelési termékeket 15000 Ft alatt',
    'Milyen szellőztetést ajánlasz fürdőszobába?'
  ];

  private products: Product[] = [];
  private unsubscribeProducts?: () => void;

  constructor(
    private productService: ProductService,
    private chatbotRecommendationService: ChatbotRecommendationService,
    private chatbotLlmService: ChatbotLlmService,
    private monitoringService: MonitoringService,
    private router: Router
  ) {}

  get assistantModeLabel(): string {
    return this.chatbotLlmService.isConfigured() ? 'AI mód aktív' : 'Helyi katalógus mód';
  }

  ngOnInit(): void {
    this.llmModel = this.chatbotLlmService.getModel();

    this.unsubscribeProducts = this.productService.getProductsStream(
      products => {
        this.products = products;
        this.loadingProducts = false;
      },
      error => {
        this.loadingProducts = false;
        this.monitoringService.capture('shop-assistant-products-load', error, {
          area: 'shop-assistant'
        });
      }
    );
  }

  ngOnDestroy(): void {
    if (this.unsubscribeProducts) {
      this.unsubscribeProducts();
    }
  }

  toggle(): void {
    this.open = !this.open;
  }

  close(): void {
    this.open = false;
  }

  useQuickQuestion(question: string): void {
    this.userInput = question;
    this.send();
  }

  async send(): Promise<void> {
    const input = this.userInput.trim();
    if (!input || this.sending) {
      return;
    }

    this.messages.push({ role: 'user', text: input });
    this.userInput = '';

    if (this.loadingProducts) {
      this.messages.push({
        role: 'assistant',
        text: 'A terméklista még töltődik, kérlek próbáld meg pár másodperc múlva.'
      });
      return;
    }

    this.sending = true;

    try {
      if (this.chatbotLlmService.isConfigured()) {
        const llmReply = await this.chatbotLlmService.recommend(input, this.products);
        if (llmReply) {
          this.messages.push({
            role: 'assistant',
            text: llmReply.text,
            products: llmReply.products
          });
          return;
        }
      }

      const fallbackReply = this.chatbotRecommendationService.buildReply(input, this.products);
      this.messages.push({
        role: 'assistant',
        text: fallbackReply.text,
        products: fallbackReply.suggestedProducts
      });
    } catch (error) {
      const fallbackReply = this.chatbotRecommendationService.buildReply(input, this.products);
      this.monitoringService.capture('shop-assistant-llm-failed', error, {
        area: 'shop-assistant'
      });
      this.messages.push({
        role: 'assistant',
        text: `Az AI kapcsolat most nem elérhető, ezért a helyi katalógus alapján válaszolok. ${fallbackReply.text}`,
        products: fallbackReply.suggestedProducts
      });
    } finally {
      this.sending = false;
    }
  }

  async openProduct(product: Product): Promise<void> {
    if (product.id) {
      await this.router.navigate(['/products', product.id]);
      this.close();
      return;
    }

    await this.router.navigate(['/products'], { queryParams: { search: product.name } });
    this.close();
  }

  saveLlmSettings(): void {
    this.chatbotLlmService.setModel(this.llmModel);
    this.messages.push({
      role: 'assistant',
      text: 'AI modell beállítás mentve. Az API kulcs továbbra sem kerül a böngészőbe.'
    });
    this.settingsOpen = false;
  }
}
