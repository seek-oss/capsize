import React, { ReactNode } from 'react';
import { Stack, Box, Text, Link } from '@chakra-ui/react';
import { HelmetProvider } from 'react-helmet-async';

import { AppStateProvider } from '../components/AppStateContext';
import { SiteProvider } from '../components/SiteProvider';
import Seo from '../components/Seo';
import Layout from '../components/Layout';
import FontSelector from '../components/FontSelector';
import OutputCSS from '../components/OutputCSS';
import Logo from '../components/Logo';
import CapSizeSelector from '../components/CapSizeSelector';
import Preview from '../components/Preview';
import MetricsPreview from '../components/MetricsPreview';
import ContentBlock from '../components/ContentBlock';
import Heading from '../components/Heading';
import FAQs from '../components/FAQs';
import GitHubStars from '../components/GitHubStars';

const Step = ({
  number,
  title,
  children,
}: {
  number?: number;
  title?: string;
  children: ReactNode;
}) => (
  <Stack spacing={10}>
    {title && (
      <Box>
        <ContentBlock>
          <Heading as="h2" size="2">
            <Box as="span" color="pink.400" fontSize={['1.2em', '1.5em']}>
              {number}.{' '}
            </Box>
            {title}
          </Heading>
        </ContentBlock>
      </Box>
    )}
    <Box>{children}</Box>
  </Stack>
);

const IndexPage = () => (
  <HelmetProvider>
    <AppStateProvider>
      <SiteProvider>
        <Layout>
          <Seo />
          <Stack spacing={[10, 20]}>
            <Box paddingTop={[10, 20]}>
              <ContentBlock>
                <Stack spacing={10}>
                  <Stack spacing={[12, 12, 16]}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                    >
                      <Box
                        marginBottom={[4, 4, 8]}
                        w={[80, 100, 120]}
                        h={[80, 100, 120]}
                      >
                        <Logo />
                      </Box>
                      <Heading size="1">Capsize</Heading>
                    </Box>
                    <Box>
                      <Heading as="div" size="3" align="center">
                        <Box whiteSpace="nowrap">
                          Flipping how we define
                          <br />
                          typography in CSS
                        </Box>
                      </Heading>
                    </Box>
                    <Box display="flex" justifyContent="center" paddingX={2}>
                      <Text
                        fontSize={[18, 18, 20]}
                        color="#66748A"
                        maxWidth="48ex"
                        textAlign="center"
                      >
                        Capsize makes the sizing and layout of text as
                        predictable as every other element on the screen.
                        <br />
                        <br />
                        Using font metadata, text can now be sized according to
                        the height of its capital letters while trimming the
                        space above capital letters and below the baseline.
                      </Text>
                    </Box>
                  </Stack>
                  <Box
                    display="flex"
                    justifyContent="center"
                    flexDirection={['column', 'row']}
                  >
                    <Text
                      fontSize={[16, 16, 20]}
                      fontFamily="monospace"
                      textAlign="center"
                      bg="gray.100"
                      paddingY={3}
                      paddingX={6}
                      borderRadius={24}
                      marginBottom={[4, 0]}
                    >
                      npm install @capsizecss/core
                    </Text>
                    <Link
                      href="https://github.com/seek-oss/capsize"
                      display="flex"
                      justifyContent="center"
                      marginLeft={[0, 4]}
                      borderRadius={24}
                      boxShadow="0 0 0 2px #edf2f7"
                      color="#66748A"
                      paddingX={4}
                      paddingY={[2, 0]}
                      _hover={{ background: '#f1f5f9', color: 'inherit' }}
                    >
                      <GitHubStars />
                    </Link>
                  </Box>
                </Stack>
              </ContentBlock>
            </Box>
            <Box background="white" paddingY={[10, 20]}>
              <Stack spacing={[10, 10, 10, 20]}>
                <Box>
                  <Step number={1} title="Choose a font">
                    <ContentBlock>
                      <Stack spacing={6}>
                        <Box>
                          <FontSelector />
                        </Box>
                        <Box>
                          <MetricsPreview />
                        </Box>
                      </Stack>
                    </ContentBlock>
                  </Step>
                </Box>
                <Box>
                  <Step number={2} title="Adjust size & spacing">
                    <Stack spacing={10}>
                      <Box>
                        <ContentBlock>
                          <CapSizeSelector />
                        </ContentBlock>
                      </Box>
                      <Box>
                        <Preview />
                      </Box>
                    </Stack>
                  </Step>
                </Box>
                <Box>
                  <Step number={3} title="Apply the styles">
                    <ContentBlock>
                      <OutputCSS />
                    </ContentBlock>
                  </Step>
                </Box>
              </Stack>
            </Box>
            <Box as="section">
              <ContentBlock>
                <FAQs />
              </ContentBlock>
            </Box>
          </Stack>
        </Layout>
      </SiteProvider>
    </AppStateProvider>
  </HelmetProvider>
);

export default IndexPage;
