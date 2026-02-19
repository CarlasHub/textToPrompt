import type { AppState } from "./state";
import { getDefaultState } from "./defaults";
import { loadPresets } from "../storage/presets";
import { loadHistory } from "../storage/history";
import { loadSettings } from "./settings";

export function loadInitialState(): AppState {
  const base = getDefaultState();
  return {
    ...base,
    settings: loadSettings(),
    presets: loadPresets(),
    history: loadHistory()
  };
}
