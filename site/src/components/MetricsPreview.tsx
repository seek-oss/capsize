import React, { ChangeEvent, useState, useEffect } from 'react';
import { Box, Text, Input, FormLabel, IconButton } from '@chakra-ui/core';
import { useAppState } from './AppStateContext';

const Metric = ({
  voffset = 0,
  hoffset = 0,
  position,
  label,
  guides = 'top',
  align = 'left',
}: {
  position: number | string;
  label: string;
  voffset?: number;
  hoffset?: number;
  guides?: 'top' | 'all' | 'none';
  align?: 'left' | 'right';
}) => {
  const labelWidth = 50;
  const arrowSize = 6;

  const Guide = ({ location }: { location: 'top' | 'bottom' }) => (
    <Box
      pos="absolute"
      bg="pink.500"
      opacity={0.6}
      left={`${align === 'left' ? 0 : labelWidth - hoffset}px`}
      right={`${align === 'right' ? 0 : labelWidth - hoffset}px`}
      bottom={location === 'top' ? position : 0}
      height="1px"
    />
  );

  const ArrowHead = ({ direction }: { direction: 'up' | 'down' }) => (
    <Box
      width="0"
      height="0"
      borderBottom={
        direction === 'up' ? `${arrowSize * 2}px solid currentColor` : undefined
      }
      borderTop={
        direction === 'down'
          ? `${arrowSize * 2}px solid currentColor`
          : undefined
      }
      borderLeft={`${arrowSize}px solid transparent`}
      borderRight={`${arrowSize}px solid transparent`}
    />
  );

  return (
    <Box
      pos="absolute"
      left={`${align === 'left' ? 0 : -labelWidth}px`}
      right={`${align === 'right' ? 0 : -labelWidth}px`}
      height={`${position}px`}
      bottom={`${voffset}px`}
      d="flex"
      alignItems="center"
    >
      {guides !== 'none' && <Guide location="top" />}

      <Box
        pos="absolute"
        top={0}
        left={`${align === 'right' ? -hoffset : undefined}px`}
        right={`${align === 'left' ? -hoffset : undefined}px`}
        h="100%"
        d="flex"
        alignItems="center"
        flexDir={align === 'right' ? 'row-reverse' : undefined}
      >
        <Box
          color="gray.300"
          h="100%"
          d="flex"
          flexDir="column"
          alignItems="center"
        >
          <ArrowHead direction="up" />
          <Box h="100%" borderLeft={`${arrowSize / 2}px solid currentColor`} />
          <ArrowHead direction="down" />
        </Box>
        <Text
          w={labelWidth}
          fontWeight="bold"
          paddingX={1}
          fontSize="xs"
          color="gray.500"
          textAlign={align}
        >
          {label}
        </Text>
      </Box>

      {guides === 'all' && <Guide location="bottom" />}
    </Box>
  );
};

const MetricsPreview = () => {
  const { dispatch, state } = useAppState();

  const { metrics, selectedFont } = state;
  const [customMetrics, setCustomMetrics] = useState(metrics);
  const [editMetrics, setEditMetrics] = useState(false);

  useEffect(() => {
    dispatch({ type: 'UPDATE_METRICS', metrics: customMetrics });
  }, [customMetrics, dispatch]);

  useEffect(() => {
    setCustomMetrics(metrics);
    setEditMetrics(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFont]);

  const previewFontSize = 150;

  const absoluteDescent = Math.abs(metrics.descent);
  const decent = (absoluteDescent / metrics.unitsPerEm) * previewFontSize;
  const lineGap = (metrics.lineGap / metrics.unitsPerEm) * previewFontSize;
  const capHeight = (metrics.capHeight / metrics.unitsPerEm) * previewFontSize;
  const ascent = (metrics.ascent / metrics.unitsPerEm) * previewFontSize;

  const lineHeight = metrics.ascent + absoluteDescent + metrics.lineGap;
  const lineHeightScale = lineHeight / metrics.unitsPerEm;
  const lineHeightNormal = lineHeightScale * previewFontSize;

  return (
    <Box
      d="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      pos="relative"
      paddingBottom={!editMetrics ? [16, 16, 0] : undefined}
    >
      {!editMetrics && (
        <IconButton
          icon="edit"
          aria-label="Customise font metrics"
          title="Customise font metrics"
          variant="outline"
          borderRadius={20}
          _hover={{ color: 'pink.500', background: 'transparent' }}
          _focus={{ boxShadow: 'outline', borderColor: 'transparent' }}
          _active={{ transform: 'scale(.9)' }}
          onClick={() => setEditMetrics(true)}
          color="gray.600"
          pos="absolute"
          bottom={0}
          right={0}
        />
      )}
      <Box
        fontSize={previewFontSize}
        fontFamily={
          selectedFont.name.indexOf(' ') > -1
            ? `'${selectedFont.name}'`
            : selectedFont.name
        }
        lineHeight="normal"
        pos="relative"
        overflow="auto"
        paddingLeft="130px" // cater for arrow offsets
        paddingRight="150px" // cater for arrow offsets
      >
        <Box d="inline-flex" justifyContent="center" pos="relative">
          <Box
            pos="absolute"
            top={0}
            bottom={0}
            right={0}
            left={0}
            bg="pink.200"
            opacity={0.3}
          />
          <Metric
            position={previewFontSize}
            hoffset={20}
            voffset={(lineHeightNormal - previewFontSize) / 2}
            label={`Em square (${metrics.unitsPerEm})`}
            align="right"
            guides="all"
          />

          <Metric
            position={capHeight}
            hoffset={20}
            voffset={decent + lineGap / 2}
            label={`Cap Height (${metrics.capHeight})`}
          />

          <Metric
            position={decent}
            hoffset={80}
            voffset={lineGap / 2}
            label={`Descender (${absoluteDescent})`}
          />

          <Metric
            position={ascent}
            hoffset={80}
            voffset={decent + lineGap / 2}
            label={`Ascender (${metrics.ascent})`}
            guides="none"
          />

          <Metric
            position={lineHeightNormal}
            hoffset={80}
            label="Line Height"
            guides="none"
            align="right"
          />

          <Box zIndex={1} color="blue.800">
            Hg
          </Box>
        </Box>
      </Box>
      {editMetrics && (
        <Box
          paddingTop={8}
          paddingRight={4}
          d="flex"
          flexDirection={['column', 'column', 'row']}
        >
          <Box
            d="flex"
            alignItems="center"
            paddingBottom={[2, 2, 0]}
            paddingX={[0, 6]}
          >
            <FormLabel
              htmlFor="customAscent"
              whiteSpace="nowrap"
              fontSize={['md', 'lg']}
              color="gray.500"
              flexGrow={1}
            >
              Ascender
            </FormLabel>
            <Input
              id="customAscent"
              value={customMetrics.ascent}
              autoFocus
              type="number"
              onChange={(ev: ChangeEvent<HTMLInputElement>) => {
                setCustomMetrics({
                  ...customMetrics,
                  ascent: parseInt(ev.currentTarget.value, 10),
                });
              }}
              borderRadius={12}
              _focus={{ boxShadow: 'outline', borderColor: 'transparent' }}
              w={80}
            />
          </Box>
          <Box
            d="flex"
            alignItems="center"
            paddingBottom={[2, 2, 0]}
            paddingX={[0, 6]}
          >
            <FormLabel
              htmlFor="customCapHeight"
              whiteSpace="nowrap"
              fontSize={['md', 'lg']}
              color="gray.500"
              flexGrow={1}
            >
              Cap Height
            </FormLabel>
            <Input
              id="customCapHeight"
              value={customMetrics.capHeight}
              type="number"
              onChange={(ev: ChangeEvent<HTMLInputElement>) => {
                setCustomMetrics({
                  ...customMetrics,
                  capHeight: parseInt(ev.currentTarget.value, 10),
                });
              }}
              borderRadius={12}
              _focus={{ boxShadow: 'outline', borderColor: 'transparent' }}
              w={80}
            />
          </Box>
          <Box
            d="flex"
            alignItems="center"
            paddingBottom={[2, 2, 0]}
            paddingX={[0, 6]}
          >
            <FormLabel
              htmlFor="customDescent"
              whiteSpace="nowrap"
              fontSize={['md', 'lg']}
              color="gray.500"
              flexGrow={1}
            >
              Descender
            </FormLabel>
            <Input
              id="customDescent"
              value={customMetrics.descent}
              type="number"
              onChange={(ev: ChangeEvent<HTMLInputElement>) => {
                setCustomMetrics({
                  ...customMetrics,
                  descent: parseInt(ev.currentTarget.value, 10),
                });
              }}
              borderRadius={12}
              _focus={{ boxShadow: 'outline', borderColor: 'transparent' }}
              w={80}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default MetricsPreview;
