import fs from 'fs';

type WriteFile = (path: string, data: string) => Promise<Error|void>

const writeFile: WriteFile = (path, data) =>
  new Promise((resolve, reject) => {
    fs.writeFile(path, data, (err) => {
      if (err) return reject(err);
      return resolve();
    });
  });

export default writeFile;
