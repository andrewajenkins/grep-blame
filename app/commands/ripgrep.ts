import { spawn } from 'child_process';
export interface RipGrepSearch {
  fileTypes: string[];
  pattern: string;
  directory: string;
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

  public async search(): Promise<string[]> {
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

  private async doBlame(results: string): Promise<string[]> {
    const blameResults: string[] = [];
    const jsonResults = results
      .split('\n')
      .filter((line) => line)
      .map((line) => JSON.parse(line));

    for (const result of jsonResults) {
      if (result.type === 'match') {
        const filePath = result.data.path.text;
        const lineNumber = result.data.line_number;
        console.log('filePath:', filePath, 'lineNumber:', lineNumber);
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

  private gitBlame(filePath: string, lineNumber: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const git = spawn('git', ['blame', '-L', `${lineNumber},${lineNumber}`, filePath]);

      let result = '';
      let error = '';

      git.stdout.on('data', (data) => {
        result += data.toString();
      });

      git.stderr.on('data', (data) => {
        error += data.toString();
      });

      git.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`git blame process exited with code ${code}: ${error}`));
        } else {
          resolve(result);
        }
      });
    });
  }
}

// Usage example:

// (async () => {
//   const fileTypes = ['ts', 'py'];
//   const pattern = 'pattern_to_search';
//   const directory = '/path/to/directory';
//
//   const ripGrepSearch = new RipGrepSearch(fileTypes, pattern, directory);
//
//   try {
//     const result = await ripGrepSearch.search();
//     console.log(result);
//   } catch (error) {
//     console.error(error);
//   }
// })();
