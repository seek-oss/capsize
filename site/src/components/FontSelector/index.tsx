import React, { Fragment } from 'react';
import { Tabs, TabList, Tab, TabPanels, TabPanel, Box } from '@chakra-ui/core';
import GoogleFontSelector from './GoogleFontSelector';
import UrlFontSelector from './UrlFontSelector';
import FileUploadSelector from './FileUploadSelector';
import FontInjector from './FontInjector';
import tabStyles from '../../tabStyles';
import SystemFontSelector from './SystemFontSelector';

const FontSelector = () => (
  <Fragment>
    <FontInjector />
    <Tabs {...tabStyles.tabs}>
      <Box
        overflow="auto"
        padding={2}
        margin={-2}
        paddingRight={0}
        marginRight={0}
      >
        <TabList>
          <Tab {...tabStyles.tab}>
            <Box whiteSpace="nowrap">Google Fonts</Box>
          </Tab>
          <Tab {...tabStyles.tab}>System</Tab>
          <Tab {...tabStyles.tab}>Url</Tab>
          <Tab {...tabStyles.tab}>Upload</Tab>
        </TabList>
      </Box>

      <Box paddingY={4}>
        <TabPanels>
          <TabPanel>
            <GoogleFontSelector />
          </TabPanel>
          <TabPanel>
            <SystemFontSelector />
          </TabPanel>
          <TabPanel>
            <UrlFontSelector />
          </TabPanel>
          <TabPanel>
            <FileUploadSelector />
          </TabPanel>
        </TabPanels>
      </Box>
    </Tabs>
  </Fragment>
);

export default FontSelector;
