import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../app/services/auth.service';
import { ToastService } from '../../app/services/toast.service';
import { normalizeErrorMessage } from '../../app/utils/error-message';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  // Regisztrációs form állapot.
  email = '';
  password = '';
  confirmPassword = '';
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    public auth: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  async submit(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';

    // Alap kliens oldali validaciok.
    if (!this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Minden mezőt ki kell tölteni.';
      this.toastService.error('Hiányos adatok', this.errorMessage);
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'A két jelszó nem egyezik meg.';
      this.toastService.error('Jelszó hiba', this.errorMessage);
      return;
    }

    this.loading = true;

    try {
      await this.auth.register(this.email, this.password);
      this.successMessage = 'Sikeres regisztráció. Most már be vagy jelentkezve.';
      this.toastService.success('Sikeres regisztráció');
      await this.router.navigate(['/checkout']);
    } catch (error) {
      this.errorMessage = normalizeErrorMessage(error, 'Valami hiba történt. Próbáld újra.');
      this.toastService.error('Regisztráció sikertelen', this.errorMessage);
    } finally {
      this.loading = false;
    }
  }

  async logout(): Promise<void> {
    await this.auth.logout();
    this.successMessage = 'Sikeres kijelentkezés.';
    this.toastService.info('Sikeres kijelentkezés');
  }
}

