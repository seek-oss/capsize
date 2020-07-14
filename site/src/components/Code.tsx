import React from 'react';
import { Text, useTheme } from '@chakra-ui/core';

// @ts-expect-error
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

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

interface Props {
  children: string;
  language: 'json' | 'css';
}

const Code = ({ children, language }: Props) => {
  const { colors } = useTheme();

  const theme = {
    json: editorTheme({
      punctuation: colors.gray['400'],
      attribute: colors.gray['500'],
      value: colors.pink['400'],
      regular: colors.gray['500'],
    }),
    css: editorTheme({
      punctuation: colors.gray['400'],
      attribute: colors.gray['500'],
      value: colors.pink['400'],
      regular: colors.pink['400'],
      selector: colors.gray['700'],
    }),
  };

  return (
    <Text as="pre">
      <SyntaxHighlighter language={language} style={theme[language]}>
        {children}
      </SyntaxHighlighter>
    </Text>
  );
};

export default Code;
