import { HeadingProps } from './components/Heading';

type FontSize = Record<NonNullable<HeadingProps['size']>, number[]>;
export default {
  '1': [40, 52, 72, 72],
  '2': [18, 20, 28, 28],
  '3': [18, 20, 24, 24],
} as FontSize;
