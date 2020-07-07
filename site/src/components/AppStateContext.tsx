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
  lineHeightStyle: LineHeightStyle;
  metrics: FontMetrics;
  selectedFont: Font;
  focusedField: 'capheight' | 'leading' | 'linegap' | null;
  scaleLeading: boolean;
}

type Action =
  | { type: 'UPDATE_CAPHEIGHT'; capHeight: number; leading: number }
  | { type: 'UPDATE_LEADING'; value: number }
  | { type: 'UPDATE_LINEGAP'; value: number }
  | { type: 'UPDATE_LINEHEIGHT_STYLE'; value: LineHeightStyle }
  | { type: 'CAPHEIGHT_FOCUS' }
  | { type: 'CAPHEIGHT_BLUR' }
  | { type: 'LINEGAP_FOCUS' }
  | { type: 'LINEGAP_BLUR' }
  | { type: 'LEADING_FOCUS' }
  | { type: 'LEADING_BLUR' }
  | { type: 'TOGGLE_LEADING_SCALE' }
  | {
      type: 'UPDATE_FONT';
      value: { metrics: FontMetrics; font: Font };
    };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'UPDATE_CAPHEIGHT': {
      return {
        ...state,
        capHeight: action.capHeight,
        leading: state.scaleLeading
          ? Math.round((state.leading / state.capHeight) * action.capHeight)
          : state.leading,
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

    case 'CAPHEIGHT_FOCUS': {
      return {
        ...state,
        focusedField: 'capheight',
      };
    }
    case 'LEADING_FOCUS': {
      return {
        ...state,
        focusedField: 'leading',
      };
    }
    case 'LINEGAP_FOCUS': {
      return {
        ...state,
        focusedField: 'linegap',
      };
    }
    case 'CAPHEIGHT_BLUR':
    case 'LEADING_BLUR':
    case 'LINEGAP_BLUR': {
      return {
        ...state,
        focusedField: null,
      };
    }

    case 'TOGGLE_LEADING_SCALE': {
      return {
        ...state,
        scaleLeading: !state.scaleLeading,
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
  lineHeightStyle: 'gap',
  selectedFont: roboto,
  focusedField: null,
  scaleLeading: true,
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
