import fontkit, { Font } from 'fontkit';
import 'isomorphic-fetch';
import { resolveGoogleFont } from '.';
// import commandLineArgs from 'command-line-args';
// import allFonts from './data.json';

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyCfZtU84atx_WfNYHO-zKLEaFLKyYXatAg&family=Anonymous+Pro

const unpackFont = (fontPath: string) =>
  new Promise<Font>((resolve, reject) =>
    fontkit.open(fontPath, '', (err, font) => {
      if (err) {
        reject(err);
      }
      resolve(font);
    }),
  );

type ExtractParams =
  | {
      path: string;
      name?: string;
    }
  | { name: string };

const resolveFont = async (params: ExtractParams): Promise<Font> => {
  if ('path' in params && params.path.startsWith('/')) {
    return await unpackFont(params.path);
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
  const {
    ascent,
    descent,
    lineGap,
    unitsPerEm,
    capHeight,
    xHeight,
  } = await resolveFont(params);

  const metrics = { capHeight, ascent, descent, lineGap, unitsPerEm, xHeight };

  console.log(params.name);
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
