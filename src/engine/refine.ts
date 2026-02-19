import type { Settings } from "../state/state";
import { extractConstraints, extractDeliverables, normalizeText, splitLines } from "./parse";
import { buildPromptPack, buildSinglePrompt } from "./templates";

export interface RefinementResult {
  single: string;
  pack: string;
}

export function refine(input: string, settings: Settings): RefinementResult {
  const normalizedInput = normalizeText(input);
  const lines = splitLines(normalizedInput);
  const constraints = extractConstraints(lines);
  const deliverables = extractDeliverables(normalizedInput);

  const context = {
    normalizedInput,
    constraints,
    deliverables,
    settings
  };

  return {
    single: buildSinglePrompt(context),
    pack: buildPromptPack(context)
  };
}
