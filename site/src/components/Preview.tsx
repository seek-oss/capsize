import React from 'react';
import { Tabs, TabList, Tab, TabPanels, TabPanel, Box } from '@chakra-ui/core';
import { FontMetrics } from 'capsize';
import MetricsPreview from './MetricsPreview';

interface Props {
  metrics?: FontMetrics;
}

const Preview = ({ metrics }: Props) => (
  <Tabs defaultIndex={2}>
    <TabList>
      <Tab disabled>CSS</Tab>
      <Tab disabled>Post-CSS</Tab>
      <Tab>Metrics</Tab>
    </TabList>

    <TabPanels>
      <TabPanel>
        <p>Stylesheet</p>
      </TabPanel>
      <TabPanel>
        <p>CSS Object</p>
      </TabPanel>
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
