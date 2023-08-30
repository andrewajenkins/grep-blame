import { Component } from '@angular/core';
import { Action, CommandService } from '../core/services/command/command.service';
import { RipGrepResult } from '../../../app/commands/ripgrep';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
})
export class PreviewComponent {
  dataSource!: RipGrepResult[];
  displayedColumns = ['fileName', 'commit', 'blame', 'lineNum', 'content'];
  constructor(private commandService: CommandService) {}

  ngOnInit(): void {
    console.log('HomeComponent INIT');
    this.commandService.action$.subscribe((cmd) => {
      if (cmd.action === Action.PREVIEW_DATA) {
        console.log('PREVIEW_DATA');
        this.dataSource = cmd.payload.filter((item: RipGrepResult) => item.fileName);
      }
    });
  }
}
