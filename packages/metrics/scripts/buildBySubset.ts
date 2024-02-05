import { Font, supportedSubsets, fromFile, fromUrl } from '@capsizecss/unpack';
import sortKeys from 'sort-keys';

type FontCategory =
  | 'serif'
  | 'sans-serif'
  | 'monospace'
  | 'display'
  | 'handwriting';
interface MetricsFont extends Font {
  category: FontCategory;
}

type FontBySubset = Record<
  string,
  Record<(typeof supportedSubsets)[number], MetricsFont>
>;

interface Options {
  fontSource: string;
  sourceType: 'file' | 'url';
  category: FontCategory;
  overrides?: Partial<Font>;
}

const extractor: Record<
  Options['sourceType'],
  typeof fromFile | typeof fromUrl
> = {
  file: fromFile,
  url: fromUrl,
};

export const buildBySubset = async ({
  fontSource,
  sourceType,
  category,
  overrides = {},
}: Options): Promise<FontBySubset> => {
  const content: FontBySubset = {};

  await Promise.all(
    supportedSubsets.map(async (subset) => {
      const metrics = await extractor[sourceType](fontSource, { subset });
      const name = overrides.familyName || metrics.familyName;
      content[name] = content[name] || {};
      content[name][subset] = {
        ...metrics,
        ...overrides,
        category,
      };
      content[name] = sortKeys(content[name]);
    }),
  );

  return content;
};
