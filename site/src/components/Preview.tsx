/* @jsx jsx */
import { jsx } from '@emotion/core'; // eslint-disable-line
import React, { useRef } from 'react'; // eslint-disable-line
import { Box, Text } from '@chakra-ui/core';
import capsize from 'capsize';

import { useAppState } from './AppStateContext';

const unfocusedOverlayLineSize = 2;

const Preview = () => {
  const { state } = useAppState();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { leading, capHeight, metrics, focusedField } = state;

  const capsizeStyles = capsize({
    capHeight,
    leading,
    fontMetrics: metrics,
  });

  const overlayStyles = {
    capheight: {
      backgroundImage: `linear-gradient(180deg, currentColor ${capHeight}px, transparent ${capHeight}px, transparent ${
        capHeight + (leading - capHeight)
      }px)`,
      backgroundSize: `100% ${capHeight + (leading - capHeight)}px`,
    },
    leading: {
      backgroundImage: `linear-gradient(180deg, transparent ${leading}px, currentColor ${leading}px, currentColor ${
        leading * 2
      }px)`,
      backgroundPosition: `0 -${leading - capHeight}px`,
      backgroundSize: `100% ${leading * 2}px`,
    },
    none: {
      backgroundImage: `linear-gradient(180deg, transparent ${capHeight}px, currentColor ${capHeight}px, currentColor ${
        capHeight + unfocusedOverlayLineSize
      }px, transparent ${
        capHeight + unfocusedOverlayLineSize
      }px, transparent ${leading}px)`,
      backgroundSize: `100% ${leading}px`,
    },
  };

  return (
    <Box
      bg="white"
      paddingY={10}
      maxWidth="1600px"
      w="100%"
      d="flex"
      margin="0 auto"
    >
      <Box
        color="black"
        overflow="auto"
        w="100%"
        maxHeight="30vh"
        pos="relative"
      >
        <Box
          pos="absolute"
          right={0}
          left={0}
          top={0}
          height={
            containerRef.current
              ? containerRef.current.clientHeight + unfocusedOverlayLineSize
              : '100%'
          }
          color={focusedField ? 'orange.400' : 'blue.200'}
          opacity={focusedField ? 0.2 : 0.5}
          pointerEvents="none"
          style={overlayStyles[focusedField ?? 'none']}
        />
        <Text
          as="div"
          paddingX={10}
          css={{
            fontFamily: metrics.familyName,
            fontWeight: 'normal',
            ...capsizeStyles,
          }}
          ref={containerRef}
          // contentEditable
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
      </Box>
    </Box>
  );
};

export default Preview;
