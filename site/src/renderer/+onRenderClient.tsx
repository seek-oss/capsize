import * as ReactDOM from 'react-dom/client';
import type { OnRenderClientAsync } from 'vike/types';
import { HelmetProvider } from 'react-helmet-async';

let root: ReactDOM.Root;

// https://vike.dev/onRenderClient
export const onRenderClient: OnRenderClientAsync = async (pageContext) => {
  const { Page } = pageContext;

  if (!Page)
    throw new Error(
      'My onRenderClient() hook expects pageContext.Page to be defined',
    );

  const container = document.getElementById('root');
  if (!container) throw new Error('DOM element #root not found');

  const page = (
    <HelmetProvider>
      <Page />
    </HelmetProvider>
  );
  if (pageContext.isHydration) {
    root = ReactDOM.hydrateRoot(container, page);
  } else {
    if (!root) {
      root = ReactDOM.createRoot(container);
    }
    root.render(page);
  }
};
