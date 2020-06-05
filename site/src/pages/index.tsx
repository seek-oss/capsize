import React, { ReactNode } from 'react';
// import { Link } from 'gatsby';
import { Stack, Box, Heading, useTheme, Divider } from '@chakra-ui/core';

import { AppStateProvider } from '../components/AppStateContext';
import Seo from '../components/Seo';
import Layout from '../components/Layout';
import FontSelector from '../components/FontSelector';
import OutputCSS from '../components/OutputCSS';
import Logo from '../components/Logo';
import CapSizeSelector from '../components/CapSizeSelector';
import Preview from '../components/Preview';
import ContentBlock from '../components/ContentBlock';

const Step = ({
  number,
  title,
  children,
}: {
  number?: number;
  title?: string;
  children: ReactNode;
}) => {
  const { colors } = useTheme();

  return (
    <ContentBlock>
      <Stack spacing={5}>
        {title && (
          <Box>
            <Heading as="h2" fontSize={['2xl', '4xl']}>
              <Box
                as="span"
                style={{ color: colors.orange[400], fontSize: '2em' }}
              >
                {number}.{' '}
              </Box>
              {title}
            </Heading>
            <Divider />
          </Box>
        )}

        <Box>{children}</Box>
      </Stack>
    </ContentBlock>
  );
};

const IndexPage = () => (
  <AppStateProvider>
    <Layout>
      <Seo />
      <Stack spacing={20}>
        <Box d="flex" alignItems="center" justifyContent="center">
          <Box
            marginRight={10}
            style={{
              maxHeight: 150,
              maxWidth: 150,
              height: '30vh',
              width: '30vw',
            }}
          >
            <Logo />
          </Box>
          <Heading as="h1" size="2xl">
            Capsize
          </Heading>
        </Box>

        <Box>
          <Stack spacing={10}>
            <Box>
              <Step number={1} title="Choose your font">
                <FontSelector />
              </Step>
            </Box>

            <Box>
              <Step number={2} title="Adjust your size & spacing">
                <CapSizeSelector />
              </Step>
            </Box>

            <Box>
              <Preview />
            </Box>
          </Stack>
        </Box>

        <Box>
          <Step>
            <OutputCSS />
          </Step>
        </Box>
      </Stack>
    </Layout>
  </AppStateProvider>
);

export default IndexPage;
