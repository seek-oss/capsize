import React, { useState } from 'react';
// import { Link } from 'gatsby';
import { Stack, Box, Heading } from '@chakra-ui/core';

import { FontMetrics } from 'capsize';

import SEO from '../components/Seo';
import Layout from '../components/Layout';
import FontSelector from '../components/FontSelector';
import Preview from '../components/Preview';
import Logo from '../components/Logo';

const IndexPage = () => {
  const [metrics, setMetrics] = useState<FontMetrics>();

  return (
    <Layout>
      <SEO />
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
          <Box style={{ maxWidth: 600, margin: '0 auto' }} w="100%">
            <FontSelector onSelect={setMetrics} />
          </Box>
        </Box>

        <Box>{metrics && <Preview metrics={metrics} />}</Box>

        {/* <Box>
          <Link to="/page-2/">Go to page 2</Link> <br />
          <Link to="/using-typescript/">Go to "Using TypeScript"</Link>
        </Box> */}
      </Stack>
    </Layout>
  );
};

export default IndexPage;
