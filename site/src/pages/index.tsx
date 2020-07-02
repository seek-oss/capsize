import React, { ReactNode } from 'react';
// import { Link } from 'gatsby';
import {
  Stack,
  Box,
  useTheme,
  Divider,
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
            <Heading as="h2" size="2">
              <Box
                as="span"
                style={{ color: colors.orange[400], fontSize: '1.5em' }}
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
                  <Box marginRight={[0, 0, 10]} w="60px" h="60px">
                    <Logo />
                  </Box>
                  <Heading size="1">Capsize</Heading>
                </Box>

                <Heading as="div" size="3" align={['center', 'center', 'left']}>
                  <Box as="span" whiteSpace="nowrap">
                    Flipping how we define
                  </Box>{' '}
                  <Box as="span" whiteSpace="nowrap">
                    typography in CSS.
                  </Box>
                </Heading>
              </Stack>
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
                <Tabs variantColor="orange" isFitted>
                  <ContentBlock>
                    <TabList>
                      <Tab>Preview</Tab>
                      <Tab>Metrics</Tab>
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
