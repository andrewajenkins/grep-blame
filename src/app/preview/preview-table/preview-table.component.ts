import { Component, Input } from '@angular/core';
import { RipGrepResult } from '../../../../app/commands/ripgrep';

@Component({
  selector: 'app-preview-table',
  templateUrl: './preview-table.component.html',
  styleUrls: ['./preview-table.component.scss'],
})
export class PreviewTableComponent {
  @Input() dataSource: RipGrepResult[] = [];
  displayedColumns = ['fileName', 'commit', 'blame', 'dateTime', 'lineNum'];
  ngOnInit() {
    const test = [];
    for (let i = 0; i < 20; i++) {
      test.push({
        fileName: 'src/app/app.component.ts',
        commit: 'commit 1',
        blame: 'blame 1',
        dateTime: 'dateTime 1',
        lineNum: 'lineNum 1',
        content: 'content 1',
      });
    }
    this.dataSource = test;
  }
}
