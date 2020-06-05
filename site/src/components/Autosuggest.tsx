import React, { useCallback } from 'react';
import { useCombobox } from 'downshift';
import debounce from 'debounce';
import {
  FormLabel,
  Box,
  Input,
  useTheme,
  VisuallyHidden,
} from '@chakra-ui/core';
import ContentBlock from './ContentBlock';

interface AutosuggestProps<Value> {
  value: Value;
  label: string;
  onFilterSuggestions: (inputValue: string | undefined) => void;
  suggestions: Array<Value>;
  onChange: (value: Value) => void;
  itemToString: (value: Value) => string;
  placeholder?: string;
}
export default function Autosuggest<Value>({
  label,
  value,
  onChange,
  placeholder,
  onFilterSuggestions,
  suggestions,
  itemToString,
}: AutosuggestProps<Value>) {
  const debouncedOnFilterSuggestions = useCallback(
    debounce(onFilterSuggestions, 100),
    [onFilterSuggestions],
  );
  const { colors } = useTheme();

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
      <VisuallyHidden>
        <FormLabel {...getLabelProps()}>{label}</FormLabel>
      </VisuallyHidden>
      <div {...getComboboxProps()}>
        <Input {...getInputProps()} placeholder={placeholder} />
      </div>

      <Box
        pos="absolute"
        left={0}
        right={0}
        height={isOpen ? '100%' : undefined}
        zIndex={2}
        pointerEvents={isOpen ? undefined : 'none'}
        opacity={isOpen ? undefined : 0}
        transition="200ms ease"
        style={{ backgroundColor: colors.gray[800] }}
      >
        <ContentBlock>
          <Box as="ul" {...getMenuProps()} paddingY={4}>
            {isOpen &&
              suggestions.map((item, index) => (
                <Box
                  as="li"
                  key={`${item}${index}`}
                  pos="relative"
                  d="flex"
                  alignItems="center"
                  padding={4}
                  {...getItemProps({ item, index })}
                >
                  <Box
                    w="100%"
                    h="100%"
                    pos="absolute"
                    left={0}
                    opacity={highlightedIndex === index ? 0.15 : 0}
                    rounded="lg"
                    bg="orange.200"
                  />
                  {itemToString(item)}
                </Box>
              ))}
          </Box>
        </ContentBlock>
      </Box>
    </Box>
  );
}
