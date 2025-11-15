import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import type { PageContextServer } from 'vike/types';
import { HelmetProvider } from 'react-helmet-async';

let root: ReactDOM.Root;

// https://vike.dev/onRenderClient
export const onRenderClient = async (pageContext: PageContextServer) => {
  const { Page } = pageContext;

  if (!Page)
    throw new Error(
      'My onRenderClient() hook expects pageContext.Page to be defined',
    );

  const container = document.getElementById('root');
  if (!container) throw new Error('DOM element #root not found');

  const page = (
    <StrictMode>
      <HelmetProvider>
        <Page />
      </HelmetProvider>
    </StrictMode>
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
