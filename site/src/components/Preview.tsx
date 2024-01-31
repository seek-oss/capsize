import React, { useRef } from 'react';
import { Box, useTheme, Text } from '@chakra-ui/react';
import { getCapHeight, createStyleObject } from '@capsizecss/core';
import hexRgb from 'hex-rgb';

import { useAppState } from './AppStateContext';

const Preview = () => {
  const { state } = useAppState();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { colors } = useTheme();
  const { red, green, blue } = hexRgb(colors.pink['300']);
  const highlight = `rgba(${red}, ${green}, ${blue}, 0.15)`;

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
    capsizeStyles = createStyleObject({
      fontSize,
      ...(lineHeightStyle === 'leading' && { leading }),
      ...(lineHeightStyle === 'lineGap' && { lineGap }),
      fontMetrics: metrics,
    });
  } else if (textSizeStyle === 'capHeight') {
    capsizeStyles = createStyleObject({
      capHeight,
      ...(lineHeightStyle === 'leading' && { leading }),
      ...(lineHeightStyle === 'lineGap' && { lineGap }),
      fontMetrics: metrics,
    });
  }

  const resolvedCapHeightFromFontSize = getCapHeight({
    fontSize,
    fontMetrics: metrics,
  });
  const textRhythm =
    textSizeStyle === 'capHeight' ? capHeight : resolvedCapHeightFromFontSize;

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
              lineHeightNormal + resolvedCapHeightFromFontSize + lineGap
            }px)`,
            backgroundSize: `100% ${resolvedCapHeightFromFontSize + lineGap}px`,
            backgroundPosition: `0 calc((${
              (resolvedCapHeightFromFontSize + lineGap - lineHeightNormal) / 2
            }px) + ${capsizeStyles?.['::before'].marginBottom})`,
          }
        : {
            ...highlightGradient(
              lineHeightNormal,
              lineHeightNormal + (leading - lineHeightNormal),
            ),
            backgroundPosition: `0 calc((${
              (leading - lineHeightNormal) / 2
            }px) + ${capsizeStyles?.['::before'].marginBottom})`,
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
      maxWidth="1600px"
      margin="0 auto"
      w="100%"
      pos="relative"
      paddingX={[2, 4]}
    >
      <Box
        pos="relative"
        bg="gray.100"
        overflow="hidden"
        borderRadius={24}
        height={[440, 440, 660]}
        padding={[6, 6, 6, 10]}
      >
        <Box
          as="div"
          bg="white"
          color="gray.800"
          style={overlayStyles[focusedField!]}
          fontFamily={
            selectedFont.name.indexOf(' ') > -1
              ? `'${selectedFont.name}'`
              : selectedFont.name
          }
          sx={capsizeStyles}
          ref={containerRef}
        >
          Lorem ipsum Lolor sit amet, Lonsectetur adipiscing elit. Duis eu
          ornare nisi, sed feugiat metus. Pellentesque rutrum vel metus non
          dignissim. Aenean egestas neque mattis mi maximus luctus. Praesent et
          commodo dui, nec eleifend lectus. Pellentesque blandit nisi tellus, id
          efficitur urna consectetur id. Sed convallis tempor dui vel aliquet.
        </Box>
        <Box
          bg="gray.100"
          pos="absolute"
          bottom={0}
          left={0}
          right={0}
          height={[6, 6, 6, 10]}
        />
        <Box
          bg="gray.100"
          pos="absolute"
          bottom={0}
          top={0}
          right={0}
          width={[6, 6, 6, 10]}
        />
      </Box>
      {textSizeStyle === 'fontSize' && (
        <Text color="gray.500" textAlign="center" paddingTop={2}>
          Actual cap height: {resolvedCapHeightFromFontSize}px
        </Text>
      )}
    </Box>
  );
};

export default Preview;
