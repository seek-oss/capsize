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
      <Stack spacing={8}>
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
        <Box>
          <ContentBlock>
            <Box
              d="flex"
              flexDirection={['column', 'column', 'row']}
              alignItems="center"
              // justifyContent="center"
            >
              <Box
                marginRight={[0, 0, 10]}
                w="20vw"
                h="20vw"
                style={{
                  maxHeight: 120,
                  maxWidth: 120,
                  minHeight: 80,
                  minWidth: 80,
                }}
              >
                <Logo />
              </Box>
              <Box as="h1" fontSize={['2xl', '4xl', '6xl']} fontWeight="bold">
                <Box style={{ fontSize: '2em' }}>Capsize</Box>
              </Box>
            </Box>

            <Box
              as="h2"
              fontSize={['2xl', '2xl', '3xl']}
              textAlign={['center', 'center', 'left']}
            >
              <Box as="span" whiteSpace="nowrap">
                Flipping how we define
              </Box>{' '}
              <Box as="span" whiteSpace="nowrap">
                typography in CSS.
              </Box>
            </Box>
          </ContentBlock>
        </Box>

        <Box>
          <Stack spacing={10}>
            <Box>
              <Step number={1} title="Choose a font">
                <FontSelector />
              </Step>
            </Box>

            <Box>
              <Step number={2} title="Adjust size & spacing">
                <CapSizeSelector />
              </Step>
            </Box>

            <Box>
              <Preview />
            </Box>
          </Stack>
        </Box>

        <Box>
          <Step number={3} title="Apply the styles">
            <OutputCSS />
          </Step>
        </Box>
      </Stack>
    </Layout>
  </AppStateProvider>
);

export default IndexPage;
