import React, { useState, ChangeEvent } from 'react';
import {
  Input,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/core';
import { fromBlob, fromUrl } from 'capsize/metrics';
import GoogleFontSelector from './GoogleFontSelector';
import { useAppState } from './AppStateContext';

const FontSelector = () => {
  const { dispatch } = useAppState();

  const [fontUrl, setFontUrl] = useState('');

  return (
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
          <form
            onSubmit={async (ev) => {
              ev.preventDefault();
              const metrics = await fromUrl(fontUrl);
              dispatch({ type: 'UPDATE_METRICS', value: metrics });
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
                dispatch({ type: 'UPDATE_METRICS', value: metrics });
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
