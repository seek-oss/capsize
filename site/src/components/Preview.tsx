import React from 'react';
import { Tabs, TabList, Tab, TabPanels, TabPanel, Box } from '@chakra-ui/core';
import capsize from 'capsize';

import MetricsPreview from './MetricsPreview';
import { useAppState } from './AppStateContext';

const Preview = () => {
  const { state } = useAppState();

  const { leading, capHeight, metrics } = state;

  const capsizeStyles = capsize({
    capHeight,
    leading,
    fontMetrics: metrics,
  });

  return (
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
        <TabPanel>{JSON.stringify(capsizeStyles, null, 2)}</TabPanel>
        <TabPanel>
          <Box padding={10}>
            <MetricsPreview />
          </Box>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default Preview;
