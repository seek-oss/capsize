import React from 'react';
import {
  Box,
  FormLabel,
  Stack,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
} from '@chakra-ui/core';

import { useAppState } from './AppStateContext';

const CapSizeSelector = () => {
  const { state, dispatch } = useAppState();

  const { leading, capHeight } = state;

  return (
    <Stack spacing={8}>
      <Stack isInline alignItems="center" spacing={10}>
        <Box>
          <FormLabel
            htmlFor="capHeight"
            whiteSpace="nowrap"
            fontSize="xl"
            w={100}
          >
            Cap Height
          </FormLabel>
        </Box>
        <Slider
          id="capHeight"
          value={capHeight}
          min={10}
          max={200}
          onFocus={() => dispatch({ type: 'CAPHEIGHT_FOCUS' })}
          onBlur={() => dispatch({ type: 'CAPHEIGHT_BLUR' })}
          onChange={(newValue) =>
            dispatch({
              type: 'UPDATE_CAPHEIGHT',
              value: newValue,
            })
          }
        >
          <SliderTrack bg="orange.200" opacity={0.4} />
          <SliderFilledTrack bg="orange.400" />
          <SliderThumb size={6}>
            <Box color="orange.400" />
          </SliderThumb>
        </Slider>

        <Text fontSize="xl">{capHeight}px</Text>
      </Stack>

      <Stack isInline alignItems="center" spacing={10}>
        <Box>
          <FormLabel
            htmlFor="leading"
            whiteSpace="nowrap"
            fontSize="xl"
            w={100}
          >
            Leading
          </FormLabel>
        </Box>
        <Slider
          id="leading"
          value={leading}
          onFocus={() => dispatch({ type: 'LEADING_FOCUS' })}
          onBlur={() => dispatch({ type: 'LEADING_BLUR' })}
          onChange={(newValue) =>
            dispatch({
              type: 'UPDATE_LEADING',
              value: newValue,
            })
          }
        >
          <SliderTrack bg="orange.200" opacity={0.4} />
          <SliderFilledTrack bg="orange.400" />
          <SliderThumb size={6}>
            <Box color="orange.400" />
          </SliderThumb>
        </Slider>
        <Text fontSize="xl">{leading}px</Text>
      </Stack>
    </Stack>
  );
};

export default CapSizeSelector;
