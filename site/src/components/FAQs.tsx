import React, { ReactNode } from 'react';
import { Stack, Box, Text, Link, Code } from '@chakra-ui/react';
import dedent from 'dedent';

import { useAppState } from '../components/AppStateContext';
import Heading from '../components/Heading';
import { precomputeValues } from '@capsizecss/core';

const css = dedent;

const Question = ({ q, children }: { q: ReactNode; children: ReactNode }) => (
  <Stack spacing={8}>
    <Box>
      <Heading size="3">{q}</Heading>
    </Box>
    <Box color="#66748A" fontSize="large">
      {children}
    </Box>
  </Stack>
);

const FAQs = () => {
  const { state } = useAppState();
  const {
    textSizeStyle,
    lineHeightStyle,
    capHeight,
    fontSize,
    leading,
    lineGap,
    metrics,
  } = state;

  let capsizeValues;

  if (textSizeStyle === 'fontSize') {
    capsizeValues = precomputeValues({
      fontSize,
      ...(lineHeightStyle === 'leading' && { leading }),
      ...(lineHeightStyle === 'lineGap' && { lineGap }),
      fontMetrics: metrics,
    });
  } else if (textSizeStyle === 'capHeight') {
    capsizeValues = precomputeValues({
      capHeight,
      ...(lineHeightStyle === 'leading' && { leading }),
      ...(lineHeightStyle === 'lineGap' && { lineGap }),
      fontMetrics: metrics,
    });
  }

  return (
    <Stack spacing={20} maxWidth="96ex">
      <Box>
        <Box
          role="group"
          as="a"
          display="inline-block"
          href="#faq"
          id="faq"
          padding={4}
          margin={-4}
          borderRadius={16}
          outline="none"
          _focus={{ boxShadow: 'outline' }}
        >
          <Heading size="2">
            FAQs
            <Box
              as="span"
              id="faq"
              marginLeft={4}
              opacity={0}
              transition="opacity .15s ease"
              _groupHover={{ opacity: 0.4 }}
            >
              #
            </Box>
          </Heading>
        </Box>
      </Box>

      <Box>
        <Question q="Why use pseudo elements instead of applying the negative margin directly?">
          <Text>
            The negative margins are applied to pseudo elements to guard against{' '}
            <Link
              textDecoration="underline"
              href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model/Mastering_margin_collapsing"
            >
              margin collapse
            </Link>
            . Combining the use of pseudo elements and padding on the parent
            container prevents the margins from being collapsed into the parent
            element. The collapsing is most visible when text is used directly
            inside a container that has a background colour applied.
          </Text>
        </Question>
      </Box>

      <Box>
        <Question q="What is the recommended way to handle metrics for fallback fonts?">
          <Stack spacing={4}>
            <Text>
              Until the trimming of leading and trailing white space around text
              is natively supported in CSS, supporting fallback fonts perfectly
              will have its trade-offs.
            </Text>
            <Text>
              Typically the font stack should not specify wildly different font
              families as fallbacks, and in practice that means the cap heights
              and descenders should have similar scales proportionate to their
              font. While not having a pixel-perfect match to the font, it
              should still perform the trim effectively enough.
            </Text>
            <Text>
              For web fonts that are more display focused, using a library such
              as{' '}
              <Link
                textDecoration="underline"
                href="https://github.com/typekit/webfontloader"
              >
                webfontloader
              </Link>{' '}
              would allow applying fallback metrics as a separate class.
            </Text>
          </Stack>
        </Question>
      </Box>

      <Box>
        <Question q="What is the recommended way to handle text overflow/truncation?">
          <Text>
            Applying standard text overflow techniques on the same element will
            result in descenders/ascenders getting cut off due to the overflow
            needing to be hidden, e.g.:
            <Code
              display="block"
              background="transparent"
              color="gray.600"
              padding={4}
              whiteSpace="pre"
            >
              {css`
                .truncate {
                  text-overflow: ellipsis;
                  overflow: hidden;
                  white-space: nowrap;
                }
              `}
            </Code>
            Ideally you should not be adding further layout-related styles to
            the element that is capsized to prevent styles possibly clashing
            with the trim. We handle this by applying the truncation styles to a
            block level span element, e.g.:
            <Code
              display="block"
              background="transparent"
              color="gray.600"
              padding={4}
              whiteSpace="pre"
            >
              {dedent`
                <p class="capsizedText">
                  <span class="truncate">
                    ...
                  </span>
                </p>
              `}
            </Code>
            If using a component system you can conditionally add the span only
            when using truncation.
          </Text>
        </Question>
      </Box>

      <Box>
        <Question q="What does this mean for diacritic and accent marks in non-Latin alphabets?">
          <Text>
            <Link
              textDecoration="underline"
              href="https://en.wikipedia.org/wiki/Diacritic#Diacritics_specific_to_non-Latin_alphabets"
              target="_blank"
            >
              Diacritics and accent marks
            </Link>{' '}
            can have an impact on the perceived cap height and baseline. Given
            the location of the marks being at the extremities of the fonts line
            box, it is necessary to increase the white space by increasing the{' '}
            <Code bg="gray.200" color="gray.700" fontSize="medium">
              line-height
            </Code>{' '}
            and container{' '}
            <Code bg="gray.200" color="gray.700" fontSize="medium">
              padding
            </Code>{' '}
            to accomodate. This is the case today even without using Capsize.
          </Text>
        </Question>
      </Box>

      <Box>
        <Question q="What can browser vendors do to make this easier?">
          <Stack spacing={4}>
            <Text>
              Going forward, it would be great if this power was built into the
              platform and able to be applied through standard CSS properties.
              The{' '}
              <Link
                textDecoration="underline"
                href="https://twitter.com/csswg"
                target="_blank"
              >
                CSS Working Group
              </Link>{' '}
              have a specification proposal to make this available natively in
              CSS (see{' '}
              <Link
                textDecoration="underline"
                href="https://github.com/w3c/csswg-drafts/issues/3240"
                target="_blank"
              >
                Leading control at start/end of block
              </Link>
              ).
            </Text>
            <Text>
              With this specification, the CSS required for trimming the line
              box would be:
              <Code
                display="block"
                background="transparent"
                color="gray.600"
                padding={4}
                whiteSpace="pre"
              >
                {css`
                  .capsizedText {
                    text-box-edge: cap alphabetic;
                    text-box-trim: both;
                  }
                `}
              </Code>
            </Text>
            <Text>
              Since Capsize was first built,{' '}
              <Link
                textDecoration="underline"
                href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Values_and_Units#LOCAL%20FONT-RELATIVE%20LENGTHS:~:text=Relative%20to-,cap,-Cap%20height%20(the"
                target="_blank"
              >
                <Code
                  textDecoration="underline"
                  bg="gray.200"
                  color="gray.700"
                  fontSize="medium"
                >
                  cap
                </Code>
              </Link>{' '}
              units are now available natively in CSS across all major browsers.
            </Text>
            <Text>
              Currently, there is no proposal for a way to define the{' '}
              <Code bg="gray.200" color="gray.700" fontSize="medium">
                line-height
              </Code>{' '}
              using the{' '}
              <Code bg="gray.200" color="gray.700" fontSize="medium">
                lineGap
              </Code>{' '}
              style mental model. With the rise of properties like{' '}
              <Link
                textDecoration="underline"
                href="https://developer.mozilla.org/en-US/docs/Web/CSS/gap"
                target="_blank"
              >
                <Code
                  textDecoration="underline"
                  bg="gray.200"
                  color="gray.700"
                  fontSize="medium"
                >
                  gap
                </Code>
              </Link>{' '}
              for CSS grid and flexbox, maybe this will feed into a future
              proposal.
            </Text>
          </Stack>
        </Question>
      </Box>
    </Stack>
  );
};

export default FAQs;
