import React from 'react';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/core';

const Preview = ({ metrics }) => (
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
      <TabPanel>{JSON.stringify(metrics, null, 2)}</TabPanel>
    </TabPanels>
  </Tabs>
);

export default Preview;
