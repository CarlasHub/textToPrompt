import type { HistoryEntry, Settings } from "../state/state";
import { createId } from "../utils/id";
import { readJson, writeJson } from "./localStore";

const HISTORY_KEY = "textToPrompt.history";
const HISTORY_LIMIT = 20;

export function loadHistory(): HistoryEntry[] {
  const history = readJson<HistoryEntry[]>(HISTORY_KEY, []);
  return Array.isArray(history) ? history : [];
}

export function createHistoryEntry(
  input: string,
  settings: Settings,
  output: string,
  outputPack: string
): HistoryEntry {
  return {
    id: createId("history"),
    timestamp: new Date().toISOString(),
    input,
    settings,
    output,
    outputPack
  };
}

export function addHistory(history: HistoryEntry[], entry: HistoryEntry): HistoryEntry[] {
  const next = [entry, ...history].slice(0, HISTORY_LIMIT);
  writeJson(HISTORY_KEY, next);
  return next;
}

export function clearHistory(): HistoryEntry[] {
  writeJson(HISTORY_KEY, []);
  return [];
}
