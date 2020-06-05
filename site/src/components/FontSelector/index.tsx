import React, { Fragment } from 'react';
import { Tabs, TabList, Tab, TabPanels, TabPanel, Box } from '@chakra-ui/core';
import GoogleFontSelector from './GoogleFontSelector';
import UrlFontSelector from './UrlFontSelector';
import FileUploadSelector from './FileUploadSelector';
import FontInjector from './FontInjector';

const FontSelector = () => (
  <Fragment>
    <FontInjector />
    <Tabs variantColor="orange" isFitted>
      <TabList>
        <Tab>Google Fonts</Tab>
        <Tab>Url</Tab>
        <Tab>Upload</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <Box padding={4}>
            <GoogleFontSelector />
          </Box>
        </TabPanel>
        <TabPanel>
          <Box padding={4}>
            <UrlFontSelector />
          </Box>
        </TabPanel>
        <TabPanel>
          <Box padding={4}>
            <FileUploadSelector />
          </Box>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </Fragment>
);

export default FontSelector;
