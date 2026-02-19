import type { Preset, Settings } from "../state/state";
import { createId } from "../utils/id";
import { readJson, writeJson } from "./localStore";

const PRESETS_KEY = "textToPrompt.presets";

export function loadPresets(): Preset[] {
  const presets = readJson<Preset[]>(PRESETS_KEY, []);
  return Array.isArray(presets) ? presets : [];
}

export function savePreset(presets: Preset[], name: string, settings: Settings): Preset[] {
  const now = new Date().toISOString();
  const preset: Preset = {
    id: createId("preset"),
    name,
    settings,
    createdAt: now,
    updatedAt: now
  };
  const next = [...presets, preset];
  writeJson(PRESETS_KEY, next);
  return next;
}

export function deletePreset(presets: Preset[], id: string): Preset[] {
  const next = presets.filter((preset) => preset.id !== id);
  writeJson(PRESETS_KEY, next);
  return next;
}

export function exportPresets(presets: Preset[]): string {
  return JSON.stringify(presets, null, 2);
}

function isPresetLike(value: unknown): value is Preset {
  if (!value || typeof value !== "object") {
    return false;
  }
  const candidate = value as Preset;
  return Boolean(candidate.id && candidate.name && candidate.settings);
}

export function importPresets(json: string, current: Preset[]): Preset[] {
  try {
    const data = JSON.parse(json);
    if (!Array.isArray(data)) {
      return current;
    }
    const presets = data.filter(isPresetLike);
    const normalized = presets.map((preset) => ({
      ...preset,
      id: createId("preset"),
      createdAt: preset.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
    const merged = [...current, ...normalized];
    writeJson(PRESETS_KEY, merged);
    return merged;
  } catch {
    return current;
  }
}
