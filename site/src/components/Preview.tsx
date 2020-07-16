/* @jsx jsx */
import { jsx } from '@emotion/core'; // eslint-disable-line
import React, { useRef } from 'react'; // eslint-disable-line
import { Box, useTheme } from '@chakra-ui/core';
import capsize from 'capsize';
import hexRgb from 'hex-rgb';

import { useAppState } from './AppStateContext';

const Preview = () => {
  const { state } = useAppState();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { colors } = useTheme();
  const { red, green, blue } = hexRgb(colors.pink['300']);
  const highlight = `rgba(${red}, ${green}, ${blue}, 0.2)`;

  const {
    leading,
    capHeight,
    metrics,
    focusedField,
    lineGap,
    lineHeightStyle,
    gridStep,
    selectedFont,
  } = state;

  const capsizeStyles = capsize({
    capHeight,
    leading: lineHeightStyle === 'leading' ? leading : undefined,
    gap: lineHeightStyle === 'gap' ? lineGap : undefined,
    fontMetrics: metrics,
  });

  const overlayStyles = {
    grid: {
      backgroundImage: `linear-gradient(180deg, ${highlight} ${gridStep}px, transparent ${gridStep}px, transparent ${
        gridStep * 2
      }px)`,
      backgroundSize: `100% ${gridStep * 2}px`,
    },
    capheight:
      lineHeightStyle === 'gap'
        ? {
            backgroundImage: `linear-gradient(180deg, ${highlight} ${capHeight}px, transparent ${capHeight}px, transparent ${
              capHeight + lineGap
            }px)`,
            backgroundSize: `100% ${capHeight + lineGap}px`,
          }
        : {
            backgroundImage: `linear-gradient(180deg, ${highlight} ${capHeight}px, transparent ${capHeight}px, transparent ${
              capHeight + (leading - capHeight)
            }px)`,
            backgroundSize: `100% ${capHeight + (leading - capHeight)}px`,
          },
    leading: {
      backgroundImage: `linear-gradient(180deg, transparent ${leading}px, ${highlight} ${leading}px, ${highlight} ${
        leading * 2
      }px)`,
      backgroundPosition: `0 -${leading - capHeight}px`,
      backgroundSize: `100% ${leading * 2}px`,
    },
    linegap: {
      backgroundImage: `linear-gradient(180deg, transparent ${capHeight}px, ${highlight} ${capHeight}px, ${highlight} ${
        capHeight + lineGap
      }px)`,
      backgroundSize: `100% ${capHeight + lineGap}px`,
    },
  };

  return (
    <Box
      color="black"
      overflow="auto"
      maxWidth="1600px"
      margin="0 auto"
      w="100%"
      maxHeight="30vh"
      pos="relative"
      paddingTop={6}
      paddingX={[2, 4, 6, 8, 10]}
    >
      <Box
        as="div"
        style={overlayStyles[focusedField!]}
        fontFamily={
          selectedFont.name.indexOf(' ') > -1
            ? `'${selectedFont.name}'`
            : selectedFont.name
        }
        css={capsizeStyles}
        ref={containerRef}
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
      </Box>
    </Box>
  );
};

export default Preview;
