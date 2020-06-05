import React, { Fragment } from 'react';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/core';
import GoogleFontSelector from './GoogleFontSelector';
import UrlFontSelector from './UrlFontSelector';
import FileUploadSelector from './FileUploadSelector';
import FontInjector from './FontInjector';

const FontSelector = () => (
  <Fragment>
    <FontInjector />
    <Tabs variantColor="orange" isFitted>
      <TabList>
        <Tab>Google</Tab>
        <Tab>Url</Tab>
        <Tab>File</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <GoogleFontSelector />
        </TabPanel>
        <TabPanel>
          <UrlFontSelector />
        </TabPanel>
        <TabPanel>
          <FileUploadSelector />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </Fragment>
);

export default FontSelector;
