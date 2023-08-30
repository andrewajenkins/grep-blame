import { Component } from '@angular/core';
import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import typescript from 'highlight.js/lib/languages/typescript';
import json from 'highlight.js/lib/languages/json';

@Component({
  selector: 'app-preview-window',
  templateUrl: './preview-window.component.html',
  styleUrls: ['./preview-window.component.scss'],
})
export class PreviewWindowComponent {
  htmlContent = `
  <pre><code class="typescript">import { Injectable, Inject } from '@angular/core';\n\nimport { PLATFORM_ID } from '@angular/core';\nimport { isPlatformBrowser } from '@angular/common';\n\nimport 'clipboard';\n\nimport 'prismjs';\nimport 'prismjs/plugins/toolbar/prism-toolbar';\nimport 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard';\nimport 'prismjs/components/prism-css';\nimport 'prismjs/components/prism-javascript';\nimport 'prismjs/components/prism-java';\nimport 'prismjs/components/prism-markup';\nimport 'prismjs/components/prism-typescript';\nimport 'prismjs/components/prism-sass';\nimport 'prismjs/components/prism-scss';\n\ndeclare var Prism: any;\n\n@Injectable()\nexport class HighlightService {\n\n  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }\n\n  highlightAll() {\n    if (isPlatformBrowser(this.platformId)) {\n      Prism.highlightAll();\n    }\n  }\n}\n</code></pre>\n
  `;

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
