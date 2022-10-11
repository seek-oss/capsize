import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  VisuallyHidden,
  FormLabel,
  Select,
  Icon,
  Text,
} from '@chakra-ui/core';
import { detectFont } from 'detect-font';

import { useAppState } from '../AppStateContext';
import fontData from '../../../../packages/metrics/scripts/systemFonts.json';

export default function SystemFontSelector() {
  const { dispatch, state } = useAppState();
  const testRef = useRef<HTMLDivElement | null>(null);

  const [value, setValue] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (state.selectedFont.source !== 'SYSTEM_FONT') {
      setMessage('');
      setValue('');
    }
  }, [state.selectedFont.source]);

  useEffect(() => {
    if (state.selectedFont.name && testRef.current) {
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
          const newValue = ev.currentTarget.value;

          setValue(newValue);

          if (newValue) {
            dispatch({
              type: 'UPDATE_FONT',
              value: {
                metrics: fontData.filter(
                  (font) => font.familyName === newValue,
                )[0],
                font: {
                  source: 'SYSTEM_FONT',
                },
              },
            });
          }
        }}
        aria-describedby={message ? 'systemFontErrorMessage' : undefined}
        placeholder="Choose a system font"
      >
        {fontData.map((s) => (
          <option key={s.familyName}>{s.familyName}</option>
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
