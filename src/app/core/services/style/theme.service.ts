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
    this.toggleTheme();
    this.darkTheme = isDarkTheme;
    document.body.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
  }

  isDarkTheme() {
    return this.darkTheme;
  }

  toggleTheme() {
    const stylesheets = document.styleSheets;
    const githubStylesheet = Array.from(stylesheets).find(
      (stylesheet: any) => stylesheet.href && stylesheet.href.includes('github'),
    );
    const darkStylesheet = Array.from(stylesheets).find(
      (stylesheet: any) => stylesheet.href && stylesheet.href.includes('dark'),
    );

    if (githubStylesheet && darkStylesheet) {
      if (githubStylesheet.disabled) {
        githubStylesheet.disabled = false;
        darkStylesheet.disabled = true;
      } else {
        githubStylesheet.disabled = true;
        darkStylesheet.disabled = false;
      }
    }
  }
}
