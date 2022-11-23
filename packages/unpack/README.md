<img src="https://raw.githubusercontent.com/seek-oss/capsize/HEAD/images/capsize-header.png" alt="Capsize" title="Capsize" width="443px" />
<br/>

# @capsizecss/unpack

Unpack the capsize font metrics directly from a font file.

```bash
npm install @capsizecss/unpack
```

## Usage

### `fromBlob`

Takes a file blob and returns the resolved [font metrics](#font-metrics).

```ts
import { fromBlob } from '@capsizecss/unpack';

const metrics = await fromBlob(file);
```

### `fromUrl`

Takes a url string and returns the resolved [font metrics](#font-metrics).

```ts
import { fromUrl } from '@capsizecss/unpack';

const metrics = await fromUrl(url);
```

### `fromFile`

Takes a file path string and returns the resolved [font metrics](#font-metrics).

```ts
import { fromFile } from '@capsizecss/unpack';

const metrics = await fromFile(filePath);
```

## Font metrics

The font metrics object returned contains the following properties:

| Property   | Type   | Description                                                               |
| ---------- | ------ | ------------------------------------------------------------------------- |
| familyName | string | Font family name as authored by font creator                              |
| category   | string | Style of the font: serif, sans-serif, monospace, display, or handwriting  |
| capHeight  | number | The height of capital letters above the baseline                          |
| ascent     | number | The height of the ascenders above baseline                                |
| descent    | number | The descent of the descenders below baseline                              |
| lineGap    | number | The amount of space included between lines                                |
| unitsPerEm | number | The size of the font’s internal coordinate grid                           |
| xHeight    | number | The height of lower case letters                                          |
| xWidthAvg  | number | The average width of lowercase characters (currently supports latin only) |

## Thanks

- [Devon Govett](https://github.com/devongovett) for creating [Fontkit](https://github.com/foliojs/fontkit), which does all the heavy lifting of extracting the font metrics under the covers.
- [SEEK](https://www.seek.com.au) for giving us the space to do interesting work.

## License

MIT.
