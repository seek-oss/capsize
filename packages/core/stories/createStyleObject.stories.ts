import { css } from '@emotion/css';
import { createStyleObject } from '../src/createStyleObject';

export default {
  title: 'core/createStyleObject',
};

const divider = (label: string) => `
  <div style="background: #ffdbe8; padding: 8px; font-family: Roboto; position: relative; z-index: -1">${label}</div>
`;

const capsizeStyle = createStyleObject({
  fontSize: 50,
  leading: 65,
  fontMetrics: {
    capHeight: 748,
    ascent: 1000,
    descent: -250,
    lineGap: 0,
    unitsPerEm: 1000,
  },
});

const textStyle = css({
  fontFamily: 'Lobster',
  ...capsizeStyle,
});

const container = (content: string) => () =>
  `
  ${divider('Previous element')}
  ${content}
  ${divider('Next element')}
`;

export const Basic = container(`
  <div class="${textStyle}">
    Heading
  </div>
`);

export const BackgroundColourInternal = container(`
  <div style="padding: 50px;">
    <div class="${textStyle}" style="background: #caeaff">
      Heading
    </div>
  </div>
`);

export const BackgroundColourExternal = container(`
  <div style="padding: 50px; background: #caeaff">
    <div class="${textStyle}" style="background: white">
      Heading
    </div>
  </div>
`);

export const WrappingText = container(`
  <div class="${textStyle}" style="max-width: 400px">
    Heading that wraps onto another line
  </div>
`);

export const Truncation = container(`
  <div class="${textStyle}" style="max-width: 400px">
    <span style="display: block; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
      Heading that truncates
    </span>
  </div>
`);
