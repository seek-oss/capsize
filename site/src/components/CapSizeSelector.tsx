/* @jsx jsx */
import { jsx } from '@emotion/core'; // eslint-disable-line
import React, { useState, useEffect } from 'react';
import { Box, Input, FormLabel, Stack, Text } from '@chakra-ui/core';
import { FontMetrics } from 'capsize/metrics';
import capsize from 'capsize';

interface Props {
  metrics: FontMetrics;
  onSelect: (styles: any) => void;
}

const defaultCapSize = 24;

const calculateNormalLineHeight = ({ capHeight, metrics }) => {
  const contentArea = metrics.ascent + Math.abs(metrics.descent);
  const lineHeight = contentArea + metrics.lineGap;
  const lineHeightScale = lineHeight / metrics.unitsPerEm;

  return lineHeightScale * capHeight;
};

const CapSizeSelector = ({ metrics, onSelect }: Props) => {
  const [capHeight, setCapHeight] = useState(defaultCapSize);
  const [leading, setLeading] = useState<number | undefined>();
  const capSizeStyles = capsize({ leading, capHeight, fontMetrics: metrics });

  useEffect(() => {
    if (leading && capHeight) {
      // console.log('HERE');
      // onSelect(capSizeStyles);
    }
  }, [leading, capHeight, onSelect, capSizeStyles]);

  useEffect(() => {
    setLeading(calculateNormalLineHeight({ capHeight, metrics }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metrics]);

  return (
    <Stack spacing={4} align="center">
      <Stack isInline spacing={2}>
        <Box>
          <FormLabel htmlFor="capHeight">Cap Height</FormLabel>
          <Input
            id="capHeight"
            type="number"
            value={capHeight}
            onChange={ev => setCapHeight(ev.currentTarget.value)}
          />
        </Box>
        <Box>
          <FormLabel htmlFor="leading">Leading</FormLabel>
          <Input
            id="leading"
            type="number"
            value={leading}
            onChange={ev => setLeading(ev.currentTarget.value)}
          />
        </Box>
      </Stack>

      <Box
        bg="white"
        color="black"
        overflow="hidden"
        paddingX={5}
        pos="relative"
        w="100%"
      >
        <link
          href={`https://fonts.googleapis.com/css?family=${metrics.familyName}`}
          rel="stylesheet"
        />
        <Text
          as="div"
          css={{
            fontFamily: metrics.familyName,
            fontWeight: 'normal',
            ...capSizeStyles,
          }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eu
          ornare nisi, sed feugiat metus. Pellentesque rutrum vel metus non
          dignissim. Aenean egestas neque mattis mi maximus luctus. Praesent et
          commodo dui, nec eleifend lectus. Pellentesque blandit nisi tellus, id
          efficitur urna consectetur id. Sed convallis tempor dui vel aliquet.
          Morbi magna nulla, vulputate efficitur eros in, maximus dictum velit.
          Curabitur vitae risus nec ante aliquet dictum sed semper tellus. Donec
          sit amet velit sed urna facilisis tincidunt. Maecenas rhoncus sagittis
          mi, vel vestibulum leo. Pellentesque habitant morbi tristique senectus
          et netus et malesuada fames ac turpis egestas.
        </Text>
        {/* <Guide
          label="Baseline"
          bottom={((metrics.descent * -1) / metrics.unitsPerEm) * 200}
        />
        <Guide
          label="Cap height"
          bottom={
            ((metrics.descent * -1 + metrics.capHeight) / metrics.unitsPerEm) *
            200
          }
        /> */}
        <Box
          pos="absolute"
          right={0}
          left={0}
          height="100%"
          style={{
            top: `${capHeight}px`,
            backgroundImage:
              'linear-gradient(rgba(0, 0, 0, 0.15) 50%, rgba(0, 0, 0, 0) 15%, rgba(0, 0, 0, 0) 100%)',
            zIndex: 1,
            pointerEvents: 'none',
            backgroundSize: `100% ${leading}px`,
          }}
        />
      </Box>
    </Stack>
  );
};

export default CapSizeSelector;
