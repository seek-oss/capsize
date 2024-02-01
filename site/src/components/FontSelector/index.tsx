import React, { Fragment } from 'react';
import { Tabs, TabList, Tab, TabPanels, TabPanel, Box } from '@chakra-ui/react';
import GoogleFontSelector from './GoogleFontSelector';
import SystemFontSelector from './SystemFontSelector';
import UrlFontSelector from './UrlFontSelector';
import FileUploadSelector from './FileUploadSelector';
import FontInjector from './FontInjector';
import tabStyles from '../../tabStyles';

const FontSelector = () => (
  <Fragment>
    <FontInjector />
    <Tabs {...tabStyles.tabs}>
      <TabList
        padding={2}
        margin={-2}
        paddingRight={0}
        marginRight={0}
        overflow="auto"
      >
        <Tab {...tabStyles.tab}>
          <Box whiteSpace="nowrap">Google Fonts</Box>
        </Tab>
        <Tab {...tabStyles.tab}>System</Tab>
        <Tab {...tabStyles.tab}>Url</Tab>
        <Tab {...tabStyles.tab}>Upload</Tab>
      </TabList>

      <TabPanels>
        <TabPanel padding={0}>
          <Box paddingY={4}>
            <GoogleFontSelector />
          </Box>
        </TabPanel>
        <TabPanel padding={0}>
          <Box paddingY={4}>
            <SystemFontSelector />
          </Box>
        </TabPanel>
        <TabPanel padding={0}>
          <Box paddingY={4}>
            <UrlFontSelector />
          </Box>
        </TabPanel>
        <TabPanel padding={0}>
          <Box paddingY={4}>
            <FileUploadSelector />
          </Box>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </Fragment>
);

export default FontSelector;
