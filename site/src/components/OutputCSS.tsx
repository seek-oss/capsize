import React from 'react';
import { Tabs, TabList, Tab, TabPanels, TabPanel, Box } from '@chakra-ui/core';
import capsize from 'capsize';

import { useAppState } from './AppStateContext';
import tabStyles from '../tabStyles';
import Code from './Code';

const convertToCSS = (capsizeStyles: ReturnType<typeof capsize>) => `
.capsizedText {
  font-size: ${capsizeStyles.fontSize};${
  'lineHeight' in capsizeStyles
    ? `
  line-height: ${capsizeStyles.lineHeight};`
    : ''
}
  padding: ${capsizeStyles.padding};
}

.capsizedText::before {	
  content: "";	
  margin-top: ${capsizeStyles[':before'].marginTop};	
  display: ${capsizeStyles[':before'].display};	
  height: ${capsizeStyles[':before'].height};	
}

.capsizedText::after {	
  content: "";	
  margin-bottom: ${capsizeStyles[':after'].marginBottom};	
  display: ${capsizeStyles[':after'].display};	
  height: ${capsizeStyles[':after'].height};	
}
`;

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
  } = state;

  let capsizeStyles;

  if (textSizeStyle === 'fontSize') {
    capsizeStyles = capsize({
      fontSize,
      ...(lineHeightStyle === 'leading' && { leading }),
      ...(lineHeightStyle === 'lineGap' && { lineGap }),
      fontMetrics: metrics,
    });
  } else if (textSizeStyle === 'capHeight') {
    capsizeStyles = capsize({
      capHeight,
      ...(lineHeightStyle === 'leading' && { leading }),
      ...(lineHeightStyle === 'lineGap' && { lineGap }),
      fontMetrics: metrics,
    });
  }

  return (
    <Tabs {...tabStyles.tabs}>
      <TabList>
        {/* <Tab {...tabStyles.tab}>JavaScript</Tab> */}
        <Tab {...tabStyles.tab}>CSS-in-JS</Tab>
        <Tab {...tabStyles.tab}>CSS</Tab>
      </TabList>

      <TabPanels>
        {/* <TabPanel>
          <Box paddingY={4} paddingX={2} paddingTop={8}>
            <Code language="javascript">
              {`import capsize from 'capsize';

const fontMetrics = ${JSON.stringify(metrics, null, 2)};

const styles = capsize({
  fontMetrics,${
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
  lineGap: ${lineGap}`
                  : ''
              }${
                lineHeightStyle === 'leading'
                  ? `
  leading: ${leading}`
                  : ''
              }
});
`.replace(/\"/gm, '')}
            </Code>
          </Box>
        </TabPanel> */}
        <TabPanel>
          <Box paddingY={4} paddingX={2} paddingTop={8}>
            <Box overflow="auto">
              <Code language="json">
                {JSON.stringify(capsizeStyles, null, 2)}
              </Code>
            </Box>
          </Box>
        </TabPanel>
        <TabPanel>
          <Box paddingY={4} paddingX={2} paddingTop={2}>
            <Box overflow="auto">
              <Code language="css">
                {capsizeStyles ? convertToCSS(capsizeStyles) : ''}
              </Code>
            </Box>
          </Box>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default OutputCSS;
