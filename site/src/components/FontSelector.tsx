import React, { useState, useEffect, useRef } from 'react';
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
import { useThrottle } from 'react-use';
import fuzzy from 'fuzzy';
import blobToBuffer from 'blob-to-buffer';
// import { resolveMetrics } from 'capsize';
import opentype from 'opentype.js';
import googleFontData from './data.json';

const FontSelector = () => {
  const [fontName, setFontName] = useState('');
  const [googleFonts, setGoogleFonts] = useState([]);
  const [filteredGoogleFonts, setFilteredGoogleFonts] = useState([]);
  const throttledValue = useThrottle(fontName, 500);

  useEffect(() => {
    // make request to https://www.googleapis.com/webfonts/v1/webfonts
    setGoogleFonts(googleFontData.items);
  }, []);

  useEffect(() => {
    console.log(fontName, throttledValue);
    if (throttledValue) {
      const results = fuzzy
        .filter(throttledValue, googleFonts, {
          extract: ({ family }) => family,
        })
        .map(({ original }) => original);
      console.log(results);
      setFilteredGoogleFonts(results);
    } else {
      setFilteredGoogleFonts([]);
    }
  }, [throttledValue]);

  return (
    <Tabs>
      <TabList>
        <Tab>Google</Tab>
        <Tab disabled>Url</Tab>
        <Tab>File</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <Stack spacing={5}>
            <Input
              value={fontName}
              onChange={(ev) => setFontName(ev.currentTarget.value)}
              placeholder="Enter google font name"
            />
            {filteredGoogleFonts.slice(0, 5).map((font) => (
              <div key={font.family}>{font.family}</div>
            ))}
          </Stack>
        </TabPanel>
        <TabPanel>
          Not implemented
          {/* <Input placeholder="Enter a url" /> */}
        </TabPanel>
        <TabPanel>
          <Input
            type="file"
            placeholder="Upload a file"
            onChange={(ev) => {
              if (ev.currentTarget.files && ev.currentTarget.files[0]) {
                const reader = new FileReader();

                reader.onloadend = function (evt) {
                  console.log(opentype.parse(evt.target.result, {}));
                };

                reader.readAsArrayBuffer(ev.currentTarget.files[0]);
                // blobToBuffer(
                //   ev.currentTarget.files[0],
                //   (err: Error, buffer: Buffer) => {
                //     if (err) {
                //       console.log('BLOB PARSE ERR', err);
                //     }
                //     ev.currentTarget.files[0].arrayBuffer().then
                //     console.log(opentype.parse(, {}));
                //   },
                // );
              } else {
                console.error('SHOULDNT HAPPEN??', ev.currentTarget);
              }
            }}
            accept=".ttf, .otf, .woff, .woff2, .ttc, .dfont"
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default FontSelector;
