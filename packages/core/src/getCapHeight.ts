import { round } from './round';
import { FontMetrics } from './types';

export const getCapHeight = ({
  fontSize,
  fontMetrics,
}: {
  fontSize: number;
  fontMetrics: Pick<FontMetrics, 'capHeight' | 'unitsPerEm'>;
}) => round((fontSize * fontMetrics.capHeight) / fontMetrics.unitsPerEm);
