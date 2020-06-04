import React, { useState } from 'react';
import { Link } from 'gatsby';
import { Stack, Box } from '@chakra-ui/core';

// @ts-ignore
import Layout from '../components/layout';
// @ts-ignore
import SEO from '../components/seo';
import FontSelector from '../components/FontSelector';
import Preview from '../components/Preview';
import { FontMetrics } from 'capsize';

const IndexPage = () => {
  const [metrics, setMetrics] = useState<FontMetrics>();

  return (
    <Layout>
      <SEO />
      <Stack spacing={10}>
        <Box>
          <FontSelector onSelect={setMetrics} />
        </Box>

        <Box>
          <Preview metrics={metrics} />
        </Box>

        <Box>
          <Link to="/page-2/">Go to page 2</Link> <br />
          <Link to="/using-typescript/">Go to "Using TypeScript"</Link>
        </Box>
      </Stack>
    </Layout>
  );
};

export default IndexPage;
