import React, { ReactNode } from 'react';
import { Box } from '@chakra-ui/core';

interface Props {
  children: ReactNode;
}

const footerHeight = 40;

const Layout = ({ children }: Props) => (
  <Box
    bg="gray.50"
    pos="relative"
    paddingBottom={20}
    margin="0 auto"
    minHeight="100vh"
  >
    <Box as="main" marginBottom={`${footerHeight}px`} paddingBottom={20}>
      {children}
    </Box>
  </Box>
);

export default Layout;
