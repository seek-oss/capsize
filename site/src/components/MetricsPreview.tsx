import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/core';
import { useAppState } from './AppStateContext';

const Guide = ({ bottom, label }: { bottom: number; label: string }) => (
  <Box
    bg="orange.400"
    color="orange.400"
    style={{ position: 'absolute', left: 0, bottom: `${bottom}px`, height: 1 }}
    w="100%"
  >
    <Text>{label}</Text>
  </Box>
);

const MetricsPreview = () => {
  const { state } = useAppState();

  const { metrics } = state;
  return (
    <Box
      bg="white"
      color="black"
      rounded="lg"
      overflow="hidden"
      paddingX={20}
      style={{ position: 'relative' }}
    >
      <link
        href={`https://fonts.googleapis.com/css?family=${metrics.familyName}`}
        rel="stylesheet"
      />
      <Heading
        as="h3"
        size="2xl"
        style={{
          fontFamily: metrics.familyName,
          fontWeight: 'normal',
          fontSize: 200,
          lineHeight: 'normal',
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        {metrics.familyName}
      </Heading>
      <Guide
        label="Baseline"
        bottom={((metrics.descent * -1) / metrics.unitsPerEm) * 200}
      />
      <Guide
        label="Cap height"
        bottom={
          ((metrics.descent * -1 + metrics.capHeight) / metrics.unitsPerEm) *
          200
        }
      />
    </Box>
  );
};

export default MetricsPreview;
