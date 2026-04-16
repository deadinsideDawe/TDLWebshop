import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Alapertelmezett tema: dark (user kerese alapjan).
  private currentTheme: 'light' | 'dark' = 'dark';

  constructor() {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const userSetTheme = localStorage.getItem('themeUserSet') === '1';

    if (userSetTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      this.currentTheme = savedTheme;
    } else {
      // Default to dark on fresh/legacy installs until the user explicitly chooses.
      this.currentTheme = 'dark';
      localStorage.setItem('theme', 'dark');
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
}
