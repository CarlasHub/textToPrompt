import type { AppState, Mode, Settings, Toggles } from "./state";

export const DEFAULT_MODE: Mode = "easy";

const DEFAULT_TOGGLES_BY_MODE: Record<Mode, Toggles> = {
  easy: {
    assumptions: false,
    questions: false,
    acceptance: false
  },
  medium: {
    assumptions: true,
    questions: true,
    acceptance: false
  },
  hard: {
    assumptions: true,
    questions: true,
    acceptance: true
  }
};

export function getDefaultSettings(mode: Mode = DEFAULT_MODE): Settings {
  return {
    mode,
    toggles: { ...DEFAULT_TOGGLES_BY_MODE[mode] },
    outputTab: "single"
  };
}

export function getDefaultState(): AppState {
  return {
    input: "",
    output: "",
    outputPack: "",
    error: null,
    settings: getDefaultSettings(),
    presets: [],
    history: [],
    ui: {
      presetDialogOpen: false,
      historyDialogOpen: false,
      returnFocusId: null
    }
  };
}

export function getModeDefaults(mode: Mode): Toggles {
  return { ...DEFAULT_TOGGLES_BY_MODE[mode] };
}
