import React, { ChangeEvent, useState, ReactNode, forwardRef } from 'react';
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
  Button,
  RadioButtonGroup,
  ControlBox,
  Icon,
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
  'aria-label'?: string;
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
  'aria-label': ariaLabel,
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
    <Stack isInline alignItems="center" spacing={8}>
      <Box d="flex" alignItems="center" flexShrink={0} w={[130, 150]} h={10}>
        <SettingLabel id={labelId} htmlFor={fieldId}>
          {label}
        </SettingLabel>
        {button}
      </Box>

      <Slider
        aria-labelledby={ariaLabel ? undefined : labelId}
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
          aria-label={ariaLabel}
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
        aria-label={ariaLabel}
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

const Mask = ({ hide, children }: { hide: boolean; children: ReactNode }) => (
  <Box
    pos="absolute"
    top={2}
    left={2}
    right={2}
    pointerEvents={hide ? 'none' : undefined}
    opacity={hide ? 0 : undefined}
    transform={hide ? 'translateY(-10px)' : undefined}
    transition={
      hide
        ? 'opacity .2s ease-in, transform .2s ease-in'
        : 'opacity .2s ease-in .2s,transform .2s ease-in .2s'
    }
  >
    {children}
  </Box>
);

interface CustomRadioProps {
  isChecked: boolean;
  value: string;
  onFocus: () => void;
  onBlur: () => void;
  children: ReactNode;
}

const CustomRadio = forwardRef<HTMLButtonElement, CustomRadioProps>(
  ({ isChecked, ...rest }, ref) => (
    <Button
      ref={ref}
      variantColor={isChecked ? 'pink' : 'gray'}
      aria-checked={isChecked}
      borderRadius={20}
      role="radio"
      {...rest}
    />
  ),
);

const CapSizeSelector = () => {
  const { state, dispatch } = useAppState();
  const [useGrid, setUseGrid] = useState(false);

  const {
    leading,
    capHeight,
    scaleLeading,
    lineGap,
    lineHeightStyle,
    gridStep,
  } = state;

  return (
    <Stack spacing={8}>
      <Box>
        <Setting
          name="grid"
          label="Snap to grid?"
          aria-label="Grid size"
          min={0}
          max={10}
          value={gridStep}
          onChange={(newStep) =>
            dispatch({ type: 'UPDATE_GRID_STEP', value: newStep })
          }
          onFocus={() => dispatch({ type: 'FIELD_FOCUS', value: 'grid' })}
          onBlur={() => dispatch({ type: 'FIELD_BLUR' })}
          active={useGrid}
          button={
            <Box pos="relative">
              <Box
                as="input"
                pos="absolute"
                // @ts-expect-error
                type="checkbox"
                aria-label="Snap to grid?"
                title="Snap to grid?"
                checked={useGrid}
                value={gridStep}
                height={6}
                width={6}
                opacity={0}
                zIndex={1}
                onChange={() => setUseGrid(!useGrid)}
              />
              <ControlBox
                borderWidth="1px"
                size={6}
                borderRadius={8}
                color="white"
                _checked={{
                  color: 'pink.400',
                }}
                _focus={{ borderColor: 'transparent', boxShadow: 'outline' }}
              >
                <Icon name="check" size="14px" />
              </ControlBox>
            </Box>
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
          onFocus={() => dispatch({ type: 'FIELD_FOCUS', value: 'capheight' })}
          onBlur={() => dispatch({ type: 'FIELD_BLUR' })}
        />
      </Box>

      <Box>
        <Stack isInline alignItems="center" spacing={5}>
          <Box w={[130, 150]} flexShrink={0}>
            <SettingLabel id="lineHeightType" htmlFor="lineHeightType">
              Line height style
            </SettingLabel>
          </Box>

          <Box w="100%">
            <RadioButtonGroup
              id="lineHeightType"
              value={lineHeightStyle}
              onChange={(style) =>
                dispatch({
                  type: 'UPDATE_LINEHEIGHT_STYLE',
                  value: style as typeof lineHeightStyle,
                })
              }
              isInline
            >
              <CustomRadio
                isChecked={lineHeightStyle === 'gap'}
                value="gap"
                onFocus={() =>
                  dispatch({ type: 'FIELD_FOCUS', value: 'linegap' })
                }
                onBlur={() => dispatch({ type: 'FIELD_BLUR' })}
              >
                Line Gap
              </CustomRadio>
              <CustomRadio
                isChecked={lineHeightStyle === 'leading'}
                value="leading"
                onFocus={() =>
                  dispatch({ type: 'FIELD_FOCUS', value: 'leading' })
                }
                onBlur={() => dispatch({ type: 'FIELD_BLUR' })}
              >
                Leading
              </CustomRadio>
            </RadioButtonGroup>
          </Box>
        </Stack>
      </Box>

      <Box pos="relative" h={16} margin={-2} overflow="hidden">
        <Mask hide={lineHeightStyle === 'gap'}>
          <Setting
            name="leading"
            label="Leading"
            gridStep={useGrid ? gridStep : undefined}
            min={capHeight}
            max={capHeight * 4}
            value={leading}
            onChange={(newValue) =>
              dispatch({
                type: 'UPDATE_LEADING',
                value: newValue,
              })
            }
            active={lineHeightStyle === 'leading'}
            onFocus={() => dispatch({ type: 'FIELD_FOCUS', value: 'leading' })}
            onBlur={() => dispatch({ type: 'FIELD_BLUR' })}
            button={
              <IconButton
                variant="outline"
                aria-label="Toggle maintaining scale to selected capHeight"
                title="Toggle maintaining scale to selected capHeight"
                size="sm"
                icon={scaleLeading ? 'lock' : 'unlock'}
                onFocus={() =>
                  dispatch({ type: 'FIELD_FOCUS', value: 'leading' })
                }
                onBlur={() => dispatch({ type: 'FIELD_BLUR' })}
                onClick={() => dispatch({ type: 'TOGGLE_LEADING_SCALE' })}
                color={scaleLeading ? 'pink.400' : 'gray.500'}
                isRound
                tabIndex={lineHeightStyle !== 'leading' ? -1 : 0}
                aria-hidden={lineHeightStyle !== 'leading'}
              />
            }
          />
        </Mask>

        <Mask hide={lineHeightStyle === 'leading'}>
          <Setting
            name="lineGap"
            label="Line Gap"
            gridStep={useGrid ? gridStep : undefined}
            max={capHeight * 4}
            value={lineGap}
            onChange={(newValue) =>
              dispatch({
                type: 'UPDATE_LINEGAP',
                value: newValue,
              })
            }
            active={lineHeightStyle === 'gap'}
            onFocus={() => dispatch({ type: 'FIELD_FOCUS', value: 'linegap' })}
            onBlur={() => dispatch({ type: 'FIELD_BLUR' })}
          />
        </Mask>
      </Box>
    </Stack>
  );
};

export default CapSizeSelector;
