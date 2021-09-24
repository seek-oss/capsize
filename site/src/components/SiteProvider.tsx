import React, { ReactElement, createContext } from 'react';
import {
  ThemeProvider,
  ColorModeProvider,
  CSSReset,
  theme,
} from '@chakra-ui/core';
import robotoMetrics from '@capsizecss/metrics/roboto';
import abrilFatfaceMetrics from '@capsizecss/metrics/abrilFatface';

const fontContext = createContext(robotoMetrics);
export default fontContext;

interface SiteFontProviderProps {
  children: ReactElement;
}

export function SiteProvider({ children }: SiteFontProviderProps) {
  return (
    <ThemeProvider theme={theme}>
      <ColorModeProvider value="light">
        <CSSReset />
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
      </ColorModeProvider>
    </ThemeProvider>
  );
}
