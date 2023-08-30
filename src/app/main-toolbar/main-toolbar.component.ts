import { Component } from '@angular/core';
import { ThemeService } from '../core/services/style/theme.service';
import { ElectronService } from '../core/services';

@Component({
  selector: 'app-main-toolbar',
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['./main-toolbar.component.scss'],
})
export class MainToolbarComponent {
  result: any;
  constructor(
    private themeService: ThemeService,
    private electron: ElectronService,
  ) {}

  ngDoCheck() {
    this.result = this.electron.result;
  }
  toggleTheme() {
    console.log('tobbleTheme');
    const isDarkTheme = this.themeService.isDarkTheme();
    this.themeService.setDarkTheme(!isDarkTheme);
  }

  gitStatus() {
    console.log('gitStatus');
    this.result = this.electron.doGrep();
  }
}
