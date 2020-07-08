import React, { useCallback, ChangeEvent } from 'react';
import { useCombobox } from 'downshift';
import debounce from 'debounce';
import { FormLabel, Box, Input, VisuallyHidden, Text } from '@chakra-ui/core';
import ContentBlock from './ContentBlock';

interface AutosuggestProps<Value> {
  value: Value;
  label: string;
  onFilterSuggestions: (inputValue: string | undefined) => void;
  suggestions: Array<Value>;
  onChange: (value: Value) => void;
  itemToString: (value: Value) => string;
  placeholder?: string;
  message?: string;
  onInputChange?: () => void;
}
export default function Autosuggest<Value>({
  label,
  value,
  onChange,
  placeholder,
  onFilterSuggestions,
  suggestions,
  itemToString,
  message,
  onInputChange,
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

  const { onChange: downShiftChange, ...inputProps } = getInputProps();

  return (
    <Box>
      <VisuallyHidden>
        <FormLabel {...getLabelProps()}>{label}</FormLabel>
      </VisuallyHidden>
      <div {...getComboboxProps()}>
        <Input
          borderRadius={16}
          isInvalid={Boolean(message)}
          size="lg"
          _focus={{ boxShadow: 'outline', borderColor: 'transparent' }}
          {...inputProps}
          onChange={(ev: ChangeEvent) => {
            downShiftChange(ev);

            if (typeof onInputChange === 'function') {
              onInputChange();
            }
          }}
          aria-describedby={message ? 'googleFontErrorMessage' : undefined}
          placeholder={placeholder}
        />
        {message ? (
          <Text
            id="googleFontErrorMessage"
            pos="absolute"
            paddingY={2}
            paddingX={4}
            color="red.500"
          >
            {message}
          </Text>
        ) : null}
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
        bg="white"
        marginTop={1}
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
                    bg="pink.200"
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
