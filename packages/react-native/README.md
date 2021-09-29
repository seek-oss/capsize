<img src="https://raw.githubusercontent.com/seek-oss/capsize/HEAD/images/capsize-header.png" alt="Capsize" title="Capsize" width="443px" />
<br/>

# @capsizecss/react-native

Integration package for [React Native](https://vanilla-extract.style).

```bash
npm install @capsizecss/react-native
```

## Usage

Import `createTextStyle` within your React Native code, passing the relevant [options](../../README.md#options), which returns standard [style values](https://reactnative.dev/docs/style) that can be spread into style objects.

```tsx
// Heading.tsx
import type { ReactNode } from 'react';
import { Text } from 'react-native';
import { createTextStyle } from '@capsizecss/react-native';

const headingStyle = {
  fontFamily: 'Roboto',
  fontWeight: 'bold',
  ...createTextStyle({
    fontSize: 24,
    leading: 30,
    fontMetrics: {
      capHeight: 1456,
      ascent: 1900,
      descent: -500,
      lineGap: 0,
      unitsPerEm: 2048,
    },
  }),
} as const;

export const Heading = ({ children }: { children: ReactNode }) => (
  <Text style={headingStyle}>{children}</Text>
);
```

# License

MIT.
