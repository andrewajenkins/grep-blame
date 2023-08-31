import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { IRipGrepResult } from '../../../../app/commands/ripgrep';
import { Action, CommandService } from '../../core/services/command/command.service';
import { ElectronService } from '../../core/services';

@Component({
  selector: 'app-preview-table',
  templateUrl: './preview-table.component.html',
  styleUrls: ['./preview-table.component.scss'],
})
export class PreviewTableComponent {
  @Input() dataSource: IRipGrepResult[] = [];
  displayedColumns = ['dateTime', 'blame', 'fileName', 'lineNum', 'commit'];

  constructor(
    private electron: ElectronService,
    private cdRef: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.electron.electron$.subscribe((res) => {
      if (res.action == 'grep') {
        const payload = res.payload.sort((a: IRipGrepResult, b: IRipGrepResult) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return new Date(b.dateTime as string) - new Date(a.dateTime as string);
        });

        console.log('table grep data', payload);
        this.dataSource = payload;
        this.cdRef.detectChanges();
      }
    });
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

  openPreview(row: IRipGrepResult) {
    console.log('openPreview', row);
    this.electron.openPage(row.fileName as string, parseInt(row.lineNum as string));
  }
}
