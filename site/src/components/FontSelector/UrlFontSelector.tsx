import React, { useState, ChangeEvent } from 'react';
import {
  Input,
  VisuallyHidden,
  FormLabel,
  Button,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/core';
import { fromUrl } from 'capsize/metrics';

import { useAppState } from '../AppStateContext';
import { fontTypeFromUrl } from './fontTypeFromUrl';

export default function UrlFontSelector() {
  const { dispatch } = useAppState();

  const [fontUrl, setFontUrl] = useState('');

  return (
    <form
      onSubmit={async (ev) => {
        ev.preventDefault();
        const metrics = await fromUrl(fontUrl);
        dispatch({
          type: 'UPDATE_FONT',
          value: {
            metrics,
            font: {
              source: 'URL',
              url: fontUrl,
              type: fontTypeFromUrl(fontUrl),
            },
          },
        });
      }}
    >
      <VisuallyHidden>
        <FormLabel htmlFor="url">Font url</FormLabel>
      </VisuallyHidden>
      <InputGroup size="lg">
        <Input
          value={fontUrl}
          id="url"
          name="url"
          onChange={(ev: ChangeEvent<HTMLInputElement>) =>
            setFontUrl(ev.currentTarget.value)
          }
          placeholder="Enter a url"
          _focus={{ boxShadow: 'outline', borderColor: 'transparent' }}
          borderRadius={16}
        />
        <InputRightElement width="85px">
          <Button size="sm" borderRadius={12} color="gray.600" type="submit">
            Submit
          </Button>
        </InputRightElement>
      </InputGroup>
    </form>
  );
}
