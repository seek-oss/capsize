import React from 'react';
// import { Link } from 'gatsby';
import { Stack, Box, Heading } from '@chakra-ui/core';

import { AppStateProvider } from '../components/AppStateContext';
import Seo from '../components/Seo';
import Layout from '../components/Layout';
import FontSelector from '../components/FontSelector';
import OutputCSS from '../components/OutputCSS';
import Logo from '../components/Logo';
import CapSizeSelector from '../components/CapSizeSelector';
import Preview from '../components/Preview';

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
            capsize
          </Heading>
        </Box>

        <Box>
          <Stack spacing={10}>
            <Box>
              <Box style={{ maxWidth: 600, margin: '0 auto' }} w="100%">
                <FontSelector />
              </Box>
            </Box>

            <CapSizeSelector />

            <Preview />
          </Stack>
        </Box>

        <Box>
          <Box style={{ maxWidth: 600, margin: '0 auto' }} w="100%">
            <OutputCSS />
          </Box>
        </Box>
      </Stack>
    </Layout>
  </AppStateProvider>
);

export default IndexPage;
