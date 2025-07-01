import {
  BasicText,
  ThemedText,
  MediaResponsiveText,
  ResponsiveThemedText,
  ContainerResponsiveText,
} from './Text';

export default {
  title: 'vanilla-extract/createTextStyle',
};

const divider = (label: string) => `
  <div style="background: #ffdbe8; padding: 8px; font-family: Roboto; position: relative; z-index: -1">${label}</div>
`;

const container = (content: string) => () =>
  `
  ${divider('Previous element')}
  ${content}
  ${divider('Next element')}
`;

export const Basic = container(BasicText({ text: 'Heading' }));

export const Themed = container(ThemedText({ text: 'Heading' }));

export const Responsive = container(MediaResponsiveText({ text: 'Heading' }));

export const ResponsiveThemed = container(
  ResponsiveThemedText({ text: 'Heading' }),
);

export const Container = container(
  ContainerResponsiveText({ text: 'Heading' }),
);
