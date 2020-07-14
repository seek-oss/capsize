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

  const { leading, capHeight, metrics, lineHeightStyle, lineGap } = state;

  const capsizeStyles = capsize({
    capHeight,
    leading: lineHeightStyle === 'leading' ? leading : undefined,
    gap: lineHeightStyle === 'gap' ? lineGap : undefined,
    fontMetrics: metrics,
  });

  return (
    <Tabs {...tabStyles.tabs}>
      <TabList>
        <Tab {...tabStyles.tab}>CSS-in-JS</Tab>
        <Tab {...tabStyles.tab}>CSS</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <Box padding={4} paddingTop={8}>
            <Box overflow="auto">
              <Code language="json">
                {JSON.stringify(capsizeStyles, null, 2)}
              </Code>
            </Box>
          </Box>
        </TabPanel>
        <TabPanel>
          <Box padding={4} paddingTop={2}>
            <Box overflow="auto">
              <Code language="css">{convertToCSS(capsizeStyles)}</Code>
            </Box>
          </Box>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default OutputCSS;
