import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private darkTheme = true;
  constructor() {
    this.setDarkTheme(true);
  }

  setDarkTheme(isDarkTheme: boolean) {
    this.darkTheme = isDarkTheme;
    document.body.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
  }

  isDarkTheme() {
    return this.darkTheme;
  }
}
