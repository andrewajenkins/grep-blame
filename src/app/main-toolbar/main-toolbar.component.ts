import { Component } from '@angular/core';
import { ThemeService } from '../core/services/style/theme.service';
import { ElectronService } from '../core/services';
import { Action, CommandService } from '../core/services/command/command.service';

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
    private commandService: CommandService,
  ) {}

  ngDoCheck() {
    this.result = this.electron.result;
  }
  toggleTheme() {
    const isDarkTheme = this.themeService.isDarkTheme();
    this.themeService.setDarkTheme(!isDarkTheme);
  }

  gitBlame() {
    console.log('gitStatus');
    this.result = this.electron.doGrep().subscribe((res) => {});
  }
}
