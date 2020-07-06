import { TabsProps } from '@chakra-ui/core';

export default {
  tabs: {
    variantColor: 'unstyled',
    variant: 'soft-rounded',
  } as TabsProps,
  tab: {
    color: 'gray.500',
    marginRight: [2, 2, 4, 4],
    paddingX: [4, 6, 6, 8],
    _selected: { color: 'gray.600', bg: 'gray.100' },
    _hover: { color: 'gray.500', bg: 'gray.50' },
  },
};
