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

export const ResponsiveText = ({ text, background }: Props) =>
  `<div class="${styles.fontFamily} ${styles.responsiveText}"${
    background ? ` style="background: ${background}"` : ''
  }>${text}</div>`;

export const ResponsiveThemedText = ({ text, background }: Props) =>
  `<div class="${styles.fontFamily} ${styles.responsiveThemedText}"${
    background ? ` style="background: ${background}"` : ''
  }>${text}</div>`;
