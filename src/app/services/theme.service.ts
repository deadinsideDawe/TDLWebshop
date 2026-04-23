import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Alapertelmezett tema: dark (user kerese alapjan).
  private currentTheme: 'light' | 'dark' = 'dark';
  private readonly mediaQuery = window.matchMedia?.('(prefers-color-scheme: light)');

  constructor() {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const userSetTheme = localStorage.getItem('themeUserSet') === '1';

    if (userSetTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      this.currentTheme = savedTheme;
    } else {
      // Kezi valasztas nelkul a rendszer beallitasat kovetjuk, fallbackkent dark marad.
      this.currentTheme = this.getSystemTheme();
      this.mediaQuery?.addEventListener('change', event => {
        if (localStorage.getItem('themeUserSet') !== '1') {
          this.currentTheme = event.matches ? 'light' : 'dark';
          this.applyTheme(this.currentTheme);
        }
      });
    }

    this.applyTheme(this.currentTheme);
  }

  getTheme(): 'light' | 'dark' {
    return this.currentTheme;
  }

  toggleTheme(): void {
    // Valtas + tarolas, hogy ujranyitas utan is ugyanaz maradjon.
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', this.currentTheme);
    localStorage.setItem('themeUserSet', '1');
    this.applyTheme(this.currentTheme);
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${theme}`);
  }

  private getSystemTheme(): 'light' | 'dark' {
    return this.mediaQuery?.matches ? 'light' : 'dark';
  }
}
