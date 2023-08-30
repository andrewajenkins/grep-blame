import { Component } from '@angular/core';
import { Action, CommandService } from '../core/services/command/command.service';
import { PeriodicElement } from '../home/home.component';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PreviewComponent {
  dataSource!: any;
  columnsToDisplay = ['fileName', 'commit', 'blame', 'lineNum'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement!: PeriodicElement | null;
  constructor(private commandService: CommandService) {}

  ngOnInit(): void {
    console.log('HomeComponent INIT');
    this.commandService.action$.subscribe((cmd) => {
      if (cmd.action === Action.PREVIEW_DATA) {
        console.log('PREVIEW_DATA');
        this.dataSource = cmd.payload.filter((item: any) => item.fileName);
      }
    });
  }
}
