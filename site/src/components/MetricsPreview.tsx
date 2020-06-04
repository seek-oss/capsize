import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/core';
import { FontMetrics } from 'capsize';

interface Props {
  metrics: FontMetrics;
}

const Guide = ({ bottom, label }: { bottom: number; label: string }) => {
  return (
    <Box
      bg="orange.400"
      color="orange.400"
      style={{ position: 'absolute', bottom: `${bottom}px`, height: 1 }}
      w="100%"
    >
      <Text>{label}</Text>
    </Box>
  );
};

const MetricsPreview = ({ metrics }: Props) => (
  <Box
    bg="white"
    color="black"
    rounded="lg"
    overflow="hidden"
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
        ((metrics.descent * -1 + metrics.capHeight) / metrics.unitsPerEm) * 200
      }
    />
  </Box>
);

export default MetricsPreview;
