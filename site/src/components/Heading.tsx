/* @jsx jsx */
import { jsx } from '@emotion/core'; // eslint-disable-line
import React, { ReactNode, ElementType, useContext } from 'react'; // eslint-disable-line
import { Box, BoxProps } from '@chakra-ui/core';
import capsize from 'capsize';
import siteFontContext from './SiteFontProvider';

interface Props {
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

type FontSize = Record<NonNullable<Props['size']>, number>;
const fontSize: FontSize = {
  '1': 60,
  '2': 32,
  '3': 20,
} as const;

const color = {
  '1': 'blue.900',
  '2': 'blue.800',
  '3': 'gray.500',
};

const Heading = ({ children, as, size = '1', align }: Props) => {
  const activeFont = useContext(siteFontContext);

  const capsizeStyles = capsize({
    capHeight: fontSize[size],
    leading: Math.floor(fontSize[size] * 1.5),
    fontMetrics: activeFont,
  });

  return (
    <Box
      as={as || element[size]}
      fontFamily={activeFont.familyName}
      letterSpacing="wide"
      color={color[size]}
      textAlign={align}
      css={capsizeStyles}
    >
      {children}
    </Box>
  );
};

export default Heading;
