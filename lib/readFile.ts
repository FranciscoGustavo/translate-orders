import fs from 'fs';

type ReadFile = (path: string) => Promise<Error | Buffer>

const readFile: ReadFile = (path) =>
  new Promise((resolve, reject) => {
    fs.readFile(path, (err, buffer) => {
      if (err) return reject(err);
      return resolve(buffer);
    });
  });

export default readFile;
