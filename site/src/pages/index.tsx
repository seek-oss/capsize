import React, { ReactNode } from 'react';
// import { Link } from 'gatsby';
import {
  Stack,
  Box,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/core';

import { AppStateProvider } from '../components/AppStateContext';
import { SiteFontProvider } from '../components/SiteFontProvider';
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
import tabStyles from '../tabStyles';
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
  <ContentBlock>
    <Stack spacing={8}>
      {title && (
        <Box>
          <Heading as="h2" size="2">
            <Box as="span" color="pink.400" fontSize={['1.2em', '1.5em']}>
              {number}.{' '}
            </Box>
            {title}
          </Heading>
        </Box>
      )}

      <Box>{children}</Box>
    </Stack>
  </ContentBlock>
);

const logoSize = fontSizes['1'].map(
  (size, i) => `${i < 2 ? size * 1.8 : size}px`,
);

const IndexPage = () => (
  <AppStateProvider>
    <SiteFontProvider>
      <Layout>
        <Seo />
        <Stack spacing={20}>
          <Box>
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
            <Stack spacing={16}>
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
                <Tabs {...tabStyles.tabs}>
                  <ContentBlock>
                    <TabList>
                      <Tab {...tabStyles.tab}>Preview</Tab>
                      <Tab {...tabStyles.tab}>Metrics</Tab>
                    </TabList>
                  </ContentBlock>

                  <TabPanels>
                    <TabPanel>
                      <Box paddingY={4}>
                        <Preview />
                      </Box>
                    </TabPanel>
                    <TabPanel>
                      <ContentBlock>
                        <Box paddingY={4}>
                          <MetricsPreview />
                        </Box>
                      </ContentBlock>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
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
    </SiteFontProvider>
  </AppStateProvider>
);

export default IndexPage;
