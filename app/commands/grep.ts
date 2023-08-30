import { exec } from 'child_process';
const { spawn } = require('child_process');

export interface Grep {
  path: string;
  fileType: string[];
  pattern: string;
}
export class Commands {
  constructor() {}
  grep(input: Partial<Grep>, callback: any) {
    const path = input.path || ' . ';
    let fileType = input.fileType || [];
    const pattern = input.pattern;
    let type: string = '';
    if (!pattern) throw new Error('pattern is required');
    if (fileType.length > 0) {
      type = `-type f  -name "*.${fileType[0]}"`;
      let i = 1;
      while (i < fileType.length) {
        type += `-o -name "*.${fileType[i]}"`;
        i++;
      }
      type += ` `;
    }
    const command = `find ${path} ${type} | xargs grep "${pattern}"`;
    console.log('command:', command);
    // exec(command, { maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
    //   if (error) {
    //     console.error(`grep error: ${error.message}`);
    //     callback(error);
    //     return;
    //   }
    //   console.log(`grep stdout:\n${stdout}`);
    //   callback(null, stdout.split('\n'));
    // });

    const child = spawn(command, { shell: true });
    const result: any[] = [];
    child.stdout.on('data', (data: any) => {
      console.log(`stdout: ${data.toString()}`);
      result.push(data.toString());
    });

    child.stderr.on('data', (data: any) => {
      console.error(`stderr: ${data.toString()}`);
    });

    child.on('error', (error: any) => {
      console.error(`error: ${error.message}`);
    });

    child.on('close', (code: any) => {
      console.log(`child process exited with code ${code}`);
      callback(null, result);
    });
  }
}

// const { exec } = require('child_process');
//
// exec('your_command', { maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
//   // ...
// });
