import React from 'react';
import { Box, Text } from '@chakra-ui/core';
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
  const arrowSize = 4;

  const Guide = ({ location }: { location: 'top' | 'bottom' }) => (
    <Box
      pos="absolute"
      bg="orange.300"
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
      height={position}
      bottom={voffset}
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
        color="orange.400"
      >
        <Box h="100%" d="flex" flexDir="column" alignItems="center">
          <ArrowHead direction="up" />
          <Box h="100%" borderLeft={`${arrowSize / 2}px solid currentColor`} />
          <ArrowHead direction="down" />
        </Box>
        <Text
          w={labelWidth}
          fontWeight="bold"
          paddingX={1}
          fontSize="xs"
          color="currentColor"
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
  const { state } = useAppState();
  const { metrics } = state;
  const previewFontSize = 150;

  const absoluteDescent = Math.abs(metrics.descent);
  const baseline = (absoluteDescent / metrics.unitsPerEm) * previewFontSize;

  const lineHeight = metrics.ascent + absoluteDescent + metrics.lineGap;
  const lineHeightScale = lineHeight / metrics.unitsPerEm;
  const lineHeightNormal = lineHeightScale * previewFontSize;

  return (
    <Box
      bg="white"
      color="black"
      rounded="lg"
      overflow="hidden"
      paddingY={10}
      pos="relative"
    >
      <Box
        d="flex"
        justifyContent="center"
        alignItems="center"
        fontSize={previewFontSize}
        fontFamily={
          metrics.familyName.indexOf(' ') > -1
            ? `'${metrics.familyName}'`
            : metrics.familyName
        }
        lineHeight="normal"
        pos="relative"
      >
        <Box
          d="inline-flex"
          justifyContent="center"
          alignItems="center"
          pos="relative"
          bg="orange.100"
        >
          <Metric
            position="1em"
            hoffset={20}
            voffset={(lineHeightNormal - previewFontSize) / 2}
            label={`Em square (${metrics.unitsPerEm})`}
            align="right"
            guides="all"
          />

          <Metric
            position={
              (metrics.capHeight / metrics.unitsPerEm) * previewFontSize
            }
            hoffset={20}
            voffset={baseline}
            label={`Cap Height (${metrics.capHeight})`}
          />

          <Metric
            position={baseline}
            hoffset={80}
            label={`Baseline (${absoluteDescent})`}
          />

          <Metric
            position={(metrics.ascent / metrics.unitsPerEm) * previewFontSize}
            hoffset={80}
            voffset={baseline}
            label={`Ascent (${metrics.ascent})`}
            guides="none"
          />

          <Metric
            position="100%"
            hoffset={80}
            label="Line Height"
            guides="none"
            align="right"
          />

          <Box zIndex={1} color="blue.900">
            Gg
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MetricsPreview;
