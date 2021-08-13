import { createStyleString } from '../src/createStyleString';

export default {
  title: 'core/createStyleString',
};

const ruleName = 'capsized';
const divider = (label: string) => `
  <div style="background: #ffdbe8; padding: 8px; font-family: Roboto; position: relative; z-index: -1">${label}</div>
`;

const metrics = {
  capHeight: 748,
  ascent: 1000,
  descent: -250,
  lineGap: 0,
  unitsPerEm: 1000,
};

const createStyles = (
  fontFamily: string,
  capsizeStyles: Parameters<typeof createStyleString>[1],
) => `
<style>
  * {
    color: #1a365d;
    font-family: ${fontFamily};
  }
  ${createStyleString(ruleName, capsizeStyles)}
</style>
`;

const styles = {
  fontSize: 50,
  leading: 65,
  fontMetrics: metrics,
};

const container = (content: string) => () =>
  `
  ${createStyles('Lobster', styles)}
  ${divider('Previous element')}
  ${content}
  ${divider('Next element')}
`;

export const Basic = container(`
  <div class="${ruleName}">
    Heading
  </div>
`);

export const BackgroundColourInternal = container(`
  <div style="padding: 50px;">
    <div class="${ruleName}" style="background: #caeaff">
      Heading
    </div>
  </div>
`);

export const BackgroundColourExternal = container(`
  <div style="padding: 50px; background: #caeaff">
    <div class="${ruleName}" style="background: white">
      Heading
    </div>
  </div>
`);

export const WrappingText = container(`
  <div class="${ruleName}" style="max-width: 400px">
    Heading that wraps onto another line
  </div>
`);

export const Truncation = container(`
  <div class="${ruleName}" style="max-width: 400px">
    <span style="display: block; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
      Heading that truncates
    </span>
  </div>
`);
