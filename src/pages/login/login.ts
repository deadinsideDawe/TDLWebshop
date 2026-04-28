import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../app/services/auth.service';
import { ToastService } from '../../app/services/toast.service';
import { normalizeErrorMessage, getErrorCode } from '../../app/utils/error-message';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  // Login form allapotok.
  email = '';
  password = '';
  loading = false;
  errorMessage = '';
  successMessage = '';
  adminOnlyNotice = false;
  requiresAdmin = false;

  constructor(
    public auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {
    // Ha admin guard dobott vissza ide, jelezzuk a login oldalon.
    this.adminOnlyNotice = this.route.snapshot.queryParamMap.get('adminOnly') === '1';
    this.requiresAdmin = this.adminOnlyNotice;
  }

  async submit(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';
    this.loading = true;

    try {
      await this.auth.login(this.email, this.password);

      // Belső felületre célzott belépésnél customer userrel ne engedjük tovább.
      if (this.requiresAdmin && !this.auth.isCurrentUserStaff()) {
        await this.auth.logout();
        this.errorMessage = 'Ehhez a belső felülethez nincs jogosultságod.';
        this.toastService.error('Nincs belső jogosultság', this.errorMessage);
        return;
      }

      this.successMessage = 'Sikeres bejelentkezés.';
      this.toastService.success('Sikeres belépés');
      const redirectTo = this.route.snapshot.queryParamMap.get('redirectTo') || '/';
      await this.router.navigateByUrl(redirectTo);
    } catch (error) {
      this.errorMessage = getErrorCode(error) === 'auth/user-disabled'
        ? 'A profilod le van tiltva. Kérlek vedd fel a kapcsolatot az adminisztrátorral.'
        : normalizeErrorMessage(error, 'Valami hiba történt. Próbáld újra.');
      this.toastService.error('Belépés sikertelen', this.errorMessage);
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

