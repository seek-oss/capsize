import fetch from 'node-fetch';
import { resolveGoogleFont, resolveFromFilePath, FontMetrics } from './index';

// @ts-ignore
if (!global.fetch) {
  // @ts-ignore
  global.fetch = fetch;
}

// import allFonts from './data.json';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyCfZtU84atx_WfNYHO-zKLEaFLKyYXatAg&family=Anonymous+Pro

type ExtractParams =
  | {
      path: string;
      name?: string;
    }
  | { name: string };

const resolveFont = async (params: ExtractParams): Promise<FontMetrics> => {
  if ('path' in params && params.path.startsWith('/')) {
    return resolveFromFilePath(params.path);
  } else {
    try {
      if (params.name) {
        return resolveGoogleFont(params.name);
      }
    } catch (e) {
      console.error(e);
    }
  }

  throw new Error('No valid path or font name to resolve.');
};

const extractValue = async (params: ExtractParams) => {
  const metrics = await resolveFont(params);

  console.log(metrics);
  console.log('\n');

  return metrics;
};

(async () => {
  await extractValue({
    path: '/Users/mtaranto/Desktop/Courier-01.ttf',
  });
  // interface FontError {
  //   name: string;
  //   error: string;
  // }
  // const errors: FontError[] = [];
  // process.on('SIGINT', () => {
  //   console.error(JSON.stringify(errors, null, 2));
  //   process.exit(1);
  // });

  // allFonts.items.forEach(async (font) => {
  //   try {
  //     if (!font.files.regular) {
  //       await extractValue({ name: `${font.family}:wght@${font.variants[0]}` });
  //     } else {
  //       await extractValue({ name: font.family });
  //     }
  //   } catch (e) {
  //     errors.push({ name: font.family, error: JSON.stringify(e) });
  //   }
  //   //   // console.log(metric)
  // });

  await extractValue({
    name: 'Fahkwang',
  });
  // await extractValue({
  //   name: 'Nunito Sans',
  // });
  // await extractValue({
  //   name: 'Open Sans',
  // });
  // await extractValue({
  //   name: 'Parisienne',
  // });
})();
