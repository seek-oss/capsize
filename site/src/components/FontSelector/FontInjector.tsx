import { useEffect } from 'react';
import { injectGlobal } from 'emotion';

import { useAppState } from '../AppStateContext';

export default function FontInjector() {
  const { state } = useAppState();

  const { metrics, selectedFont } = state;

  useEffect(() => {
    injectGlobal({
      '@font-face': {
        fontFamily:
          metrics.familyName.indexOf(' ') > -1
            ? `'${metrics.familyName}'`
            : metrics.familyName,
        src: `url(${selectedFont.url}) format('${selectedFont.type}')`,
      },
    });
  }, [metrics, selectedFont]);

  return null;
}
