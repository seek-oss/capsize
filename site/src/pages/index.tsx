import React, { ReactNode } from 'react';
import { Stack, Box } from '@chakra-ui/core';

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
import fontSizes from '../fontSizes';

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

const logoSize = fontSizes['1'].map(
  (size, i) => `${i < 2 ? size * 1.8 : size}px`,
);

const IndexPage = () => (
  <AppStateProvider>
    <SiteProvider>
      <Layout>
        <Seo />
        <Stack spacing={[10, 20, 20, 20, 24]}>
          <Box bg="gray.50" paddingY={[10, 20, 20, 20, 40]}>
            <ContentBlock>
              <Stack spacing={8}>
                <Box
                  d="flex"
                  flexDirection={['column', 'column', 'row']}
                  alignItems="center"
                >
                  <Box
                    marginRight={[0, 0, 6]}
                    marginBottom={[4, 4, 0]}
                    w={logoSize}
                    h={logoSize}
                  >
                    <Logo />
                  </Box>
                  <Heading size="1">Capsize</Heading>
                </Box>

                <Heading as="div" size="3" align={['center', 'center', 'left']}>
                  <Box paddingX={[4, 4, 0]}>
                    <Box as="span" whiteSpace="nowrap">
                      Flipping how we define
                    </Box>{' '}
                    <Box as="span" whiteSpace="nowrap">
                      typography in CSS.
                    </Box>
                  </Box>
                </Heading>
              </Stack>
            </ContentBlock>
          </Box>

          <Box>
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
        </Stack>
      </Layout>
    </SiteProvider>
  </AppStateProvider>
);

export default IndexPage;
