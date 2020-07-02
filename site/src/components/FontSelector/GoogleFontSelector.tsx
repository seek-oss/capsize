import React, { useState } from 'react';
import matchSorter from 'match-sorter';
import { fromGoogleFonts, fontToGoogleFontsUrl } from 'capsize/metrics';

import { useAppState } from '../AppStateContext';
import Autosuggest from '../Autosuggest';
import googleFontData from '../data.json';

type GoogleFont = typeof googleFontData.items[number] | null;

function itemToString(value: GoogleFont) {
  return value ? value.family : '';
}

function getFilteredFonts(inputValue: string) {
  return matchSorter(googleFontData.items, inputValue, {
    keys: ['family'],
  }).slice(0, 10);
}

const resolveFormatFromExtension = (ext?: string) => {
  if (ext === 'ttf') {
    return 'truetype';
  }

  if (ext === 'otf') {
    return 'opentype';
  }

  return ext || '';
};

export default function GoogleFontSelector() {
  const { dispatch } = useAppState();

  const [value, setValue] = useState<GoogleFont>(null);
  const [suggestions, setSuggestions] = useState<Array<GoogleFont>>([]);

  const onFilterSuggestions = (inputValue: string | undefined) => {
    if (inputValue) {
      return setSuggestions(getFilteredFonts(inputValue));
    }

    setSuggestions([]);
  };

  return (
    <Autosuggest
      label="Google font name"
      placeholder="Enter a font name"
      value={value}
      onChange={async (newValue) => {
        setValue(newValue);

        if (newValue) {
          const metrics = await fromGoogleFonts(newValue);

          const firstFontVariant = Object.keys(
            newValue.files,
          )[0] as keyof typeof newValue.files;
          const fontUrlParts =
            newValue.files[firstFontVariant]?.split('.') || [];
          const format = fontUrlParts[fontUrlParts.length - 1];

          dispatch({
            type: 'UPDATE_FONT',
            value: {
              metrics,
              font: {
                source: 'GOOGLE_FONT',
                url:
                  newValue.files.regular ||
                  newValue.files[firstFontVariant] ||
                  '',
                type: resolveFormatFromExtension(format),
              },
            },
          });
        }
      }}
      itemToString={itemToString}
      suggestions={suggestions}
      onFilterSuggestions={onFilterSuggestions}
    />
  );
}
