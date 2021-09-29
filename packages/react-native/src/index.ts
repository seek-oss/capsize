import { precomputeNumericValues } from '@capsizecss/core';
import { PixelRatio } from 'react-native';

export const createTextStyle = (
  options: Parameters<typeof precomputeNumericValues>[0],
) => {
  const { fontSize, lineHeight, capHeightTrimEm, baselineTrimEm } =
    precomputeNumericValues(options);
  const fontScale = PixelRatio.getFontScale();

  return {
    fontSize,
    lineHeight,
    marginTop: capHeightTrimEm * fontSize * fontScale,
    marginBottom: baselineTrimEm * fontSize * fontScale,
  } as const;
};
