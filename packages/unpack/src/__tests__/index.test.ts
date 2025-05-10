import { readFile } from 'node:fs/promises';
import { fromUrl, fromBlob, fromBuffer } from '../index';
import { join } from 'node:path';

describe('unpack font metrics', () => {
  describe('fromBuffer', () => {
    it('should return the font metrics', async () => {
      const fontPath = join(__dirname, './__fixtures__/NotoSans-Regular.ttf');
      const font = await readFile(fontPath);
      const metrics = await fromBuffer(font);
      expect(metrics).toMatchSnapshot();
    });
  });

  describe('fromBlob', () => {
    it('should return the font metrics', async () => {
      const fontPath = join(__dirname, './__fixtures__/NotoSans-Regular.ttf');
      const font = await readFile(fontPath);
      const fontBlob = new Blob([font]);

      const metricsBlob = await fromBlob(fontBlob);
      expect(metricsBlob).toMatchSnapshot();

      const metricsFont = await fromBuffer(font);
      expect(metricsFont).toEqual(metricsBlob);
    });
  });

  describe('fromUrl', () => {
    it('should return the font metrics', async () => {
      const fontPath = join(__dirname, './__fixtures__/NotoSans-Regular.ttf');
      const font = await readFile(fontPath);
      const sampleFontUrl =
        'https://github.com/notofonts/notofonts.github.io/raw/refs/heads/main/fonts/NotoSans/full/ttf/NotoSans-Regular.ttf';

      const metricsUrl = await fromUrl(sampleFontUrl);
      expect(metricsUrl).toMatchSnapshot();

      const metricsFont = await fromBuffer(font);
      expect(metricsFont).toEqual(metricsUrl);
    });
  });
});
