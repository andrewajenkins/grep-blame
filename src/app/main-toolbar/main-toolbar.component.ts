import { Component } from '@angular/core';
import { ThemeService } from '../core/services/style/theme.service';
import { ElectronService } from '../core/services';

@Component({
  selector: 'app-main-toolbar',
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['./main-toolbar.component.scss'],
})
export class MainToolbarComponent {
  constructor(
    private themeService: ThemeService,
    private electron: ElectronService,
  ) {}
  toggleTheme() {
    const isDarkTheme = this.themeService.isDarkTheme();
    this.themeService.setDarkTheme(!isDarkTheme);
  }

  gitStatus() {
    this.electron.doGrep();
  }
}
