import React from 'react';
import { Tabs, TabList, Tab, TabPanels, TabPanel, Box } from '@chakra-ui/core';
import { FontMetrics } from 'capsize/metrics';

import MetricsPreview from './MetricsPreview';

interface Props {
  metrics: FontMetrics;
  capSize: any;
}

const Preview = ({ metrics, capSize }: Props) => (
  <Tabs defaultIndex={1} variantColor="orange" isFitted>
    <TabList>
      <Tab disabled>CSS</Tab>
      <Tab>Post-CSS</Tab>
      <Tab>Metrics</Tab>
    </TabList>

    <TabPanels>
      <TabPanel>
        <p>Stylesheet</p>
      </TabPanel>
      <TabPanel>{JSON.stringify(capSize, null, 2)}</TabPanel>
      <TabPanel>
        {metrics && (
          <Box padding={10}>
            <MetricsPreview metrics={metrics} />
            {/* {JSON.stringify(metrics, null, 2)} */}
          </Box>
        )}
      </TabPanel>
    </TabPanels>
  </Tabs>
);

export default Preview;
