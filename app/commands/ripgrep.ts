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

  public async search(): Promise<string> {
    const results = await this.doGrep();

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

  private doBlame(results: unknown): Promise<string> {
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
