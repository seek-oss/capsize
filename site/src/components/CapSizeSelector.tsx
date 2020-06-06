import React, { ChangeEvent } from 'react';
import {
  Box,
  FormLabel,
  Stack,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  IconButton,
  Input,
} from '@chakra-ui/core';

import { useAppState } from './AppStateContext';

const CapSizeSelector = () => {
  const { state, dispatch } = useAppState();

  const { leading, capHeight, scaleLeading } = state;

  return (
    <Stack spacing={8}>
      <Stack isInline alignItems="center" spacing={5}>
        <Box>
          <FormLabel
            id="capHeightLabel"
            htmlFor="capHeightField"
            whiteSpace="nowrap"
            fontSize="xl"
            w={120}
          >
            Cap Height
          </FormLabel>
        </Box>
        <Slider
          id="capHeightSlider"
          aria-labelledby="capHeightLabel"
          value={capHeight}
          min={10}
          max={200}
          onFocus={() => dispatch({ type: 'CAPHEIGHT_FOCUS' })}
          onBlur={() => dispatch({ type: 'CAPHEIGHT_BLUR' })}
          onChange={(newValue) =>
            dispatch({
              type: 'UPDATE_CAPHEIGHT',
              capHeight: newValue,
              leading,
            })
          }
        >
          <SliderTrack bg="orange.200" opacity={0.4} />
          <SliderFilledTrack bg="orange.400" />
          <SliderThumb size={6}>
            <Box color="orange.400" />
          </SliderThumb>
        </Slider>

        <Input
          id="capHeightField"
          value={capHeight}
          type="number"
          name="capHeight"
          onFocus={() => dispatch({ type: 'CAPHEIGHT_FOCUS' })}
          onBlur={() => dispatch({ type: 'CAPHEIGHT_BLUR' })}
          onChange={(ev: ChangeEvent<HTMLInputElement>) => {
            console.log('capheight change fired');
            dispatch({
              type: 'UPDATE_CAPHEIGHT',
              capHeight: parseInt(ev.currentTarget.value, 10),
              leading,
            });
          }}
          fontSize="xl"
          w={80}
        />
      </Stack>

      <Stack isInline alignItems="center" spacing={5}>
        <Stack isInline alignItems="center" spacing={1}>
          <Box w={120}>
            <FormLabel
              id="leadingLabel"
              htmlFor="leadingField"
              whiteSpace="nowrap"
              fontSize="xl"
            >
              Leading
            </FormLabel>
            <IconButton
              variant="outline"
              aria-label="Toggle maintaining scale to selected capHeight"
              size="sm"
              icon={scaleLeading ? 'lock' : 'unlock'}
              onFocus={() => dispatch({ type: 'LEADING_FOCUS' })}
              onBlur={() => dispatch({ type: 'LEADING_BLUR' })}
              onClick={() => dispatch({ type: 'TOGGLE_LEADING_SCALE' })}
              color={scaleLeading ? 'orange.300' : undefined}
              isRound
            />
          </Box>
        </Stack>
        <Slider
          id="leadingSlider"
          aria-labelledby="leadingLabel"
          value={leading}
          onFocus={() => dispatch({ type: 'LEADING_FOCUS' })}
          onBlur={() => dispatch({ type: 'LEADING_BLUR' })}
          onChange={(newValue) => {
            console.log('leading change fired');
            dispatch({
              type: 'UPDATE_LEADING',
              value: newValue,
            });
          }}
        >
          <SliderTrack bg="orange.200" opacity={0.4} />
          <SliderFilledTrack bg="orange.400" />
          <SliderThumb size={6}>
            <Box color="orange.400" />
          </SliderThumb>
        </Slider>
        <Input
          id="leadingField"
          name="leading"
          value={leading}
          type="number"
          onFocus={() => dispatch({ type: 'LEADING_FOCUS' })}
          onBlur={() => dispatch({ type: 'LEADING_BLUR' })}
          onChange={(ev: ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'UPDATE_LEADING',
              value: parseInt(ev.currentTarget.value, 10),
            });
          }}
          fontSize="xl"
          w={80}
        />
      </Stack>
    </Stack>
  );
};

export default CapSizeSelector;
