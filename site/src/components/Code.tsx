import { useEffect, useState } from 'react';
import { Code as ChakraCode, useTheme } from '@chakra-ui/react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';

const languages = {
  javascript: import(
    'react-syntax-highlighter/dist/esm/languages/prism/javascript'
  ),
  json: import('react-syntax-highlighter/dist/esm/languages/prism/json'),
  css: import('react-syntax-highlighter/dist/esm/languages/prism/css'),
} as const;

const CodeRenderer = (props: React.ComponentProps<typeof ChakraCode>) => (
  <ChakraCode
    display="block"
    background="transparent"
    padding={0}
    whiteSpace="pre"
    fontSize="md"
    {...props}
  />
);

interface Props {
  children: string;
  language: keyof typeof languages;
}

const Code = ({ children, language }: Props) => {
  const [isReady, setIsReady] = useState(false);
  const { colors } = useTheme();

  useEffect(() => {
    async function registerLanguages() {
      await Promise.all(
        Object.entries(languages).map(async ([lang, langPromise]) => {
          const { default: langModule } = await langPromise;
          SyntaxHighlighter.registerLanguage(lang, langModule);
        }),
      );

      setIsReady(true);
    }

    registerLanguages();
  }, []);

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

  return isReady ? (
    <SyntaxHighlighter
      language={language}
      style={theme[language]}
      CodeTag={CodeRenderer}
    >
      {children}
    </SyntaxHighlighter>
  ) : (
    <CodeRenderer color="gray.600">{children}</CodeRenderer>
  );
};

export default Code;
