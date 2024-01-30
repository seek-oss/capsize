import * as ReactDOMServer from 'react-dom/server';
import { escapeInject as html, dangerouslySkipEscape } from 'vike/server';
import type { OnRenderHtmlAsync } from 'vike/types';
import { HelmetProvider } from 'react-helmet-async';

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
      <Page />
    </HelmetProvider>,
  );
  const { helmet } = helmetContext;

  const documentHtml = html`<!DOCTYPE html>
    <html ${dangerouslySkipEscape(helmet!.htmlAttributes.toString())}>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        ${dangerouslySkipEscape(helmet!.title.toString())}
        ${dangerouslySkipEscape(helmet!.meta.toString())}
        ${dangerouslySkipEscape(helmet!.link.toString())}
      </head>
      <body>
        <div id="root">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`;

  return {
    documentHtml,
    pageContext: {},
  };
};
