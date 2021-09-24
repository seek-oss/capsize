import React, { useState, ChangeEvent, useEffect } from 'react';
import {
  Input,
  VisuallyHidden,
  FormLabel,
  Button,
  InputGroup,
  InputRightElement,
  Box,
  Text,
} from '@chakra-ui/core';
import { fromUrl } from '@capsizecss/unpack';

import { useAppState } from '../AppStateContext';

export default function UrlFontSelector() {
  const { dispatch, state } = useAppState();

  const [fontUrl, setFontUrl] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (state.selectedFont.source !== 'URL') {
      setMessage('');
      setFontUrl('');
    }
  }, [state.selectedFont.source]);

  return (
    <form
      onSubmit={async (ev) => {
        ev.preventDefault();

        if (!fontUrl) {
          setMessage('Please provide a url');
          return;
        }

        try {
          const metrics = await fromUrl(fontUrl);

          const fontUrlParts = fontUrl.split('.') || [];
          const extension = fontUrlParts[fontUrlParts.length - 1];

          dispatch({
            type: 'UPDATE_FONT',
            value: {
              metrics,
              font: {
                source: 'URL',
                url: fontUrl,
                extension,
              },
            },
          });
        } catch (e) {
          setMessage('Something went wrong. Please try again.');
        }
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
          type="url"
          aria-describedby={message ? 'urlErrorMessage' : undefined}
          onChange={(ev: ChangeEvent<HTMLInputElement>) => {
            setFontUrl(ev.currentTarget.value);
            if (message) {
              setMessage('');
            }
          }}
          isInvalid={Boolean(message)}
          placeholder="Enter a url"
          _focus={{ boxShadow: 'outline', borderColor: 'transparent' }}
          borderRadius={16}
          paddingRight={20}
        />
        <InputRightElement width="85px" overflow="hidden">
          <Box
            transition="opacity .15s ease,transform .15s ease"
            opacity={!fontUrl ? 0 : undefined}
            transform={!fontUrl ? 'translateX(12px)' : undefined}
          >
            <Button
              tabIndex={!fontUrl ? -1 : 0}
              size="sm"
              borderRadius={12}
              color="gray.600"
              type="submit"
            >
              Submit
            </Button>
          </Box>
        </InputRightElement>
      </InputGroup>
      {message ? (
        <Text
          id="urlErrorMessage"
          pos="absolute"
          paddingY={2}
          paddingX={4}
          color="red.500"
        >
          {message}
        </Text>
      ) : null}
    </form>
  );
}
