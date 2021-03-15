import capsize from '.';

export default (
  capsizeStyles: ReturnType<typeof capsize>,
  ruleName: string,
) => {
  const {
    '::before': beforePseudo,
    '::after': afterPseudo,
    ...rootStyles
  } = capsizeStyles;

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
};
