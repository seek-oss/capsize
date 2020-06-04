import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Input,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Stack,
  Box,
  PseudoBox,
} from '@chakra-ui/core';
import { useThrottle } from 'react-use';
import fuzzy from 'fuzzy';
import {
  fromBlob,
  fromGoogleFonts,
  fromUrl,
  FontMetrics,
} from 'capsize/metrics';
import googleFontData from './data.json';

interface Props {
  onSelect: (metrics: FontMetrics | null) => void;
}

const FontSelector = ({ onSelect }: Props) => {
  const [fontName, setFontName] = useState('');
  const [fontUrl, setFontUrl] = useState('');
  const [googleFonts, setGoogleFonts] = useState<typeof googleFontData.items>(
    [],
  );
  const [filteredGoogleFonts, setFilteredGoogleFonts] = useState<
    typeof googleFontData.items
  >([]);
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
  }, [googleFonts, throttledValue]);

  return (
    <Tabs variantColor="orange" isFitted onChange={() => onSelect(null)}>
      <TabList>
        <Tab>Google</Tab>
        <Tab>Url</Tab>
        <Tab>File</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <Stack spacing={3}>
            <Input
              value={fontName}
              onFocus={() => onSelect(null)}
              onChange={(ev: ChangeEvent<HTMLInputElement>) =>
                setFontName(ev.currentTarget.value)
              }
              placeholder="Enter google font name"
            />
            <Box pos="relative">
              <Box pos="absolute" w="100%">
                {filteredGoogleFonts.slice(0, 5).map((font) => (
                  <Box
                    key={font.family}
                    pos="relative"
                    d="flex"
                    alignItems="center"
                    paddingX={4}
                    paddingY={2}
                    onClick={async () => {
                      const metrics = await fromGoogleFonts(font.family);
                      onSelect(metrics);
                    }}
                  >
                    <PseudoBox
                      w="100%"
                      h="100%"
                      pos="absolute"
                      left={0}
                      opacity={0.1}
                      rounded="lg"
                      _hover={{
                        bg: 'white',
                      }}
                    />
                    {font.family}
                  </Box>
                ))}
              </Box>
            </Box>
          </Stack>
        </TabPanel>
        <TabPanel>
          <form
            onSubmit={async (ev) => {
              ev.preventDefault();
              const metrics = await fromUrl(fontUrl);
              onSelect(metrics);
            }}
          >
            <Input
              value={fontUrl}
              name="url"
              onChange={(ev: ChangeEvent<HTMLInputElement>) =>
                setFontUrl(ev.currentTarget.value)
              }
              placeholder="Enter a url"
            />
          </form>
        </TabPanel>
        <TabPanel>
          <Input
            type="file"
            placeholder="Upload a file"
            onChange={async (ev: ChangeEvent<HTMLInputElement>) => {
              if (ev.currentTarget.files && ev.currentTarget.files[0]) {
                const metrics = await fromBlob(ev.currentTarget.files[0]);
                onSelect(metrics);
              } else {
                // eslint-disable-next-line no-console
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
