import { style, createGlobalTheme } from '@vanilla-extract/css';
import { createTextStyle, computeValues } from '../src';

const fontMetrics = {
  capHeight: 748,
  ascent: 1000,
  descent: -250,
  lineGap: 0,
  unitsPerEm: 1000,
};
const textValues = {
  mobile: {
    fontSize: 60,
    leading: 80,
    fontMetrics,
  },
  tablet: {
    fontSize: 80,
    leading: 100,
    fontMetrics,
  },
  desktop: {
    fontSize: 100,
    leading: 120,
    fontMetrics,
  },
};

const vars = createGlobalTheme(':root', {
  typography: {
    heading: {
      mobile: computeValues(textValues.mobile),
      tablet: computeValues(textValues.tablet),
      desktop: computeValues(textValues.desktop),
    },
  },
});

export const fontFamily = style({
  fontFamily: 'Lobster',
});

export const basicText = createTextStyle(textValues.mobile, 'basicText');

export const themedText = createTextStyle(
  vars.typography.heading.mobile,
  'themedText',
);

export const responsiveText = createTextStyle(
  textValues.mobile,
  {
    '@media': {
      'screen and (min-width: 768px)': textValues.tablet,
      'screen and (min-width: 1024px)': textValues.desktop,
    },
  },
  'responsiveText',
);

export const responsiveThemedText = createTextStyle(
  vars.typography.heading.mobile,
  {
    '@media': {
      'screen and (min-width: 768px)': vars.typography.heading.tablet,
      'screen and (min-width: 1024px)': vars.typography.heading.desktop,
    },
  },
  'responsiveThemedText',
);
