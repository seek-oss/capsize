import React, { ChangeEvent, ReactNode } from 'react';
import {
  Box,
  FormLabel,
  Stack,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Input,
  ControlBox,
  Select,
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';

import { useAppState } from './AppStateContext';
import { px } from '../utils';

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
    marginBottom={1}
  >
    {children}
  </FormLabel>
);

interface SettingProps {
  name: string;
  label: string;
  showLabel?: boolean;
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
  showLabel = true,
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
    <Stack direction="row" alignItems="center" spacing={[6, 8]}>
      {showLabel ? (
        <Box
          display="flex"
          alignItems="center"
          flexShrink={0}
          w={px([124, 160, 144])}
        >
          <SettingLabel id={labelId} htmlFor={fieldId}>
            {label}
          </SettingLabel>
          {button}
        </Box>
      ) : null}

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
        pointerEvents={!active ? 'none' : undefined}
      >
        <SliderTrack bg="pink.100">
          <SliderFilledTrack bg="pink.400" />
        </SliderTrack>
        <SliderThumb
          boxSize={6}
          borderColor="gray.200"
          aria-hidden={!active}
          tabIndex={active ? 0 : -1}
          aria-label={ariaLabel}
          _focus={{ boxShadow: 'outline', borderColor: 'transparent' }}
        />
      </Slider>

      <Box flexShrink={0} w={px([60, 60, 60, 80])}>
        <Input
          id={fieldId}
          value={value}
          type="number"
          name={name}
          min={min}
          max={max}
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
          pointerEvents={!active ? 'none' : undefined}
          borderRadius={12}
          _focus={{ boxShadow: 'outline', borderColor: 'transparent' }}
        />
      </Box>
    </Stack>
  );
};

const CapSizeSelector = () => {
  const { state, dispatch } = useAppState();

  const {
    leading: leadingState,
    capHeight,
    fontSize,
    lineGap: lineGapState,
    lineHeightStyle,
    textSizeStyle,
    gridStep,
    snapToGrid,
  } = state;

  const leading = Math.round(leadingState);
  const lineGap = Math.round(lineGapState);
  const isUsingCapHeight = textSizeStyle === 'capHeight';
  const isUsingGap = lineHeightStyle === 'lineGap';

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
          active={snapToGrid}
          button={
            <Box pos="relative">
              <Box
                as="input"
                pos="absolute"
                type="checkbox"
                aria-label="Snap to grid?"
                title="Snap to grid?"
                checked={snapToGrid}
                value={gridStep}
                height={6}
                width={6}
                opacity={0}
                zIndex={1}
                onChange={() => dispatch({ type: 'TOGGLE_SNAP_TO_GRID' })}
              />
              <ControlBox
                borderWidth="1px"
                boxSize={6}
                borderRadius={8}
                color="white"
                _checked={{
                  color: 'pink.400',
                }}
                _focus={{ borderColor: 'transparent', boxShadow: 'outline' }}
              >
                <CheckIcon boxSize="14px" />
              </ControlBox>
            </Box>
          }
        />
      </Box>

      <Box display="flex" alignItems="center">
        <Box w={px([116, 160, 144])} marginRight={8}>
          <Select
            aria-label="Select how to size your text"
            variant="unstyled"
            fontSize={['md', 'lg']}
            fontWeight="medium"
            w={isUsingCapHeight ? px([124, 140, 130]) : px([104, 120, 114])}
            borderRadius={6}
            color="gray.500"
            _focus={{
              ring: 3,
              ringOffset: '8px',
            }}
            value={textSizeStyle}
            onChange={(ev) =>
              dispatch({
                type: 'UPDATE_TEXTSIZE_STYLE',
                value: ev.currentTarget.value as typeof textSizeStyle,
              })
            }
            onFocus={() =>
              dispatch({ type: 'FIELD_FOCUS', value: textSizeStyle })
            }
            onBlur={() => dispatch({ type: 'FIELD_BLUR' })}
          >
            <option value="capHeight">Cap Height</option>
            <option value="fontSize">Font Size</option>
          </Select>
        </Box>

        <Box flexGrow={1}>
          <Setting
            name={textSizeStyle}
            label={isUsingCapHeight ? 'Cap Height' : 'Font Size'}
            aria-label={isUsingCapHeight ? 'Cap Height' : 'Font Size'}
            showLabel={false}
            gridStep={snapToGrid ? gridStep : undefined}
            min={10}
            max={200}
            value={isUsingCapHeight ? capHeight : fontSize}
            onChange={(newValue) =>
              dispatch(
                isUsingCapHeight
                  ? {
                      type: 'UPDATE_CAPHEIGHT',
                      capHeight: newValue,
                      leading,
                    }
                  : {
                      type: 'UPDATE_FONTSIZE',
                      value: newValue,
                    },
              )
            }
            onFocus={() =>
              dispatch({ type: 'FIELD_FOCUS', value: textSizeStyle })
            }
            onBlur={() => dispatch({ type: 'FIELD_BLUR' })}
          />
        </Box>
      </Box>

      <Box display="flex" alignItems="center">
        <Box w={px([116, 160, 144])} marginRight={8}>
          <Select
            aria-label="Select how to apply your line height"
            variant="unstyled"
            fontSize={['md', 'lg']}
            fontWeight="medium"
            w={isUsingGap ? px([104, 120, 128]) : px([100, 110, 118])}
            borderRadius={6}
            color="gray.500"
            _focus={{
              ring: 3,
              ringOffset: '8px',
            }}
            value={lineHeightStyle}
            onChange={(ev) =>
              dispatch({
                type: 'UPDATE_LINEHEIGHT_STYLE',
                value: ev.currentTarget.value as typeof lineHeightStyle,
              })
            }
            onFocus={() =>
              dispatch({ type: 'FIELD_FOCUS', value: lineHeightStyle })
            }
            onBlur={() => dispatch({ type: 'FIELD_BLUR' })}
          >
            <option value="lineGap">Line Gap</option>
            <option value="leading">Leading</option>
          </Select>
        </Box>

        <Box flexGrow={1}>
          <Setting
            name={lineHeightStyle}
            label={isUsingGap ? 'Line Gap' : 'Leading'}
            aria-label={isUsingGap ? 'Line Gap' : 'Leading'}
            showLabel={false}
            gridStep={snapToGrid ? gridStep : undefined}
            // eslint-disable-next-line no-nested-ternary
            min={isUsingGap ? 0 : isUsingCapHeight ? capHeight : fontSize}
            max={200}
            value={isUsingGap ? lineGap : leading}
            onChange={(newValue) =>
              dispatch({
                type: isUsingGap ? 'UPDATE_LINEGAP' : 'UPDATE_LEADING',
                value: newValue,
              })
            }
            onFocus={() =>
              dispatch({ type: 'FIELD_FOCUS', value: lineHeightStyle })
            }
            onBlur={() => dispatch({ type: 'FIELD_BLUR' })}
          />
        </Box>
      </Box>
    </Stack>
  );
};

export default CapSizeSelector;
