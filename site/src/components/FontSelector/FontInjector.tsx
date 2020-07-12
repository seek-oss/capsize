import { useEffect } from 'react';
import { injectGlobal } from 'emotion';

import { useAppState } from '../AppStateContext';

export default function FontInjector() {
  const { state } = useAppState();

  const { metrics, selectedFont } = state;
  const familyName = metrics.familyName || 'Unknown Family';
  useEffect(() => {
    injectGlobal({
      '@font-face': {
        fontFamily:
          familyName.indexOf(' ') > -1
            ? `'${familyName}'`
            : familyName,
        src: `url(${selectedFont.url}) format('${selectedFont.type}')`,
      },
    });
  }, [metrics, selectedFont]);

  return null;
}
