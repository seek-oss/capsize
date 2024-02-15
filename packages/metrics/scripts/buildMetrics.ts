import {
  Font,
  fromFile,
  fromUrl,
  supportedSubsets,
  type SupportedSubsets,
} from '@capsizecss/unpack';
import sortKeys from 'sort-keys';

type FontCategory =
  | 'serif'
  | 'sans-serif'
  | 'monospace'
  | 'display'
  | 'handwriting';
export interface MetricsFont extends Font {
  category: FontCategory;
}

export type MetricsByFamilyBySubset = Record<
  string,
  Record<SupportedSubsets, MetricsFont>
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

export const buildMetrics = async ({
  fontSource,
  sourceType,
  category,
  overrides = {},
}: Options): Promise<MetricsByFamilyBySubset> => {
  const content: MetricsByFamilyBySubset = {};

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
