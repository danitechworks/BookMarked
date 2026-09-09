import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly storageKey = 'bookmark_theme';

  private currentTheme: Theme = this.getInitialTheme();

  constructor() {
    this.applyTheme();
  }

  get isDark(): boolean {
    return this.currentTheme === 'dark';
  }

  toggle(): void {
    this.currentTheme = this.isDark ? 'light' : 'dark';

    localStorage.setItem(
      this.storageKey,
      this.currentTheme
    );

    this.applyTheme();
  }

  private getInitialTheme(): Theme {
    const savedTheme = localStorage.getItem(this.storageKey);

    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }

    return window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches
      ? 'dark'
      : 'light';
  }

  private applyTheme(): void {
    this.document.documentElement.setAttribute(
      'data-bs-theme',
      this.currentTheme
    );
  }
}
