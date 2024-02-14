import del from 'del';

import { metricsDir } from './paths';

(async () => {
  await del([`${metricsDir}/*.d.ts`, `${metricsDir}/*.js`]);
})();
