import React, { ChangeEvent } from 'react';
import { Input } from '@chakra-ui/core';
import { fromBlob } from 'capsize/metrics';

import { useAppState } from '../AppStateContext';
import { fontTypeFromUrl } from './fontTypeFromUrl';

export default function FileUploadSelector() {
  const { dispatch } = useAppState();

  return (
    <Input
      type="file"
      placeholder="Upload a file"
      onChange={async (ev: ChangeEvent<HTMLInputElement>) => {
        if (ev.currentTarget.files && ev.currentTarget.files[0]) {
          const file = ev.currentTarget.files[0];

          const metrics = await fromBlob(file);

          const reader = new FileReader();

          reader.addEventListener(
            'load',
            () => {
              dispatch({
                type: 'UPDATE_FONT',
                value: {
                  metrics,
                  font: {
                    source: 'FILE_UPLOAD',
                    url: reader.result as string,
                    type: fontTypeFromUrl(file.name),
                  },
                },
              });
            },
            false,
          );

          reader.readAsDataURL(file);
        } else {
          // eslint-disable-next-line no-console
          console.error('SHOULDNT HAPPEN??', ev.currentTarget);
        }
      }}
      accept=".ttf, .otf, .woff, .woff2, .ttc, .dfont"
    />
  );
}
