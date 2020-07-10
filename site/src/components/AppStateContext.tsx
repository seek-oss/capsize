import React, {
  useReducer,
  ReactNode,
  Dispatch,
  ReducerAction,
  useContext,
} from 'react';
import { FontMetrics } from 'capsize/metrics';
import siteFonts from '../siteFonts.json';

const robotoMetrics = siteFonts.filter(
  ({ familyName }) => familyName === 'Roboto',
)[0];

const roboto = {
  source: 'GOOGLE_FONT',
  url:
    'https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
  type: 'woff2',
} as const;

interface Font {
  source: 'URL' | 'FILE_UPLOAD' | 'GOOGLE_FONT';
  url: string;
  type: string;
}

type LineHeightStyle = 'gap' | 'leading';

interface AppState {
  capHeight: number;
  leading: number;
  lineGap: number;
  gridStep: number;
  snapToGrid: boolean;
  lineHeightStyle: LineHeightStyle;
  metrics: FontMetrics;
  selectedFont: Font;
  focusedField: 'grid' | 'capheight' | 'leading' | 'linegap' | null;
  scaleLineHeight: boolean;
}

type Action =
  | { type: 'UPDATE_CAPHEIGHT'; capHeight: number; leading: number }
  | { type: 'UPDATE_LEADING'; value: number }
  | { type: 'UPDATE_LINEGAP'; value: number }
  | { type: 'UPDATE_LINEHEIGHT_STYLE'; value: LineHeightStyle }
  | { type: 'UPDATE_GRID_STEP'; value: number }
  | { type: 'FIELD_FOCUS'; value: AppState['focusedField'] }
  | { type: 'FIELD_BLUR' }
  | { type: 'TOGGLE_LINEHEIGHT_SCALE' }
  | { type: 'TOGGLE_SNAP_TO_GRID' }
  | {
      type: 'UPDATE_FONT';
      value: { metrics: FontMetrics; font: Font };
    };

const roundToGrid = ({ value, to }: { value: number; to: number }) =>
  value - (value % to);

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'UPDATE_CAPHEIGHT': {
      if (state.scaleLineHeight) {
        const newLineHeight =
          state.lineHeightStyle === 'gap'
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
        focusedField: action.value === 'gap' ? 'linegap' : 'leading',
      };
    }

    case 'UPDATE_FONT': {
      return {
        ...state,
        metrics: action.value.metrics,
        selectedFont: action.value.font,
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
  metrics: robotoMetrics,
  capHeight: initialFontSize,
  leading: Math.round(initialFontSize * 1.5),
  lineGap: 24,
  gridStep: 4,
  snapToGrid: false,
  lineHeightStyle: 'gap',
  selectedFont: roboto,
  focusedField: null,
  scaleLineHeight: true,
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
