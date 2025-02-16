import React, { ReactNode } from 'react';
import { Box } from '@chakra-ui/react';

interface Props {
  children: ReactNode;
}

const ContentBlock = ({ children }: Props) => (
  <Box maxWidth="1024px" margin="0 auto" paddingX={[4, 4, 6, 6]} w="100%">
    {children}
  </Box>
);

export default ContentBlock;
