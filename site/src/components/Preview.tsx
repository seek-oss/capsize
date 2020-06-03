import React from 'react';
import {
  Input,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Stack,
  Box,
} from '@chakra-ui/core';

const Preview = () => (
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
        <p>Metrics here</p>
      </TabPanel>
    </TabPanels>
  </Tabs>
);

export default Preview;
