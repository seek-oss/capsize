import * as ReactDOMServer from 'react-dom/server';
import { escapeInject as html, dangerouslySkipEscape } from 'vike/server';
import type { OnRenderHtmlAsync } from 'vike/types';
import { HelmetProvider } from 'react-helmet-async';
import { CacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import createCache from '@emotion/cache';

const key = 'css';
const cache = createCache({ key });
const { extractCriticalToChunks, constructStyleTagsFromChunks } =
  createEmotionServer(cache);

// https://vike.dev/onRenderHtml
export const onRenderHtml: OnRenderHtmlAsync = async (pageContext) => {
  const { Page } = pageContext;

  if (!Page)
    throw new Error(
      'My onRenderHtml() hook expects pageContext.Page to be defined',
    );

  const helmetContext: React.ComponentProps<typeof HelmetProvider>['context'] =
    {};
  const pageHtml = ReactDOMServer.renderToString(
    <HelmetProvider context={helmetContext}>
      <CacheProvider value={cache}>
        <Page />
      </CacheProvider>
    </HelmetProvider>,
  );
  const { helmet } = helmetContext;
  const chunks = extractCriticalToChunks(pageHtml);
  const styles = constructStyleTagsFromChunks(chunks);

  const documentHtml = html`<!DOCTYPE html>
    <html
      ${dangerouslySkipEscape(helmet!.htmlAttributes.toString())}
      data-theme="light"
      style="color-scheme: light;"
    >
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        ${dangerouslySkipEscape(helmet!.title.toString())}
        ${dangerouslySkipEscape(helmet!.meta.toString())}
        ${dangerouslySkipEscape(helmet!.link.toString())}
        ${dangerouslySkipEscape(styles)}
      </head>
      <body class="chakra-ui-light">
        <div id="root">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`;

  return {
    documentHtml,
    pageContext: {},
  };
};
