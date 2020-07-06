import React, { ChangeEvent, useState } from 'react';
import {
  Box,
  FormLabel,
  Stack,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  IconButton,
  Input,
} from '@chakra-ui/core';

import { useAppState } from './AppStateContext';

const CapSizeSelector = () => {
  const { state, dispatch } = useAppState();
  const [gridStep, setGridStep] = useState(4);
  const [useGrid, setUseGrid] = useState(false);

  const { leading, capHeight, scaleLeading } = state;

  return (
    <Stack spacing={8}>
      <Stack isInline alignItems="center" spacing={5}>
        <Stack isInline alignItems="center" spacing={1}>
          <Box w={[130, 150]} h={10} d="flex" alignItems="center">
            <FormLabel
              id="gridLabel"
              htmlFor="gridField"
              whiteSpace="nowrap"
              fontSize={['md', 'lg']}
              color="gray.500"
            >
              Snap to Grid
            </FormLabel>
            <IconButton
              variant="outline"
              aria-label="Define using grid based values"
              size="sm"
              icon={useGrid ? 'lock' : 'unlock'}
              onClick={() => setUseGrid(!useGrid)}
              color={useGrid ? 'pink.400' : 'gray.500'}
              isRound
            />
          </Box>
        </Stack>

        <Slider
          id="gridSlider"
          aria-labelledby="gridLabel"
          value={gridStep}
          min={0}
          max={10}
          onChange={(newValue) => setGridStep(newValue)}
          opacity={!useGrid ? 0 : undefined}
          transition="opacity .2s ease-in"
        >
          <SliderTrack bg="pink.200" opacity={0.4} />
          <SliderFilledTrack bg="pink.400" />
          <SliderThumb
            size={6}
            borderColor="gray.200"
            aria-hidden={!useGrid}
            tabIndex={useGrid ? 0 : -1}
          />
        </Slider>

        <Input
          id="gridStepField"
          value={gridStep}
          type="number"
          name="gridStep"
          onChange={(ev: ChangeEvent<HTMLInputElement>) => {
            setGridStep(parseInt(ev.currentTarget.value, 10));
          }}
          borderRadius={12}
          _focus={{ boxShadow: 'outline', borderColor: 'transparent' }}
          w={[60, 60, 60, 80]}
          aria-hidden={!useGrid}
          tabIndex={useGrid ? 0 : -1}
          opacity={!useGrid ? 0 : undefined}
          transition="opacity .2s ease-in"
        />
      </Stack>

      <Stack isInline alignItems="center" spacing={5}>
        <Box>
          <FormLabel
            id="capHeightLabel"
            htmlFor="capHeightField"
            whiteSpace="nowrap"
            fontSize={['md', 'lg']}
            color="gray.500"
            w={[130, 150]}
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
          step={gridStep}
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
          <SliderTrack bg="pink.200" opacity={0.4} />
          <SliderFilledTrack bg="pink.400" />
          <SliderThumb size={6} borderColor="gray.200" />
        </Slider>

        <Input
          id="capHeightField"
          value={capHeight}
          type="number"
          name="capHeight"
          step={gridStep}
          onFocus={() => dispatch({ type: 'CAPHEIGHT_FOCUS' })}
          onBlur={() => dispatch({ type: 'CAPHEIGHT_BLUR' })}
          onChange={(ev: ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'UPDATE_CAPHEIGHT',
              capHeight: parseInt(ev.currentTarget.value, 10),
              leading,
            });
          }}
          borderRadius={12}
          _focus={{ boxShadow: 'outline', borderColor: 'transparent' }}
          w={[60, 60, 60, 80]}
        />
      </Stack>

      <Stack isInline alignItems="center" spacing={5}>
        <Stack isInline alignItems="center" spacing={1}>
          <Box w={[130, 150]}>
            <FormLabel
              id="leadingLabel"
              htmlFor="leadingField"
              whiteSpace="nowrap"
              fontSize={['md', 'lg']}
              color="gray.500"
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
              color={scaleLeading ? 'pink.400' : 'gray.500'}
              isRound
            />
          </Box>
        </Stack>
        <Slider
          id="leadingSlider"
          aria-labelledby="leadingLabel"
          value={leading}
          step={gridStep}
          min={capHeight}
          onFocus={() => dispatch({ type: 'LEADING_FOCUS' })}
          onBlur={() => dispatch({ type: 'LEADING_BLUR' })}
          onChange={(newValue) => {
            dispatch({
              type: 'UPDATE_LEADING',
              value: newValue,
            });
          }}
        >
          <SliderTrack bg="pink.200" opacity={0.4} />
          <SliderFilledTrack bg="pink.400" />
          <SliderThumb size={6} borderColor="gray.200" />
        </Slider>
        <Input
          id="leadingField"
          name="leading"
          value={leading}
          type="number"
          min={capHeight}
          onFocus={() => dispatch({ type: 'LEADING_FOCUS' })}
          onBlur={() => dispatch({ type: 'LEADING_BLUR' })}
          onChange={(ev: ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'UPDATE_LEADING',
              value: parseInt(ev.currentTarget.value, 10),
            });
          }}
          borderRadius={12}
          _focus={{ boxShadow: 'outline', borderColor: 'transparent' }}
          w={[60, 60, 60, 80]}
        />
      </Stack>
    </Stack>
  );
};

export default CapSizeSelector;
