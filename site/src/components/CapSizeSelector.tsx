import React, { ChangeEvent, useState, ReactNode } from 'react';
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

interface SettingLabelProps {
  id: string;
  htmlFor: string;
  children: ReactNode;
}
const SettingLabel = ({ id, htmlFor, children }: SettingLabelProps) => (
  <FormLabel
    id={id}
    htmlFor={htmlFor}
    whiteSpace="nowrap"
    fontSize={['md', 'lg']}
    color="gray.500"
  >
    {children}
  </FormLabel>
);

interface SettingProps {
  name: string;
  label: string;
  gridStep?: number;
  min?: number;
  max?: number;
  value: number;
  onChange: (value: number) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  button?: ReactNode;
  active?: boolean;
}

const Setting = ({
  name,
  label,
  gridStep = 1,
  min,
  max,
  value,
  onChange,
  onFocus,
  onBlur,
  button,
  active = true,
}: SettingProps) => {
  const fieldId = `${name}Field`;
  const labelId = `${name}Label`;

  return (
    <Stack isInline alignItems="center" spacing={5}>
      <Stack
        isInline
        alignItems="center"
        spacing={1}
        w={[130, 150]}
        h={10}
        flexShrink={0}
      >
        <Box>
          <SettingLabel id={labelId} htmlFor={fieldId}>
            {label}
          </SettingLabel>
        </Box>
        {button && <Box>{button}</Box>}
      </Stack>

      <Slider
        aria-labelledby={labelId}
        value={value}
        min={min}
        max={max}
        step={gridStep}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={onChange}
        opacity={!active ? 0 : undefined}
        transition="opacity .2s ease-in"
      >
        <SliderTrack bg="pink.200" opacity={0.4} />
        <SliderFilledTrack bg="pink.400" />
        <SliderThumb
          size={6}
          borderColor="gray.200"
          aria-hidden={!active}
          tabIndex={active ? 0 : -1}
        />
      </Slider>

      <Input
        id={fieldId}
        value={value}
        type="number"
        name={name}
        step={gridStep}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={(ev: ChangeEvent<HTMLInputElement>) => {
          onChange(parseInt(ev.currentTarget.value, 10));
        }}
        aria-hidden={!active}
        tabIndex={active ? 0 : -1}
        opacity={!active ? 0 : undefined}
        transition="opacity .2s ease-in"
        borderRadius={12}
        _focus={{ boxShadow: 'outline', borderColor: 'transparent' }}
        w={[60, 60, 60, 80]}
      />
    </Stack>
  );
};

const CapSizeSelector = () => {
  const { state, dispatch } = useAppState();
  const [gridStep, setGridStep] = useState(4);
  const [useGrid, setUseGrid] = useState(false);

  const { leading, capHeight, scaleLeading } = state;

  return (
    <Stack spacing={8}>
      <Box>
        <Setting
          name="grid"
          label="Snap to grid"
          min={0}
          max={10}
          value={gridStep}
          onChange={setGridStep}
          active={useGrid}
          button={
            <IconButton
              variant="outline"
              aria-label="Define size and spacing based on a grid"
              size="sm"
              icon={useGrid ? 'lock' : 'unlock'}
              onClick={() => setUseGrid(!useGrid)}
              color={useGrid ? 'pink.400' : 'gray.500'}
              isRound
            />
          }
        />
      </Box>

      <Box>
        <Setting
          name="capHeight"
          label="Cap Height"
          gridStep={useGrid ? gridStep : undefined}
          min={10}
          max={200}
          value={capHeight}
          onChange={(newValue) =>
            dispatch({
              type: 'UPDATE_CAPHEIGHT',
              capHeight: newValue,
              leading,
            })
          }
          onFocus={() => dispatch({ type: 'CAPHEIGHT_FOCUS' })}
          onBlur={() => dispatch({ type: 'CAPHEIGHT_BLUR' })}
        />
      </Box>

      <Box>
        <Setting
          name="leading"
          label="Leading"
          gridStep={useGrid ? gridStep : undefined}
          min={capHeight}
          value={leading}
          onChange={(newValue) =>
            dispatch({
              type: 'UPDATE_LEADING',
              value: newValue,
            })
          }
          onFocus={() => dispatch({ type: 'LEADING_FOCUS' })}
          onBlur={() => dispatch({ type: 'LEADING_BLUR' })}
          button={
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
          }
        />
      </Box>
    </Stack>
  );
};

export default CapSizeSelector;
