import React, { ReactNode, useEffect, useState } from 'react';
import { Box } from '@chakra-ui/core';
import siteFonts from '../siteFonts.json';

interface Props {
  children: ReactNode;
}

const footerHeight = 40;

const Layout = ({ children }: Props) => {
  const [webFonts, setWebFonts] = useState<string[]>([]);
  useEffect(() => {
    setWebFonts(siteFonts.map(({ familyName }) => familyName));
  }, []);

  return (
    <Box pos="relative" paddingY={20} margin="0 auto" minHeight="100vh">
      {webFonts.map((font) => (
        <link
          key={font}
          href={`https://fonts.googleapis.com/css?family=${font}`}
          rel="stylesheet"
        />
      ))}
      <Box as="main" marginBottom={`${footerHeight}px`} paddingBottom={20}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
