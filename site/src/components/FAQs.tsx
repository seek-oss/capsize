import React, { ReactNode } from 'react';
import {
  Stack,
  Box,
  Text,
  Link,
  Code,
  List,
  ListItem,
  PseudoBox,
} from '@chakra-ui/core';

import { useAppState } from '../components/AppStateContext';
import Heading from '../components/Heading';
import capsize from 'capsize';

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
  const displaySize =
    textSizeStyle === 'capHeight'
      ? capHeight
      : Math.round(fontSize * (metrics.capHeight / metrics.unitsPerEm));

  let capsizeStyles;

  if (textSizeStyle === 'fontSize') {
    capsizeStyles = capsize({
      fontSize,
      ...(lineHeightStyle === 'leading' && { leading }),
      ...(lineHeightStyle === 'lineGap' && { lineGap }),
      fontMetrics: metrics,
    });
  } else if (textSizeStyle === 'capHeight') {
    capsizeStyles = capsize({
      capHeight,
      ...(lineHeightStyle === 'leading' && { leading }),
      ...(lineHeightStyle === 'lineGap' && { lineGap }),
      fontMetrics: metrics,
    });
  }

  return (
    <Stack spacing={20} maxWidth="96ex">
      <Box>
        <PseudoBox
          role="group"
          as="a"
          d="inline-block"
          // @ts-expect-error
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
            <PseudoBox
              as="span"
              id="faq"
              marginLeft={4}
              opacity={0}
              transition="opacity .15s ease"
              _groupHover={{ opacity: 0.4 }}
            >
              #
            </PseudoBox>
          </Heading>
        </PseudoBox>
      </Box>

      <Box>
        <Question q="Why use pseudo elements instead of applying the negative margin directly?">
          <Text>
            The negative margins are applied to psuedo elements to guard against{' '}
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
              font.
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
            >
              {`.truncate {`}
              <br />
              &nbsp;&nbsp;{`text-oveflow: ellipsis;`}
              <br />
              &nbsp;&nbsp;{`overflow: hidden;`}
              <br />
              &nbsp;&nbsp;{`white-space: nowrap;`}
              <br />
              {`}`}
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
            >
              {`<p class="capsizedText">`}
              <br />
              &nbsp;&nbsp;{`<span class="truncate">`}
              <br />
              &nbsp;&nbsp;{`...`}
              <br />
              &nbsp;&nbsp;{`</span>`}
              <br />
              {`</p>`}
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
            >
              Diacritics and accent marks
            </Link>{' '}
            can have an impact on the perceived cap height and baseline. Given
            the location of the marks being at the extremities of the fonts line
            box, it is necessary to increase the white space by increasing the
            line-height and container padding to accomodate.
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
              <Link textDecoration="underline" href="https://twitter.com/csswg">
                CSS Working Group
              </Link>{' '}
              have a number proposals/specifications that would simplify this
              significantly.
            </Text>
            <Text as="span">
              Relevant specifications include:
              <List styleType="disc">
                <ListItem>
                  <Link
                    textDecoration="underline"
                    href="https://github.com/w3c/csswg-drafts/issues/3240"
                  >
                    Leading control at start/end of block
                  </Link>
                </ListItem>
                <ListItem>
                  <Link
                    textDecoration="underline"
                    href="https://www.w3.org/TR/css-values-4/#cap"
                  >
                    Font relative unit `cap`
                  </Link>
                </ListItem>
              </List>
            </Text>
            <Text>
              These specifications would turn the CSS generated by `capsize`
              into:
              <Code
                display="block"
                background="transparent"
                color="gray.600"
                padding={4}
              >
                {`.capsizedText {`}
                <br />
                &nbsp;&nbsp;{`font-size: ${displaySize}cap;`}
                <br />
                &nbsp;&nbsp;
                {`line-height: ${
                  capsizeStyles && 'lineHeight' in capsizeStyles
                    ? Math.round(
                        parseInt(
                          capsizeStyles.lineHeight.replace('px', ''),
                          10,
                        ),
                      )
                    : '78'
                }px;`}
                <br />
                &nbsp;&nbsp;{`leading-trim: cap ideographic;`}
                <br />
                {`}`}
              </Code>
            </Text>
            <Text>
              Currently, there is no proposal for a way to define the
              line-height using the `lineGap` style mental model. With the rise
              of properties like{' '}
              <Link
                textDecoration="underline"
                href="https://developer.mozilla.org/en-US/docs/Web/CSS/gap"
              >
                `gap`
              </Link>{' '}
              for CSS grid (and soon{' '}
              <Link
                textDecoration="underline"
                href="https://css-tricks.com/chromium-lands-flexbox-gap/"
              >
                flexbox
              </Link>
              ?) maybe this will feed into a future proposal.
            </Text>
          </Stack>
        </Question>
      </Box>
    </Stack>
  );
};

export default FAQs;
