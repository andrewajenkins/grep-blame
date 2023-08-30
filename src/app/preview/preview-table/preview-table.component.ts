import { Component, Input } from '@angular/core';
import { RipGrepResult } from '../../../../app/commands/ripgrep';

@Component({
  selector: 'app-preview-table',
  templateUrl: './preview-table.component.html',
  styleUrls: ['./preview-table.component.scss'],
})
export class PreviewTableComponent {
  @Input() dataSource: RipGrepResult[] = [];
  displayedColumns = ['fileName', 'commit', 'blame', 'lineNum', 'content'];
}
