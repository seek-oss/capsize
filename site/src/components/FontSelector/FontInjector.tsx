import React, { useEffect } from 'react';
import { injectGlobal } from 'emotion';

import { useAppState } from '../AppStateContext';

export default function FontInjector() {
  const { state } = useAppState();

  const { metrics, selectedFont } = state;

  useEffect(() => {
    if (
      selectedFont.source === 'URL' ||
      selectedFont.source === 'FILE_UPLOAD'
    ) {
      injectGlobal({
        '@font-face': {
          fontFamily: metrics.familyName,
          src: `url(${selectedFont.url}) format('${selectedFont.type}')`,
        },
      });
    }
  }, [metrics, selectedFont]);

  return selectedFont.source === 'GOOGLE_FONT' ? (
    <link href={selectedFont.url} rel="stylesheet" />
  ) : null;
}
