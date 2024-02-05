import React, { ReactElement, createContext } from 'react';
import { ChakraProvider, ThemeConfig, extendTheme } from '@chakra-ui/react';
import robotoMetrics from '@capsizecss/metrics/roboto';
import abrilFatfaceMetrics from '@capsizecss/metrics/abrilFatface';

const fontContext = createContext(robotoMetrics);
export default fontContext;

interface SiteFontProviderProps {
  children: ReactElement;
}

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({ config });

export function SiteProvider({ children }: SiteFontProviderProps) {
  return (
    <ChakraProvider theme={theme}>
      <fontContext.Provider value={abrilFatfaceMetrics}>
        <link
          href={`https://fonts.googleapis.com/css2?family=Roboto`}
          rel="stylesheet"
        />
        <link
          href={`https://fonts.googleapis.com/css2?family=${abrilFatfaceMetrics.familyName
            .split(' ')
            .join('+')}`}
          rel="stylesheet"
        />
        {children}
      </fontContext.Provider>
    </ChakraProvider>
  );
}
