import React, { useState, useEffect, useRef } from 'react';
import { fromBuiltIn } from 'capsize/src/metrics';
import data from 'capsize/src/systemFonts.json';
// @ts-expect-error
import { detectFont } from 'detect-font';

import { useAppState } from '../AppStateContext';
import {
  Box,
  VisuallyHidden,
  FormLabel,
  Select,
  Text,
  Icon,
} from '@chakra-ui/core';

type SystemFont = keyof typeof data;
const systemFontNames = Object.keys(data).sort() as Array<SystemFont>;

export default function SystemFontSelector() {
  const { dispatch, state } = useAppState();
  const testRef = useRef<HTMLDivElement | null>(null);

  const [value, setValue] = useState<SystemFont>();
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (state.selectedFont.source !== 'SYSTEM_FONT') {
      setMessage('');
      setValue(undefined);
    }
  }, [state.selectedFont.source]);

  useEffect(() => {
    if (state.selectedFont.name) {
      const wrongSystem = detectFont(testRef.current) === false;

      setMessage(
        wrongSystem
          ? 'Not available on this operating system/browser, preview likely to be incorrect, but metrics are fine.'
          : '',
      );
    }
  }, [state.selectedFont.name]);

  return (
    <Box>
      <VisuallyHidden>
        <FormLabel>System font name</FormLabel>
      </VisuallyHidden>

      <Select
        borderRadius={16}
        size="lg"
        _focus={{ boxShadow: 'outline', borderColor: 'transparent' }}
        value={value}
        onChange={(ev) => {
          const newValue = ev.currentTarget.value as SystemFont;

          setValue(newValue);

          dispatch({
            type: 'UPDATE_FONT',
            value: {
              metrics: fromBuiltIn(newValue),
              font: {
                source: 'SYSTEM_FONT',
              },
            },
          });
        }}
        aria-describedby={message ? 'systemFontErrorMessage' : undefined}
        placeholder="Choose a system font"
      >
        {systemFontNames.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </Select>
      {message && value ? (
        <Text
          id="systemFontErrorMessage"
          paddingTop={2}
          paddingX={4}
          color="gray.500"
          display="flex"
          alignItems="center"
        >
          <Icon name="infooutline" marginRight={2} /> {message}
        </Text>
      ) : null}

      <VisuallyHidden>
        <Box ref={testRef} style={{ fontFamily: state.selectedFont.name }}>
          TEST
        </Box>
      </VisuallyHidden>
    </Box>
  );
}
