import * as styles from './Text.css';

interface Props {
  text: string;
  background?: string;
}

export const BasicText = ({ text, background }: Props) =>
  `<div class="${styles.fontFamily} ${styles.basicText}"${
    background ? ` style="background: ${background}"` : ''
  }>${text}</div>`;

export const ThemedText = ({ text, background }: Props) =>
  `<div class="${styles.fontFamily} ${styles.themedText}"${
    background ? ` style="background: ${background}"` : ''
  }>${text}</div>`;

export const MediaResponsiveText = ({ text, background }: Props) =>
  `<div class="${styles.fontFamily} ${styles.responsiveText}"${
    background ? ` style="background: ${background}"` : ''
  }>${text}</div>`;

export const ResponsiveThemedText = ({ text, background }: Props) =>
  `<div class="${styles.fontFamily} ${styles.responsiveThemedText}"${
    background ? ` style="background: ${background}"` : ''
  }>${text}</div>`;

export const ContainerResponsiveText = ({ text, background }: Props) =>
  [350, 550, 700]
    .map(
      (width) => `
      <div style="width: ${width}px;" class="${styles.container}">
        <div class="${styles.fontFamily} ${styles.containerText}"${
        background ? ` style="background: ${background}"` : ''
      }>
          ${text}
        </div>
      </div>`,
    )
    .join('\n');
