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

const convertToCSS = (capsizeStyles: ReturnType<typeof capsize>) => `
.ruleName {
  font-size: ${capsizeStyles.fontSize};
  line-height: ${capsizeStyles.lineHeight};
  transform: ${capsizeStyles.transform};
  padding-top: ${capsizeStyles.paddingTop};
}

.ruleName::before {
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
}: {
  punctuation: string;
  attribute: string;
  value: string;
}) => ({
  'code[class*="language-"]': {
    whiteSpace: 'pre',
    color: 'currentColor',
  },
  'pre[class*="language-"]': {
    whiteSpace: 'pre',
    margin: 0,
  },
  punctuation: {
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
  'attr-value': {
    color: value,
  },
});

const OutputCSS = () => {
  const { state } = useAppState();

  const { leading, capHeight, metrics } = state;
  const { colors } = useTheme();

  const capsizeStyles = capsize({
    capHeight,
    leading,
    fontMetrics: metrics,
  });

  return (
    <Tabs variantColor="orange" isFitted>
      <TabList>
        <Tab>CSS-in-JS</Tab>
        <Tab>CSS</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <Box padding={4}>
            <Text as="pre">
              <SyntaxHighlighter
                language="json"
                style={editorTheme({
                  punctuation: colors.gray['500'],
                  attribute: colors.gray['300'],
                  value: colors.orange['300'],
                })}
              >
                {JSON.stringify(capsizeStyles, null, 2)}
              </SyntaxHighlighter>
            </Text>
          </Box>
        </TabPanel>
        <TabPanel>
          <Box padding={4}>
            <Text as="pre">
              <SyntaxHighlighter
                language="css"
                style={editorTheme({
                  punctuation: colors.gray['500'],
                  attribute: colors.gray['300'],
                  value: colors.orange['300'],
                })}
              >
                {convertToCSS(capsizeStyles)}
              </SyntaxHighlighter>
            </Text>
          </Box>
        </TabPanel>
        {/* <TabPanel>
          {metrics && (
            <Box padding={10}>
              <MetricsPreview metrics={metrics} />
            </Box>
          )}
        </TabPanel> */}
      </TabPanels>
    </Tabs>
  );
};

export default OutputCSS;
