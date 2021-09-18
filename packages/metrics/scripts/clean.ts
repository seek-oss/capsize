import del from 'del';
import path from 'path';

(async () => {
  const folderPath = path.join(__dirname, '..');
  await del([`${folderPath}/*.d.ts`, `${folderPath}/*.js`]);
})();
