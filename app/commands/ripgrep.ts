import { spawn } from 'child_process';
export interface RipGrepSearch {
  fileTypes: string[];
  pattern: string;
  directory: string;
}
export interface IRipGrepResult {
  fileName: string;
  commit: string;
  blame: string;
  dateTime: string;
  lineNum: string;
  content: string;
}
export class RipGrep implements RipGrepSearch {
  fileTypes: string[];
  pattern: string;
  directory: string;

  constructor(data: Partial<RipGrepSearch>) {
    this.fileTypes = data.fileTypes || [];
    this.pattern = data.pattern || '';
    this.directory = data.directory || '.';
  }

  public async search(): Promise<IRipGrepResult[]> {
    const results: any = await this.doGrep();

    return this.doBlame(results);
  }

  doGrep() {
    return new Promise((resolve, reject) => {
      const globPatterns = this.fileTypes.map((ext) => `*.${ext}`);
      const args = [this.pattern, this.directory, '--json', ...globPatterns.map((pattern) => ['-g', pattern]).flat()];
      console.log('args:', args);
      const rg = spawn('rg', args);

      let result = '';
      let error = '';

      rg.stdout.on('data', (data) => {
        result += data.toString();
      });

      rg.stderr.on('data', (data) => {
        error += data.toString();
      });

      rg.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`ripgrep process exited with code ${code}: ${error}`));
        } else {
          resolve(result);
        }
      });
    });
  }

  private async doBlame(results: string): Promise<any[]> {
    const blameResults: string[][] = [];
    const jsonResults = results
      .split('\n')
      .filter((line) => line)
      .map((line) => JSON.parse(line));
    let i = 0;
    for (const result of jsonResults) {
      i++;
      if (i > 40) break;
      if (result.type === 'match') {
        const filePath = result.data.path.text;
        const lineNumber = result.data.line_number;
        // console.log('filePath:', filePath, 'lineNumber:', lineNumber);
        try {
          const blame = await this.gitBlame(filePath, lineNumber);
          blameResults.push(blame);
        } catch (error) {
          console.error(`Error blaming ${filePath}:${lineNumber}:`, error);
        }
      }
    }
    console.log('blameResults:', blameResults);
    return blameResults;
  }

  private gitBlame(filePath: string, lineNumber: number): Promise<any> {
    return new Promise((resolve, reject) => {
      const git = spawn('git', ['blame', '-L', `${lineNumber},${lineNumber}`, filePath]);

      let result = `${filePath}:${lineNumber}`;
      let error = '';

      git.stdout.on('data', (data) => {
        result += data.toString();
      });

      git.stderr.on('data', (data) => {
        error += data.toString();
      });

      git.on('close', (code) => {
        console.log('result:', result);
        try {
          const fileName = result.split(':')[0]; //^(.*?):
          const commit = result.match(/:(.*?)\s/)![1];
          const blame = result.match(/\((.*?)\d{4}/)![1];
          const dateTime = result.match(/\(.*?\s([\d-]+\s[\d:]+\s[\d\-]+)/)![1];
          const lineNum = result.match(/\s([0-9]+)\)/)![1];
          const content = result.match(/\)\s(.*)/)![1];
          const structuredResult = { fileName, commit, blame, dateTime, lineNum, content };
          console.log('structuredResult:', structuredResult);
          const example =
            './src/app/detail/detail.component.ts:80ff07b8b (Andy Jenkins 2023-08-29 14:13:15 -0700 8) export class DetailComponent implements OnInit {';
          if (code !== 0) {
            reject(new Error(`git blame process exited with code ${code}: ${error}`));
          } else {
            resolve(structuredResult);
          }
        } catch (error) {
          console.error('failed to parse:', result, error);
          resolve({});
        }
      });
    });
  }
}
