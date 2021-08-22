import { createStyleObject } from './createStyleObject';

export function createStyleString(
  ruleName: string,
  options: Parameters<typeof createStyleObject>[0],
) {
  const {
    '::before': beforePseudo,
    '::after': afterPseudo,
    ...rootStyles
  } = createStyleObject(options);

  const objToCSSRules = <Property extends string>(
    stylesObj: Record<Property, string>,
    psuedoName?: string,
  ) => `
.${ruleName}${psuedoName ? `::${psuedoName}` : ''} {
${Object.keys(stylesObj)
  .map(
    (property) =>
      `  ${property.replace(/[A-Z]/g, '-$&').toLowerCase()}: ${stylesObj[
        property as keyof typeof stylesObj
      ].replace(/'/g, '"')}`,
  )
  .join(';\n')};
}`;

  return [
    objToCSSRules(rootStyles),
    objToCSSRules(beforePseudo, 'before'),
    objToCSSRules(afterPseudo, 'after'),
  ].join('\n');
}
