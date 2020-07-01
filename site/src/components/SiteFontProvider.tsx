import React, { ReactElement, createContext, useState } from 'react';
import { useInterval } from 'react-use';
import siteFonts from '../siteFonts.json';

const fontContext = createContext(siteFonts[0]);
export default fontContext;

interface SiteFontProviderProps {
  children: ReactElement;
}

export function SiteFontProvider({ children }: SiteFontProviderProps) {
  const [activeFontIndex, setActiveFontIndex] = useState(0);

  useInterval(() => {
    const nextIndex =
      activeFontIndex === siteFonts.length - 1 ? 0 : activeFontIndex + 1;
    setActiveFontIndex(nextIndex);
  }, 3000);

  return (
    <fontContext.Provider value={siteFonts[activeFontIndex]}>
      {children}
    </fontContext.Provider>
  );
}
