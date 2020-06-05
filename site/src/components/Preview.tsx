/* @jsx jsx */
import { jsx } from '@emotion/core'; // eslint-disable-line
import React from 'react'; // eslint-disable-line
import { Box, Text } from '@chakra-ui/core';
import capsize from 'capsize';

import { useAppState } from './AppStateContext';

const Preview = () => {
  const { state } = useAppState();

  const { leading, capHeight, metrics } = state;

  const capsizeStyles = capsize({
    capHeight,
    leading,
    fontMetrics: metrics,
  });

  return (
    <Box
      bg="white"
      color="black"
      overflow="hidden"
      paddingX={5}
      pos="relative"
      w="100%"
      minHeight="10vh"
      maxHeight="30vh"
    >
      <link
        href={`https://fonts.googleapis.com/css?family=${metrics.familyName
          .split(' ')
          .join('+')}`}
        rel="stylesheet"
      />
      <Text
        as="div"
        css={{
          fontFamily: metrics.familyName,
          fontWeight: 'normal',
          ...capsizeStyles,
        }}
        // contentEditable
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eu ornare
        nisi, sed feugiat metus. Pellentesque rutrum vel metus non dignissim.
        Aenean egestas neque mattis mi maximus luctus. Praesent et commodo dui,
        nec eleifend lectus. Pellentesque blandit nisi tellus, id efficitur urna
        consectetur id. Sed convallis tempor dui vel aliquet. Morbi magna nulla,
        vulputate efficitur eros in, maximus dictum velit. Curabitur vitae risus
        nec ante aliquet dictum sed semper tellus. Donec sit amet velit sed urna
        facilisis tincidunt. Maecenas rhoncus sagittis mi, vel vestibulum leo.
        Pellentesque habitant morbi tristique senectus et netus et malesuada
        fames ac turpis egestas.
      </Text>

      {/* {focusedField && (
        <Box
          pos="absolute"
          right={0}
          left={0}
          top={0}
          height="100%"
          color="orange.400"
          opacity={0.2}
          pointerEvents="none"
          zIndex={1}
          style={{
            backgroundPosition: '0 0',
            backgroundImage: isCapHeightFocused
              ? `repeating-linear-gradient( 
            0deg,
            currentColor 0
            currentColor ${capHeight}px,
            transparent ${capHeight}px,
            transparent ${leading}px)`
              : `repeating-linear-gradient( 
            0deg,
            currentColor 0,
            currentColor ${leading}px,
            transparent ${leading}px,
            transparent ${leading * 2}px)`,
          }}
        />
      )} */}
    </Box>
  );
};

export default Preview;
