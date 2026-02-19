export type Mode = "easy" | "medium" | "hard";
export type OutputTab = "single" | "pack";

export interface Toggles {
  assumptions: boolean;
  questions: boolean;
  acceptance: boolean;
}

export interface Settings {
  mode: Mode;
  toggles: Toggles;
  outputTab: OutputTab;
}

export interface Preset {
  id: string;
  name: string;
  settings: Settings;
  createdAt: string;
  updatedAt: string;
}

export interface HistoryEntry {
  id: string;
  timestamp: string;
  input: string;
  settings: Settings;
  output: string;
  outputPack: string;
}

export interface AppState {
  input: string;
  output: string;
  outputPack: string;
  error: string | null;
  settings: Settings;
  presets: Preset[];
  history: HistoryEntry[];
  ui: UIState;
}

export interface UIState {
  presetDialogOpen: boolean;
  historyDialogOpen: boolean;
  returnFocusId: string | null;
}

export type Listener = (state: AppState) => void;

export interface Store {
  getState: () => AppState;
  setState: (state: AppState) => void;
  update: (updater: (state: AppState) => AppState) => void;
  subscribe: (listener: Listener) => () => void;
}

export function createStore(initialState: AppState): Store {
  let state = initialState;
  const listeners = new Set<Listener>();

  const notify = () => {
    listeners.forEach((listener) => listener(state));
  };

  return {
    getState: () => state,
    setState: (nextState) => {
      state = nextState;
      notify();
    },
    update: (updater) => {
      state = updater(state);
      notify();
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
}
