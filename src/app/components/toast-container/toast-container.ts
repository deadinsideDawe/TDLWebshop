import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastKind, ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-container.html',
  styleUrls: ['./toast-container.css']
})
export class ToastContainer {
  constructor(public toastService: ToastService) {}

  remove(id: number): void {
    this.toastService.remove(id);
  }

  getIcon(kind: ToastKind): string {
    if (kind === 'success') {
      return 'OK';
    }

    if (kind === 'error') {
      return '!';
    }

    return 'i';
  }
}
