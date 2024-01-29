import React from 'react';
import { Tabs, TabList, Tab, TabPanels, TabPanel, Box } from '@chakra-ui/react';
import { createStyleString } from '@capsizecss/core';

import { useAppState } from './AppStateContext';
import tabStyles from '../tabStyles';
import Code from './Code';
import { fontFamilyToCamelCase } from '@capsizecss/metrics';

const OutputCSS = () => {
  const { state } = useAppState();

  const {
    leading,
    capHeight,
    fontSize,
    metrics,
    lineHeightStyle,
    textSizeStyle,
    lineGap,
    selectedFont,
  } = state;

  let capsizeOptions;

  if (textSizeStyle === 'fontSize') {
    capsizeOptions = {
      fontSize,
      ...(lineHeightStyle === 'leading' && { leading }),
      ...(lineHeightStyle === 'lineGap' && { lineGap }),
      fontMetrics: metrics,
    };
  } else if (textSizeStyle === 'capHeight') {
    capsizeOptions = {
      capHeight,
      ...(lineHeightStyle === 'leading' && { leading }),
      ...(lineHeightStyle === 'lineGap' && { lineGap }),
      fontMetrics: metrics,
    };
  }

  const fontMetricsImport: Record<typeof selectedFont.source, string> = {
    GOOGLE_FONT: `import fontMetrics from '@capsizecss/metrics/${fontFamilyToCamelCase(
      selectedFont.name,
    )}';`,
    SYSTEM_FONT: `import fontMetrics from '@capsizecss/metrics/${fontFamilyToCamelCase(
      selectedFont.name,
    )}';`,
    FILE_UPLOAD: `import { fromFile } from '@capsizecss/unpack';`,
    URL: `import { fromUrl } from '@capsizecss/unpack';`,
  };

  const fontMetricsUsage: Record<typeof selectedFont.source, string> = {
    GOOGLE_FONT: 'fontMetrics',
    SYSTEM_FONT: 'fontMetrics',
    FILE_UPLOAD: `fontMetrics: fromFile('${selectedFont.originalFileName}')`,
    URL: `fontMetrics: fromUrl('${selectedFont.url}')`,
  };

  return (
    <Tabs {...tabStyles.tabs}>
      <TabList>
        <Tab {...tabStyles.tab}>JavaScript</Tab>
        <Tab {...tabStyles.tab}>CSS</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <Box paddingY={4} paddingX={2} paddingTop={8} overflow="auto">
            <Code language="javascript">
              {`import { createStyleObject } from '@capsizecss/core';
${fontMetricsImport[selectedFont.source]}

const styles = createStyleObject({${
                textSizeStyle === 'fontSize'
                  ? `
  fontSize: ${fontSize},`
                  : ''
              }${
                textSizeStyle === 'capHeight'
                  ? `
  capHeight: ${capHeight},`
                  : ''
              }${
                lineHeightStyle === 'lineGap'
                  ? `
  lineGap: ${lineGap},`
                  : ''
              }${
                lineHeightStyle === 'leading'
                  ? `
  leading: ${leading},`
                  : ''
              }
  ${fontMetricsUsage[selectedFont.source]}
});
`.replace(/\"/gm, '')}
            </Code>
          </Box>
        </TabPanel>
        <TabPanel>
          <Box paddingY={4} paddingX={2} paddingTop={2}>
            <Box overflow="auto">
              <Code language="css">
                {capsizeOptions
                  ? createStyleString('capsizedText', capsizeOptions)
                  : ''}
              </Code>
            </Box>
          </Box>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default OutputCSS;
