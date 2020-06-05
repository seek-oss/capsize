import React, {
  useReducer,
  ReactNode,
  Dispatch,
  ReducerAction,
  useContext,
} from 'react';
import { FontMetrics } from 'capsize/metrics';

const robotoMetrics = {
  ascent: 1900,
  capHeight: 1456,
  descent: -500,
  familyName: 'Roboto',
  lineGap: 0,
  subfamilyName: 'Regular',
  unitsPerEm: 2048,
};

const roboto = {
  source: 'GOOGLE_FONT',
  url: 'https://fonts.googleapis.com/css2?family=Roboto',
} as const;

const calculateNormalLeading = (capHeight: number, metrics: FontMetrics) => {
  const contentArea = metrics.ascent + Math.abs(metrics.descent);
  const lineHeight = contentArea + metrics.lineGap;
  const lineHeightScale = lineHeight / metrics.unitsPerEm;

  return lineHeightScale * capHeight;
};

type Font =
  | {
      source: 'GOOGLE_FONT';
      url: string;
    }
  | { source: 'URL' | 'FILE_UPLOAD'; url: string; type: string };

interface AppState {
  capHeight: number;
  leading: number;
  metrics: FontMetrics;
  selectedFont: Font;
}

type Action =
  | { type: 'UPDATE_CAPHEIGHT'; value: number }
  | { type: 'UPDATE_LEADING'; value: number }
  | {
      type: 'UPDATE_FONT';
      value: { metrics: FontMetrics; font: Font };
    };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'UPDATE_CAPHEIGHT': {
      return {
        ...state,
        capHeight: action.value,
      };
    }

    case 'UPDATE_LEADING': {
      return {
        ...state,
        leading: action.value,
      };
    }

    case 'UPDATE_FONT': {
      return {
        ...state,
        metrics: action.value.metrics,
        selectedFont: action.value.font,
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

const intialState: AppState = {
  metrics: robotoMetrics,
  capHeight: 24,
  leading: calculateNormalLeading(24, robotoMetrics),
  selectedFont: roboto,
};

interface StateProviderProps {
  children: ReactNode;
}
export function AppStateProvider({ children }: StateProviderProps) {
  const [state, dispatch] = useReducer(reducer, intialState);

  // eslint-disable-next-line no-console
  console.log(state);

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
