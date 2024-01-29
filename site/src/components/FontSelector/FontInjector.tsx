import React from 'react';
import { Global } from '@emotion/react';

import { useAppState } from '../AppStateContext';

export default function FontInjector() {
  const { state } = useAppState();
  const { selectedFont } = state;

  return selectedFont.url ? (
    <Global
      styles={{
        '@font-face': {
          fontFamily:
            selectedFont.name.indexOf(' ') > -1
              ? `'${selectedFont.name}'`
              : selectedFont.name,
          src: `url(\'${selectedFont.url}\') format(\'${selectedFont.format}\')`,
        },
      }}
    />
  ) : null;
}
