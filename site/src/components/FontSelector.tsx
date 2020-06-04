import React, { useState, useEffect } from 'react';
import {
  Input,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Stack,
} from '@chakra-ui/core';
import { useThrottle } from 'react-use';
import fuzzy from 'fuzzy';
import {
  resolveFontFileToMetrics,
  resolveGoogleFont,
  resolveFromUrl,
} from 'capsize';
import googleFontData from './data.json';

const FontSelector = ({ onSelect }) => {
  const [fontName, setFontName] = useState('');
  const [fontUrl, setFontUrl] = useState('');
  const [googleFonts, setGoogleFonts] = useState([]);
  const [filteredGoogleFonts, setFilteredGoogleFonts] = useState([]);
  const throttledValue = useThrottle(fontName, 500);

  useEffect(() => {
    // make request to https://www.googleapis.com/webfonts/v1/webfonts
    setGoogleFonts(googleFontData.items);
  }, []);

  useEffect(() => {
    if (throttledValue) {
      const results = fuzzy
        .filter(throttledValue, googleFonts, {
          extract: ({ family }) => family,
        })
        .map(({ original }) => original);

      setFilteredGoogleFonts(results);
    } else {
      setFilteredGoogleFonts([]);
    }
  }, [throttledValue]);

  return (
    <Tabs>
      <TabList>
        <Tab>Google</Tab>
        <Tab>Url</Tab>
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
              <div
                key={font.family}
                onClick={async () => {
                  const metrics = await resolveGoogleFont(font.family);
                  onSelect(metrics);
                }}
              >
                {font.family}
              </div>
            ))}
          </Stack>
        </TabPanel>
        <TabPanel>
          <form
            onSubmit={async (ev) => {
              ev.preventDefault();
              const metrics = await resolveFromUrl(fontUrl);
              onSelect(metrics);
            }}
          >
            <Input
              value={fontUrl}
              name="url"
              onChange={(ev) => setFontUrl(ev.currentTarget.value)}
              placeholder="Enter a url"
            />
          </form>
        </TabPanel>
        <TabPanel>
          <Input
            type="file"
            placeholder="Upload a file"
            onChange={async (ev) => {
              if (ev.currentTarget.files && ev.currentTarget.files[0]) {
                const metrics = await resolveFontFileToMetrics({
                  fontFile: ev.currentTarget.files[0],
                });
                onSelect(metrics);
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
