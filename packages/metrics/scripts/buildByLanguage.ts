import {
  Font,
  supportedLanguages,
  fromFile,
  fromUrl,
} from '@capsizecss/unpack';
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

type FontByLanguage = Record<
  string,
  Record<typeof supportedLanguages[number], MetricsFont>
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

export const buildByLanguage = async ({
  fontSource,
  sourceType,
  category,
  overrides = {},
}: Options): Promise<FontByLanguage> => {
  const content: FontByLanguage = {};

  await Promise.all(
    supportedLanguages.map(async (language) => {
      const metrics = await extractor[sourceType](fontSource, { language });
      const name = overrides.familyName || metrics.familyName;
      content[name] = content[name] || {};
      content[name][language] = {
        ...metrics,
        ...overrides,
        category,
      };
      content[name] = sortKeys(content[name]);
    }),
  );

  return content;
};
