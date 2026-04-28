import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { isValidEmail, isValidOptionalPhone } from '../../app/utils/form-validators';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css']
})
export class Contact {
  name = '';
  email = '';
  phone = '';
  topic = 'Termék kérdés';
  message = '';
  formError = '';

  readonly topics = [
    'Termék kérdés',
    'Rendelés',
    'Ajánlatkérés',
    'Szállítás',
    'Garancia',
    'Egyéb'
  ];

  get mailHref(): string {
    const subject = encodeURIComponent(`TDL Webshop kapcsolat - ${this.topic}`);
    const body = encodeURIComponent([
      `Név: ${this.name}`,
      `E-mail: ${this.email}`,
      `Telefonszám: ${this.phone || '-'}`,
      `Téma: ${this.topic}`,
      '',
      'Üzenet:',
      this.message
    ].join('\n'));

    return `mailto:info@tdlwebshop.hu?subject=${subject}&body=${body}`;
  }

  canSend(): boolean {
    return this.name.trim().length >= 2
      && isValidEmail(this.email)
      && isValidOptionalPhone(this.phone)
      && this.message.trim().length >= 10;
  }

  validateBeforeSend(event: MouseEvent): void {
    this.formError = '';

    if (this.canSend()) {
      return;
    }

    event.preventDefault();
    this.formError = 'Kérlek add meg a neved, egy érvényes e-mail címet, helyes telefonszámot és legalább 10 karakteres üzenetet.';
  }
}
