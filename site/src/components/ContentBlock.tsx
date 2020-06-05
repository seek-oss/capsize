import React, { ReactNode } from 'react';
import { Box } from '@chakra-ui/core';

interface Props {
  children: ReactNode;
}

const ContentBlock = ({ children }: Props) => (
  <Box style={{ maxWidth: 800, margin: '0 auto' }} w="100%">
    {children}
  </Box>
);

export default ContentBlock;
