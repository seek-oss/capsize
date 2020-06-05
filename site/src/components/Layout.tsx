import React, { ReactNode } from 'react';
import { Box } from '@chakra-ui/core';

interface Props {
  children: ReactNode;
}

const footerHeight = 40;

const Layout = ({ children }: Props) => (
  <Box
    pos="relative"
    paddingY={20}
    style={{
      margin: `0 auto`,
      minHeight: '100vh',
    }}
  >
    <Box as="main" style={{ marginBottom: footerHeight }}>
      {children}
    </Box>
    <Box
      as="footer"
      d="flex"
      alignItems="center"
      style={{ position: 'absolute', bottom: 0, height: footerHeight }}
    >
      <Box as="span">
        © {new Date().getFullYear()}, Built with{' '}
        <a href="https://www.gatsbyjs.org">Gatsby</a>
      </Box>
    </Box>
  </Box>
);

export default Layout;
