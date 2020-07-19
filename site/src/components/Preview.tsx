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
    fontSize,
    metrics,
    focusedField,
    lineGap,
    lineHeightStyle,
    textSizeStyle,
    gridStep,
    selectedFont,
  } = state;

  let capsizeStyles;

  if (textSizeStyle === 'fontSize') {
    capsizeStyles = capsize({
      fontSize,
      ...(lineHeightStyle === 'leading' && { leading }),
      ...(lineHeightStyle === 'lineGap' && { gap: lineGap }),
      fontMetrics: metrics,
    });
  } else if (textSizeStyle === 'capHeight') {
    capsizeStyles = capsize({
      capHeight,
      ...(lineHeightStyle === 'leading' && { leading }),
      ...(lineHeightStyle === 'lineGap' && { gap: lineGap }),
      fontMetrics: metrics,
    });
  }

  const actualFontSize = fontSize * (metrics.capHeight / metrics.unitsPerEm);
  const textRhythm = textSizeStyle === 'capHeight' ? capHeight : actualFontSize;

  const absoluteDescent = Math.abs(metrics.descent);
  const contentArea = metrics.ascent + metrics.lineGap + absoluteDescent;
  const lineHeightScale = contentArea / metrics.unitsPerEm;
  const lineHeightNormal = lineHeightScale * fontSize;

  const highlightGradient = (
    step1: number,
    step2: number,
    firstColour?: string,
    secondColour?: string,
  ) => ({
    backgroundImage: `linear-gradient(180deg, ${
      firstColour || highlight
    } ${step1}px, ${secondColour || 'transparent'} ${step1}px, ${
      secondColour || 'transparent'
    } ${step2}px)`,
    backgroundSize: `100% ${step2}px`,
    // backgroundImage: `repeating-linear-gradient(0deg, ${first || highlight}, ${
    //   first || highlight
    // } ${on}px, ${second || 'transparent'} ${on}px, ${
    //   second || 'transparent'
    // } ${off}px)`,
  });

  const overlayStyles = {
    grid: highlightGradient(gridStep, gridStep * 2),
    capHeight: highlightGradient(
      capHeight,
      capHeight +
        (lineHeightStyle === 'lineGap' ? lineGap : leading - capHeight),
    ),
    fontSize:
      lineHeightStyle === 'lineGap'
        ? {
            backgroundImage: `linear-gradient(180deg, ${highlight} ${lineHeightNormal}px, transparent ${lineHeightNormal}px, transparent ${
              lineHeightNormal + actualFontSize + lineGap
            }px)`,
            backgroundSize: `100% ${actualFontSize + lineGap}px`,
            backgroundPosition: `0 calc((${
              (actualFontSize + lineGap - lineHeightNormal) / 2
            }px) + ${capsizeStyles?.[':before'].marginTop})`,
          }
        : {
            ...highlightGradient(
              lineHeightNormal,
              lineHeightNormal + (leading - lineHeightNormal),
            ),
            backgroundPosition: `0 calc((${
              (leading - lineHeightNormal) / 2
            }px) + ${capsizeStyles?.[':before'].marginTop})`,
          },
    leading: {
      backgroundImage: `linear-gradient(180deg, transparent ${leading}px, ${highlight} ${leading}px, ${highlight} ${
        leading * 2
      }px)`,
      backgroundPosition: `0 -${leading - textRhythm}px`,
      backgroundSize: `100% ${leading * 2}px`,
    },
    lineGap: highlightGradient(
      textRhythm,
      textRhythm + lineGap,
      'transparent',
      highlight,
    ),
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
        Lorem ipsum Lolor sit amet, Lonsectetur adipiscing elit. Duis eu ornare
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
