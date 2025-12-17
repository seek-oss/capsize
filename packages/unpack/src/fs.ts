import { readFile } from 'node:fs/promises';
import { _fromBuffer, Options } from './shared';

export const fromFile = async (path: string, options?: Options) => {
  const buffer = await readFile(path);
  return _fromBuffer(buffer, 'fromFile', 'path', options);
};
