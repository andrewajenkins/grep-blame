import { ChangeDetectorRef, Component } from '@angular/core';
import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import typescript from 'highlight.js/lib/languages/typescript';
import json from 'highlight.js/lib/languages/json';
import { Action, CommandService } from '../../core/services/command/command.service';
import { ElectronService } from '../../core/services';

@Component({
  selector: 'app-preview-window',
  templateUrl: './preview-window.component.html',
  styleUrls: ['./preview-window.component.scss'],
})
export class PreviewWindowComponent {
  htmlContent = `
  <pre><code class="typescript">import { Injectable, Inject } from '@angular/core';\n\nimport { PLATFORM_ID } from '@angular/core';\nimport { isPlatformBrowser } from '@angular/common';\n\nimport 'clipboard';\n\nimport 'prismjs';\nimport 'prismjs/plugins/toolbar/prism-toolbar';\nimport 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard';\nimport 'prismjs/components/prism-css';\nimport 'prismjs/components/prism-javascript';\nimport 'prismjs/components/prism-java';\nimport 'prismjs/components/prism-markup';\nimport 'prismjs/components/prism-typescript';\nimport 'prismjs/components/prism-sass';\nimport 'prismjs/components/prism-scss';\n\ndeclare var Prism: any;\n\n@Injectable()\nexport class HighlightService {\n\n  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }\n\n  highlightAll() {\n    if (isPlatformBrowser(this.platformId)) {\n      Prism.highlightAll();\n    }\n  }\n}\n</code></pre>\n
  `;
  previewContent!: string;
  constructor(
    private electronService: ElectronService,
    private cdRef: ChangeDetectorRef,
  ) {}
  ngOnInit() {
    this.previewContent = this.htmlContent;
    this.electronService.electron$.subscribe((res: any) => {
      if (res.action == 'page') {
        try {
          let content = `<pre><code class="`;
          content += res.fileName.slice(-2);
          content += `">`;
          content += res.payload;
          content += `</code></pre>\n`;
          this.previewContent = content;
          this.cdRef.detectChanges();
        } catch (e) {
          alert(e);
        }
      }
    });
  }

  ngAfterViewInit() {
    this.highlightCode();
  }

  highlightCode() {
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach((code) => {
      hljs.highlightBlock(code as HTMLElement);
    });
  }
}
hljs.registerLanguage('python', python);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('json', json);
