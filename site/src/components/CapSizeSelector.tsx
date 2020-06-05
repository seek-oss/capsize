import React from 'react';
import { Box, Input, FormLabel, Stack } from '@chakra-ui/core';

import { useAppState } from './AppStateContext';

const CapSizeSelector = () => {
  const { state, dispatch } = useAppState();

  const { leading, capHeight } = state;

  return (
    <Stack isInline spacing={2}>
      <Box>
        <FormLabel htmlFor="capHeight">Cap Height</FormLabel>
        <Input
          id="capHeight"
          type="number"
          value={capHeight ?? ''}
          onChange={(ev: { currentTarget: { value: string } }) =>
            dispatch({
              type: 'UPDATE_CAPHEIGHT',
              value: parseInt(ev.currentTarget.value, 10),
            })
          }
        />
      </Box>
      <Box>
        <FormLabel htmlFor="leading">Leading</FormLabel>
        <Input
          id="leading"
          type="number"
          value={leading}
          onChange={(ev: { currentTarget: { value: string } }) =>
            dispatch({
              type: 'UPDATE_LEADING',
              value: parseInt(ev.currentTarget.value, 10),
            })
          }
        />
      </Box>
    </Stack>
  );
};

export default CapSizeSelector;
