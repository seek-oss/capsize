import React from 'react';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/core';
import capsize from 'capsize';

import { useAppState } from './AppStateContext';

const OutputCSS = () => {
  const { state } = useAppState();

  const { leading, capHeight, metrics } = state;

  const capsizeStyles = capsize({
    capHeight,
    leading,
    fontMetrics: metrics,
  });

  return (
    <Tabs variantColor="orange" isFitted>
      <TabList>
        <Tab>CSS-in-JS</Tab>
        <Tab disabled>CSS</Tab>
        {/* <Tab>Metrics</Tab> */}
      </TabList>

      <TabPanels>
        <TabPanel>
          <p>{JSON.stringify(capsizeStyles, null, 2)}</p>
        </TabPanel>
        <TabPanel>{JSON.stringify(capsizeStyles, null, 2)}</TabPanel>
        {/* <TabPanel>
          {metrics && (
            <Box padding={10}>
              <MetricsPreview metrics={metrics} />
            </Box>
          )}
        </TabPanel> */}
      </TabPanels>
    </Tabs>
  );
};

export default OutputCSS;
