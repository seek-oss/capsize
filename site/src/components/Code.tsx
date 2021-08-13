import React from 'react';
import { useTheme } from '@chakra-ui/core';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

interface Props {
  children: string;
  language: 'javascript' | 'json' | 'css';
}

const Code = ({ children, language }: Props) => {
  const { colors } = useTheme();

  const theme = {
    javascript: {
      'code[class*="language-"]': {
        whiteSpace: 'pre',
        color: colors.blue['400'],
      },
      'pre[class*="language-"]': {
        whiteSpace: 'pre',
        margin: 0,
      },
      punctuation: {
        color: colors.gray['400'],
      },
      operator: {
        color: colors.gray['500'],
      },
      number: {
        color: colors.pink['400'],
      },
      keyword: {
        color: colors.gray['600'],
      },
      function: {
        color: colors.gray['600'],
      },
      string: {
        color: colors.pink['400'],
      },
    },
    json: {
      'code[class*="language-"]': {
        whiteSpace: 'pre',
        color: colors.gray['500'],
      },
      'pre[class*="language-"]': {
        whiteSpace: 'pre',
        margin: 0,
      },
      punctuation: {
        color: colors.gray['400'],
      },
      operator: {
        color: colors.gray['400'],
      },
      number: {
        color: colors.pink['400'],
      },
      string: {
        color: colors.pink['400'],
      },
    },
    css: {
      'code[class*="language-"]': {
        whiteSpace: 'pre',
        color: colors.pink['400'],
      },
      'pre[class*="language-"]': {
        whiteSpace: 'pre',
        margin: 0,
      },
      selector: {
        color: colors.gray['700'],
      },
      property: {
        color: colors.gray['500'],
      },
      punctuation: {
        color: colors.gray['400'],
      },
      operator: {
        color: colors.gray['400'],
      },
    },
  };

  return (
    <SyntaxHighlighter language={language} style={theme[language]}>
      {children}
    </SyntaxHighlighter>
  );
};

export default Code;
