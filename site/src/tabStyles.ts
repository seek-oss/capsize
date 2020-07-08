export default {
  tabs: {
    variant: 'soft-rounded' as const,
  },
  tab: {
    color: 'gray.500',
    marginRight: [2, 2, 4, 4],
    paddingX: [4, 6, 6, 8],
    _selected: { color: 'gray.600', bg: 'gray.100' },
    _hover: { color: 'gray.500', bg: 'gray.50' },
  },
};
