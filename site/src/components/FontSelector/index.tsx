import React, { Fragment } from 'react';
import { Tabs, TabList, Tab, TabPanels, TabPanel, Box } from '@chakra-ui/core';
import GoogleFontSelector from './GoogleFontSelector';
import UrlFontSelector from './UrlFontSelector';
import FileUploadSelector from './FileUploadSelector';
import FontInjector from './FontInjector';
import tabStyles from '../../tabStyles';

const FontSelector = () => (
  <Fragment>
    <FontInjector />
    <Tabs {...tabStyles.tabs}>
      <TabList>
        <Tab {...tabStyles.tab}>
          <Box whiteSpace="nowrap">Google Fonts</Box>
        </Tab>
        <Tab {...tabStyles.tab}>Url</Tab>
        <Tab {...tabStyles.tab}>Upload</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <Box paddingY={4}>
            <GoogleFontSelector />
          </Box>
        </TabPanel>
        <TabPanel>
          <Box paddingY={4}>
            <UrlFontSelector />
          </Box>
        </TabPanel>
        <TabPanel>
          <Box paddingY={4}>
            <FileUploadSelector />
          </Box>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </Fragment>
);

export default FontSelector;
