import type { Mode, OutputTab, Settings } from "./state";
import { getDefaultSettings } from "./defaults";
import { readJson, writeJson } from "../storage/localStore";

const SETTINGS_KEY = "textToPrompt.settings";

const MODES: Mode[] = ["easy", "medium", "hard"];
const TABS: OutputTab[] = ["single", "pack"];

function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

function sanitizeSettings(settings: Partial<Settings> | null): Settings {
  const defaults = getDefaultSettings();
  if (!settings) {
    return defaults;
  }

  const mode = MODES.includes(settings.mode as Mode) ? (settings.mode as Mode) : defaults.mode;
  const outputTab = TABS.includes(settings.outputTab as OutputTab)
    ? (settings.outputTab as OutputTab)
    : defaults.outputTab;
  const toggles = {
    assumptions: isBoolean(settings.toggles?.assumptions)
      ? settings.toggles?.assumptions
      : defaults.toggles.assumptions,
    questions: isBoolean(settings.toggles?.questions)
      ? settings.toggles?.questions
      : defaults.toggles.questions,
    acceptance: isBoolean(settings.toggles?.acceptance)
      ? settings.toggles?.acceptance
      : defaults.toggles.acceptance
  };

  return {
    mode,
    outputTab,
    toggles
  };
}

export function loadSettings(): Settings {
  const raw = readJson<Settings | null>(SETTINGS_KEY, null);
  return sanitizeSettings(raw);
}

export function saveSettings(settings: Settings): void {
  writeJson(SETTINGS_KEY, settings);
}
