import React, {
  useReducer,
  ReactNode,
  Dispatch,
  ReducerAction,
  useContext,
} from 'react';
import { FontMetrics } from 'capsize';
import {
  filterInternalMetrics,
  InternalFontMetrics,
} from 'capsize/src/metrics';
import siteFonts from '../siteFonts.json';

const robotoMetrics = siteFonts.filter(
  ({ familyName }) => familyName === 'Roboto',
)[0];

const roboto = {
  source: 'GOOGLE_FONT',
  url:
    'https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
  format: 'woff2',
  name: 'Roboto',
} as const;

interface Font {
  source: 'URL' | 'FILE_UPLOAD' | 'GOOGLE_FONT';
  url: string;
}

const resolveFormatFromExtension = (ext: string) => {
  if (ext === 'ttf') {
    return 'truetype';
  }

  if (ext === 'otf') {
    return 'opentype';
  }

  return ext;
};

type LineHeightStyle = 'lineGap' | 'leading';
type TextSizeStyle = 'fontSize' | 'capHeight';

interface AppState {
  capHeight: number;
  fontSize: number;
  leading: number;
  lineGap: number;
  gridStep: number;
  snapToGrid: boolean;
  lineHeightStyle: LineHeightStyle;
  textSizeStyle: TextSizeStyle;
  metrics: FontMetrics;
  selectedFont: Font & { name: string; format: string };
  focusedField: 'grid' | TextSizeStyle | LineHeightStyle | null;
  scaleLineHeight: boolean;
}

type Action =
  | { type: 'UPDATE_CAPHEIGHT'; capHeight: number; leading: number }
  | { type: 'UPDATE_LEADING'; value: number }
  | { type: 'UPDATE_LINEGAP'; value: number }
  | { type: 'UPDATE_LINEHEIGHT_STYLE'; value: LineHeightStyle }
  | { type: 'UPDATE_TEXTSIZE_STYLE'; value: TextSizeStyle }
  | { type: 'UPDATE_GRID_STEP'; value: number }
  | { type: 'UPDATE_FONTSIZE'; value: number }
  | { type: 'FIELD_FOCUS'; value: AppState['focusedField'] }
  | { type: 'FIELD_BLUR' }
  | { type: 'TOGGLE_LINEHEIGHT_SCALE' }
  | { type: 'TOGGLE_SNAP_TO_GRID' }
  | {
      type: 'UPDATE_FONT';
      value: {
        metrics: InternalFontMetrics;
        font: Font & { extension: string };
      };
    };

const roundToGrid = ({ value, to }: { value: number; to: number }) =>
  value - (value % to);

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'UPDATE_CAPHEIGHT': {
      if (state.scaleLineHeight) {
        const newLineHeight =
          state.lineHeightStyle === 'lineGap'
            ? {
                lineGap: roundToGrid({
                  value: (state.lineGap / state.capHeight) * action.capHeight,
                  to: state.snapToGrid ? state.gridStep : 1,
                }),
              }
            : {
                leading: roundToGrid({
                  value: (state.leading / state.capHeight) * action.capHeight,
                  to: state.snapToGrid ? state.gridStep : 1,
                }),
              };

        return {
          ...state,
          capHeight: action.capHeight,
          ...newLineHeight,
        };
      }

      return {
        ...state,
        capHeight: action.capHeight,
      };
    }

    case 'UPDATE_FONTSIZE': {
      return {
        ...state,
        fontSize: action.value,
      };
    }

    case 'UPDATE_LEADING': {
      return {
        ...state,
        leading: action.value,
      };
    }

    case 'UPDATE_LINEGAP': {
      return {
        ...state,
        lineGap: action.value,
      };
    }
    case 'UPDATE_GRID_STEP': {
      return {
        ...state,
        gridStep: action.value,
      };
    }

    case 'UPDATE_LINEHEIGHT_STYLE': {
      return {
        ...state,
        lineHeightStyle: action.value,
        focusedField: action.value,
      };
    }

    case 'UPDATE_TEXTSIZE_STYLE': {
      return {
        ...state,
        textSizeStyle: action.value,
        focusedField: action.value,
      };
    }

    case 'UPDATE_FONT': {
      const { extension, ...font } = action.value.font;
      const { familyName, fullName, postscriptName } = action.value.metrics;

      return {
        ...state,
        metrics: filterInternalMetrics(action.value.metrics),
        selectedFont: {
          ...font,
          name: familyName || fullName || postscriptName,
          format: resolveFormatFromExtension(extension),
        },
      };
    }

    case 'FIELD_FOCUS': {
      return {
        ...state,
        focusedField: action.value,
      };
    }
    case 'FIELD_BLUR': {
      return {
        ...state,
        focusedField: null,
      };
    }

    case 'TOGGLE_SNAP_TO_GRID': {
      return {
        ...state,
        snapToGrid: !state.snapToGrid,
      };
    }

    case 'TOGGLE_LINEHEIGHT_SCALE': {
      return {
        ...state,
        scaleLineHeight: !state.scaleLineHeight,
      };
    }

    default:
      return state;
  }
}

type AppStateContextValue =
  | {
      dispatch: Dispatch<ReducerAction<typeof reducer>>;
      state: AppState;
    }
  | undefined;

const AppStateContext = React.createContext<AppStateContextValue>(undefined);

const initialFontSize = 48;
const intialState: AppState = {
  metrics: filterInternalMetrics(robotoMetrics),
  capHeight: initialFontSize,
  fontSize: initialFontSize,
  leading: Math.round(initialFontSize * 1.5),
  lineGap: 24,
  gridStep: 4,
  snapToGrid: false,
  lineHeightStyle: 'lineGap',
  textSizeStyle: 'capHeight',
  selectedFont: roboto,
  focusedField: null,
  scaleLineHeight: false,
};

interface StateProviderProps {
  children: ReactNode;
}
export function AppStateProvider({ children }: StateProviderProps) {
  const [state, dispatch] = useReducer(reducer, intialState);

  // eslint-disable-next-line no-console
  // console.log(state);

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const state = useContext(AppStateContext);

  if (!state) {
    throw new Error('No "AppStateProvider" available');
  }

  return state;
}
