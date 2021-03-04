export default {
  tabs: {
    variant: 'soft-rounded' as const,
  },
  tab: {
    color: 'gray.500',
    marginRight: [1, 2, 4, 4],
    paddingX: [3, 6, 6, 8],
    whiteSpace: 'nowrap' as const,
    _selected: { color: 'gray.600', bg: 'gray.100' },
    _hover: { color: 'gray.500', bg: 'gray.50' },
  },
};
