import capsize from '../';
import renderToStyleRules from '../renderToStyleRules';

export default {
  title: 'Examples',
};

const className = 'capsized';
const divider = (label: string) => `
  <div style="background: #ffdbe8; padding: 8px; font-family: Roboto; position: relative; z-index: -1">${label}</div>
`;

const metrics = {
  capHeight: 1356,
  ascent: 1825,
  descent: -443,
  lineGap: 87,
  unitsPerEm: 2048,
};

const createStyles = (
  fontFamily: string,
  capsizeStyles: ReturnType<typeof capsize>,
) => `
<style>
  * {
    color: #1a365d;
    font-family: ${fontFamily};
  }
  ${renderToStyleRules(capsizeStyles, className)}
</style>
`;

const styles = capsize({
  fontSize: 50,
  leading: 65,
  fontMetrics: metrics,
});

const container = (content: string) => () => `
  ${createStyles('Times', styles)}
  ${divider('Previous element')}
  ${content}
  ${divider('Next element')}
`;

export const Basic = container(`
  <div class="${className}">
    Heading
  </div>
`);

export const BackgroundColourInternal = container(`
  <div style="padding: 50px;">
    <div class="${className}" style="background: #caeaff">
      Heading
    </div>
  </div>
`);

export const BackgroundColourExternal = container(`
  <div style="padding: 50px; background: #caeaff">
    <div class="${className}" style="background: white">
      Heading
    </div>
  </div>
`);

export const WrappingText = container(`
  <div class="${className}" style="max-width: 400px">
    Heading that wraps onto another line
  </div>
`);

export const Truncation = container(`
  <div class="${className}" style="max-width: 400px">
    <span style="display: block; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
      Heading that truncates
    </span>
  </div>
`);
