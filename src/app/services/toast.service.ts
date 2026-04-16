import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastKind = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  kind: ToastKind;
  title: string;
  text?: string;
  createdAt: number;
  durationMs: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private items: ToastMessage[] = [];
  private subject = new BehaviorSubject<ToastMessage[]>([]);
  private idCounter = 1;

  toasts$ = this.subject.asObservable();

  success(title: string, text = '', durationMs = 3200): void {
    this.push('success', title, text, durationMs);
  }

  error(title: string, text = '', durationMs = 4200): void {
    this.push('error', title, text, durationMs);
  }

  info(title: string, text = '', durationMs = 3000): void {
    this.push('info', title, text, durationMs);
  }

  remove(id: number): void {
    this.items = this.items.filter(item => item.id !== id);
    this.subject.next([...this.items]);
  }

  clear(): void {
    this.items = [];
    this.subject.next([]);
  }

  private push(kind: ToastKind, title: string, text: string, durationMs: number): void {
    const message: ToastMessage = {
      id: this.idCounter++,
      kind,
      title,
      text,
      createdAt: Date.now(),
      durationMs
    };

    this.items = [message, ...this.items].slice(0, 5);
    this.subject.next([...this.items]);

    setTimeout(() => this.remove(message.id), durationMs);
  }
}
