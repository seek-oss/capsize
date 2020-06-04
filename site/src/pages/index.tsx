import React, { useState } from 'react';
// import { Link } from 'gatsby';
import { Stack, Box, Heading, Button } from '@chakra-ui/core';

import { FontMetrics } from 'capsize/metrics';

import Seo from '../components/Seo';
import Layout from '../components/Layout';
import FontSelector from '../components/FontSelector';
import Preview from '../components/Preview';
import Logo from '../components/Logo';
import CapSizeSelector from '../components/CapSizeSelector';

const IndexPage = () => {
  const [metrics, setMetrics] = useState<FontMetrics | null>(null);
  const [capSize, setCapSize] = useState();

  return (
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
            <Box style={{ maxWidth: 600, margin: '0 auto' }} w="100%">
              <FontSelector onSelect={setMetrics} />
            </Box>

            {metrics && (
              <CapSizeSelector metrics={metrics} onSelect={setCapSize} />
            )}
          </Stack>
        </Box>

        <Box>
          {metrics && capSize && (
            <Box style={{ maxWidth: 600, margin: '0 auto' }} w="100%">
              <Preview capSize={capSize} metrics={metrics} />
            </Box>
          )}
        </Box>

        {/* <Box>
          <Link to="/page-2/">Go to page 2</Link> <br />
          <Link to="/using-typescript/">Go to "Using TypeScript"</Link>
        </Box> */}
        {metrics && (
          <Box d="flex">
            <Button
              onClick={() => setMetrics(null)}
              variantColor="white"
              variant="outline"
            >
              Start over
            </Button>
          </Box>
        )}
      </Stack>
    </Layout>
  );
};

export default IndexPage;
