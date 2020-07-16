import React, { useState, useEffect } from 'react';
import matchSorter from 'match-sorter';
import { fromUrl } from 'capsize/src/metrics';

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

export default function GoogleFontSelector() {
  const { dispatch, state } = useAppState();

  const [value, setValue] = useState<GoogleFont>(null);
  const [suggestions, setSuggestions] = useState<Array<GoogleFont>>([]);
  const [message, setMessage] = useState('');

  const onFilterSuggestions = (inputValue: string | undefined) => {
    if (inputValue) {
      return setSuggestions(getFilteredFonts(inputValue));
    }

    setSuggestions([]);
  };

  useEffect(() => {
    if (state.selectedFont.source !== 'GOOGLE_FONT') {
      setMessage('');
      setValue(null);
      setSuggestions([]);
    }
  }, [state.selectedFont.source]);

  return (
    <Autosuggest
      label="Google font name"
      placeholder="Enter a Google Font name"
      value={value}
      onInputChange={() => {
        if (message) {
          setMessage('');
        }
      }}
      onChange={async (newValue) => {
        setValue(newValue);

        if (newValue) {
          const { variants, files } = newValue;
          type FontVariant = keyof typeof files;
          const fontUrl =
            'regular' in files
              ? files.regular
              : files[variants[0] as FontVariant];

          if (!fontUrl) {
            setMessage('Error no `variants` available');
            return;
          }

          const metrics = await fromUrl(fontUrl);

          // console.log(JSON.stringify(metrics, null, 2));

          const fontUrlParts = fontUrl.split('.') || [];
          const extension = fontUrlParts[fontUrlParts.length - 1];

          dispatch({
            type: 'UPDATE_FONT',
            value: {
              metrics,
              font: {
                source: 'GOOGLE_FONT',
                url: fontUrl,
                extension,
              },
            },
          });
        }
      }}
      message={message}
      itemToString={itemToString}
      suggestions={suggestions}
      onFilterSuggestions={onFilterSuggestions}
    />
  );
}
