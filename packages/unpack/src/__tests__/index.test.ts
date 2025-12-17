import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import { fromUrl, fromBlob, fromBuffer } from '../index';
import { join } from 'node:path';
import { fromFile } from '../fs';

const fontPath = join(__dirname, './__fixtures__/NotoSans-Regular.ttf');

const expectedMetrics = {
  ascent: 1069,
  capHeight: 714,
  descent: -293,
  familyName: 'Noto Sans',
  fullName: 'Noto Sans Regular',
  lineGap: 0,
  postscriptName: 'NotoSans-Regular',
  subsets: {
    latin: {
      xWidthAvg: 474,
    },
    thai: {
      xWidthAvg: 600,
    },
  },
  unitsPerEm: 1000,
  xHeight: 536,
  xWidthAvg: 474,
};

describe('unpack font metrics', () => {
  it('fromBuffer', async () => {
    const font = await readFile(fontPath);
    const metrics = await fromBuffer(font);
    expect(metrics).toEqual(expectedMetrics);
  });

  it('fromBlob', async () => {
    const font = await readFile(fontPath);
    const fontBlob = new Blob([new Uint8Array(font)]);

    const metricsBlob = await fromBlob(fontBlob);
    expect(metricsBlob).toEqual(expectedMetrics);

    const metricsFont = await fromBuffer(font);
    expect(metricsFont).toEqual(metricsBlob);
  });

  it('fromUrl', async () => {
    const font = await readFile(fontPath);
    const sampleFontUrl =
      'https://github.com/notofonts/notofonts.github.io/raw/refs/heads/main/fonts/NotoSans/full/ttf/NotoSans-Regular.ttf';

    const metricsUrl = await fromUrl(sampleFontUrl);
    expect(metricsUrl).toEqual(expectedMetrics);

    const metricsFont = await fromBuffer(font);
    expect(metricsFont).toEqual(metricsUrl);
  });

  it('fromFile', async () => {
    const font = await readFile(fontPath);

    const metricsUrl = await fromFile(fontPath);
    expect(metricsUrl).toEqual(expectedMetrics);

    const metricsFont = await fromBuffer(font);
    expect(metricsFont).toEqual(metricsUrl);
  });
});
