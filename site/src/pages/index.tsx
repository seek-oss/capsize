import React from 'react';
import { Link } from 'gatsby';
import { Stack, Box } from '@chakra-ui/core';

import Layout from '../components/layout';
import SEO from '../components/seo';
import FontSelector from '../components/FontSelector';
import Preview from '../components/Preview';

const IndexPage = () => (
  <Layout>
    <SEO />
    <Stack spacing={10}>
      <Box>
        <FontSelector />
      </Box>

      <Box>
        <Preview />
      </Box>

      <Box>
        <Link to="/page-2/">Go to page 2</Link> <br />
        <Link to="/using-typescript/">Go to "Using TypeScript"</Link>
      </Box>
    </Stack>
  </Layout>
);

export default IndexPage;
