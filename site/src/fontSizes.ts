import { HeadingProps } from './components/Heading';

type FontSize = Record<NonNullable<HeadingProps['size']>, number[]>;
export default {
  '1': [40, 52, 60, 60, 72],
  '2': [18, 20, 28, 28, 36],
  '3': [16, 18, 24, 24, 32],
} as FontSize;
