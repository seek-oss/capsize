import { round } from './round';
import { FontMetrics } from './types';

export const getCapHeight = ({
  fontSize,
  fontMetrics,
}: {
  fontSize: number;
  fontMetrics: FontMetrics;
}) => round((fontSize * fontMetrics.capHeight) / fontMetrics.unitsPerEm);
