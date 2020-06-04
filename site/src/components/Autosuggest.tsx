import React from 'react';
import { useCombobox } from 'downshift';
import { FormLabel, Box, Input, Button, PseudoBox } from '@chakra-ui/core';

interface AutosuggestProps {
  value: string | undefined;
  label: string;
  onFilterSuggestions: (inputValue: string | undefined) => void;
  suggestions: string[];
  onChange: (value: string | undefined) => void;
}
export default ({
  label,
  value,
  onChange,
  onFilterSuggestions,
  suggestions,
}: AutosuggestProps) => {
  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    selectedItem: value,
    onSelectedItemChange: ({ selectedItem }) => onChange(selectedItem),
    items: suggestions,
    onInputValueChange: ({ inputValue }) => {
      onFilterSuggestions(inputValue);
    },
  });
  return (
    <Box>
      <FormLabel {...getLabelProps()}>{label}</FormLabel>
      <div {...getComboboxProps()}>
        <Input {...getInputProps()} />
        <Button {...getToggleButtonProps()} aria-label="toggle menu">
          &#8595;
        </Button>
      </div>

      <Box pos="relative">
        <Box as="ul" pos="absolute" w="100%" {...getMenuProps()}>
          {isOpen &&
            suggestions.map((item, index) => (
              <Box
                as="li"
                key={`${item}${index}`}
                pos="relative"
                d="flex"
                alignItems="center"
                paddingX={4}
                paddingY={2}
                style={
                  highlightedIndex === index
                    ? { backgroundColor: '#bde4ff' }
                    : {}
                }
                {...getItemProps({ item, index })}
              >
                <PseudoBox
                  w="100%"
                  h="100%"
                  pos="absolute"
                  left={0}
                  opacity={0.1}
                  rounded="lg"
                  _hover={{
                    bg: 'white',
                  }}
                />
                {item}
              </Box>
            ))}
        </Box>
      </Box>
    </Box>
  );
};
