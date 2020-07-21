/* @jsx jsx */
import { jsx } from '@emotion/core'; // eslint-disable-line
import React, { ReactNode, ElementType, useContext } from 'react'; // eslint-disable-line
import { Box, BoxProps, useTheme } from '@chakra-ui/core';
import capsize from 'capsize';
import siteFontContext from './SiteProvider';
import { FontMetrics } from 'capsize';
import fontSizes from '../fontSizes';

export interface HeadingProps {
  children: ReactNode;
  as?: ElementType;
  size?: '1' | '2' | '3';
  align?: BoxProps['textAlign'];
}

const element = {
  '1': 'h1',
  '2': 'h2',
  '3': 'h3',
} as const;

const color = {
  '1': 'blue.900',
  '2': 'blue.800',
  '3': 'gray.500',
};
const capsizeForSize = (size: number, font: FontMetrics) =>
  capsize({
    capHeight: size,
    leading: Math.floor(size * 1.9),
    fontMetrics: font,
  });

const Heading = ({ children, as, size = '1', align }: HeadingProps) => {
  const activeFont = useContext(siteFontContext);
  const theme = useTheme();

  const mq = (theme.breakpoints as string[])
    .slice(0, 4)
    .map((bp) => `@media (min-width: ${bp})`);

  return (
    <Box
      as={as || element[size]}
      fontFamily={activeFont.familyName}
      color={color[size]}
      textAlign={align}
      css={{
        ...capsizeForSize(fontSizes[size][0], activeFont),
        [mq[0]]: capsizeForSize(fontSizes[size][1], activeFont),
        [mq[1]]: capsizeForSize(fontSizes[size][2], activeFont),
        [mq[2]]: capsizeForSize(fontSizes[size][3], activeFont),
      }}
    >
      {children}
    </Box>
  );
};

export default Heading;
