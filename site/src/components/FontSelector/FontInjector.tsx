import { useEffect } from 'react';
import { injectGlobal } from 'emotion';

import { useAppState } from '../AppStateContext';

export default function FontInjector() {
  const { state } = useAppState();

  const { selectedFont } = state;

  useEffect(() => {
    injectGlobal({
      '@font-face': {
        fontFamily:
          selectedFont.name.indexOf(' ') > -1
            ? `'${selectedFont.name}'`
            : selectedFont.name,
        src: `url(${selectedFont.url}) format('${selectedFont.type}')`,
      },
    });
  }, [selectedFont]);

  return null;
}
