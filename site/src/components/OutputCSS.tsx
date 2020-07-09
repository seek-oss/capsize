import React from 'react';
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Text,
  Box,
  useTheme,
} from '@chakra-ui/core';
import capsize from 'capsize';

// @ts-expect-error
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

import { useAppState } from './AppStateContext';
import tabStyles from '../tabStyles';

const convertToCSS = (capsizeStyles: ReturnType<typeof capsize>) => `
.capsizedText {
  font-size: ${capsizeStyles.fontSize};${
  'lineHeight' in capsizeStyles
    ? `
  line-height: ${capsizeStyles.lineHeight};`
    : ''
}
  transform: ${capsizeStyles.transform};
  padding-top: ${capsizeStyles.paddingTop};
}

.capsizedText::before {	
  content: "";	
  margin-top: ${capsizeStyles[':before'].marginTop};	
  display: ${capsizeStyles[':before'].display};	
  height: ${capsizeStyles[':before'].height};	
}
`;

const editorTheme = ({
  punctuation,
  attribute,
  value,
  regular,
  selector,
}: {
  punctuation: string;
  attribute: string;
  value: string;
  regular: string;
  selector?: string;
}) => ({
  'code[class*="language-"]': {
    whiteSpace: 'pre',
    color: regular,
  },
  'pre[class*="language-"]': {
    whiteSpace: 'pre',
    margin: 0,
  },
  selector: {
    color: selector || regular,
  },
  punctuation: {
    color: punctuation,
  },
  operator: {
    color: punctuation,
  },
  property: {
    color: attribute,
  },
  number: {
    color: value,
  },
  string: {
    color: value,
  },
  unit: {
    color: value,
  },
  function: {
    color: value,
  },
  'attr-value': {
    color: value,
  },
});

const OutputCSS = () => {
  const { state } = useAppState();

  const { leading, capHeight, metrics, lineHeightStyle, lineGap } = state;
  const { colors } = useTheme();

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
              <Text as="pre">
                <SyntaxHighlighter
                  language="json"
                  style={editorTheme({
                    punctuation: colors.gray['400'],
                    attribute: colors.gray['500'],
                    value: colors.pink['400'],
                    regular: colors.gray['500'],
                  })}
                >
                  {JSON.stringify(capsizeStyles, null, 2)}
                </SyntaxHighlighter>
              </Text>
            </Box>
          </Box>
        </TabPanel>
        <TabPanel>
          <Box padding={4} paddingTop={2}>
            <Box overflow="auto">
              <Text as="pre">
                <SyntaxHighlighter
                  language="css"
                  style={editorTheme({
                    punctuation: colors.gray['400'],
                    attribute: colors.gray['500'],
                    value: colors.pink['400'],
                    regular: colors.pink['400'],
                    selector: colors.gray['700'],
                  })}
                >
                  {convertToCSS(capsizeStyles)}
                </SyntaxHighlighter>
              </Text>
            </Box>
          </Box>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default OutputCSS;
