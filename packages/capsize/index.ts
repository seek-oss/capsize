import blobToBuffer from 'blob-to-buffer';
import fontkit from 'fontkit';

interface FontMetrics {
  ascent: number;
  descent: number;
  lineGap: number;
  unitsPerEm: number;
  capHeight: number;
}

interface CapsizeOptions {
  leading: number;
  capHeight: number;
  fontMetrics: FontMetrics;
}

const resolveFontFileToMetrics = async ({
  fontFile,
}: {
  fontFile: Blob;
}): Promise<FontMetrics> => {
  return new Promise((resolve, reject) => {
    blobToBuffer(fontFile, (err: Error, buffer: Buffer) => {
      if (err) {
        reject(err);
        return;
      }

      try {
        const {
          capHeight,
          ascent,
          descent,
          lineGap,
          unitsPerEm,
        } = fontkit.create(buffer);

        resolve({ capHeight, ascent, descent, lineGap, unitsPerEm });
      } catch (e) {
        reject(e);
      }
    });
  });
};

const resolveFromUrl = async (url: string) => {
  const fontFile = await fetch(url).then(s => s.blob());

  return resolveFontFileToMetrics({ fontFile });
};

const resolveGoogleFont = async (name: string): Promise<FontMetrics> => {
  const fontUrl = await fetch(
    `https://fonts.googleapis.com/css?family=${name.split(' ').join('+')}`,
    {
      headers: {
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36',
      },
    },
  )
    .then(response => response.text())
    .then(responseText => (responseText.match(/(?<=url\()([^\)]*)/) || [])[0]);

  return resolveFromUrl(fontUrl);
};

const createCss = ({ leading, capHeight, fontMetrics }: CapsizeOptions) => {
  const preventCollapse = 1;
  const capHeightRatio = fontMetrics.capHeight / fontMetrics.unitsPerEm;
  const capSize = capHeight / capHeightRatio;

  const descentRatio = fontMetrics.descent / fontMetrics.unitsPerEm;
  const ascentRatio = fontMetrics.ascent / fontMetrics.unitsPerEm;

  const contentArea = fontMetrics.ascent + fontMetrics.descent;
  const lineHeight = contentArea + fontMetrics.lineGap;
  const lineHeightScale = lineHeight / fontMetrics.unitsPerEm;
  const lineHeightNormal = lineHeightScale * capSize;

  const offset = lineHeightNormal - leading;

  const distanceTop = ascentRatio - capHeightRatio + descentRatio;

  return {
    fontSize: capSize,
    lineHeight: `${leading}px`,
    transform: `translateY(calc(${descentRatio}em - ${offset / 2}px))`,
    paddingTop: preventCollapse,
    ':before': {
      content: "''",
      marginTop: `calc(${distanceTop *
        -1}em - ${preventCollapse}px + ${offset}px)`,
      display: 'block',
      height: 0,
    },
  };
};

export default createCss;
export { resolveGoogleFont, resolveFromUrl, resolveFontFileToMetrics };
