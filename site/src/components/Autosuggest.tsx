import React, { useCallback } from 'react';
import { useCombobox } from 'downshift';
import debounce from 'debounce';
import { FormLabel, Box, Input, PseudoBox } from '@chakra-ui/core';

interface AutosuggestProps<Value> {
  value: Value;
  label: string;
  onFilterSuggestions: (inputValue: string | undefined) => void;
  suggestions: Array<Value>;
  onChange: (value: Value) => void;
  itemToString: (value: Value) => string;
}
export default function Autosuggest<Value>({
  label,
  value,
  onChange,
  onFilterSuggestions,
  suggestions,
  itemToString,
}: AutosuggestProps<Value>) {
  const debouncedOnFilterSuggestions = useCallback(
    debounce(onFilterSuggestions, 100),
    [onFilterSuggestions],
  );

  const {
    isOpen,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    itemToString,
    selectedItem: value,
    onSelectedItemChange: ({ selectedItem }) => {
      // @ts-expect-error
      onChange(selectedItem ?? null);
    },
    items: suggestions,
    onInputValueChange: ({ inputValue }) => {
      debouncedOnFilterSuggestions(inputValue);
    },
  });
  return (
    <Box>
      <FormLabel {...getLabelProps()}>{label}</FormLabel>
      <div {...getComboboxProps()}>
        <Input {...getInputProps()} />
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
                {itemToString(item)}
              </Box>
            ))}
        </Box>
      </Box>
    </Box>
  );
}
