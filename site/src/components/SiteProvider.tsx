import React, { ReactElement, createContext } from 'react';
import {
  ThemeProvider,
  ColorModeProvider,
  CSSReset,
  theme,
} from '@chakra-ui/core';
import siteFonts from '../siteFonts.json';

const fontContext = createContext(siteFonts[0]);
export default fontContext;

interface SiteFontProviderProps {
  children: ReactElement;
}

const siteFont = siteFonts[1];

export function SiteProvider({ children }: SiteFontProviderProps) {
  return (
    <ThemeProvider theme={theme}>
      <ColorModeProvider value="light">
        <CSSReset />
        <fontContext.Provider value={siteFont}>
          <link
            key={siteFont.familyName}
            href={`https://fonts.googleapis.com/css2?family=${siteFont.familyName
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
