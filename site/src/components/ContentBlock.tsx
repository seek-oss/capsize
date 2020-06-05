import React, { ReactNode } from 'react';
import { Box } from '@chakra-ui/core';

interface Props {
  children: ReactNode;
}

const ContentBlock = ({ children }: Props) => (
  <Box
    style={{ maxWidth: 800, margin: '0 auto' }}
    paddingX={[2, 2, 4, 0]}
    w="100%"
  >
    {children}
  </Box>
);

export default ContentBlock;
