import React, { useState, Fragment } from 'react';
import matchSorter from 'match-sorter';
import { fromGoogleFonts } from 'capsize/metrics';

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
    <Fragment>
      <Autosuggest
        label="Google font name"
        placeholder="Enter a font name"
        value={value}
        onChange={async (newValue) => {
          setValue(newValue);

          if (newValue) {
            const metrics = await fromGoogleFonts(newValue.family);

            dispatch({
              type: 'UPDATE_FONT',
              value: {
                metrics,
                font: {
                  source: 'GOOGLE_FONT',
                  url: `https://fonts.googleapis.com/css?family=${metrics.familyName}`,
                },
              },
            });
          }
        }}
        itemToString={itemToString}
        suggestions={suggestions}
        onFilterSuggestions={onFilterSuggestions}
      />
    </Fragment>
  );
}
