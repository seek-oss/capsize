import { Font, fromFile, fromUrl } from '@capsizecss/unpack';

type FontCategory =
  | 'serif'
  | 'sans-serif'
  | 'monospace'
  | 'display'
  | 'handwriting';
interface MetricsFont extends Font {
  category: FontCategory;
}

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

export const buildMetrics = async ({
  fontSource,
  sourceType,
  category,
  overrides = {},
}: Options): Promise<MetricsFont> => {
  const metrics = await extractor[sourceType](fontSource);

  return {
    ...metrics,
    ...overrides,
    category,
  };
};
