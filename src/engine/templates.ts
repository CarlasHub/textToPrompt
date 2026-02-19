import type { Settings } from "../state/state";
import { renderGuardrails } from "./guardrails";

export interface RefinementContext {
  normalizedInput: string;
  constraints: string[];
  deliverables: string[];
  settings: Settings;
}

type PromptVariant = "single" | "discovery" | "plan" | "execution";

function stripBullet(value: string): string {
  return value.replace(/^\s*([-*•]|\d+\.)\s+/, "").trim();
}

function renderList(items: string[], emptyLabel = "None provided."): string {
  if (items.length === 0) {
    return `- ${emptyLabel}`;
  }
  return items.map((item) => `- ${stripBullet(item)}`).join("\n");
}

function renderBlock(text: string): string {
  return text.trim() ? text : "(No input provided.)";
}

function renderDeliverables(deliverables: string[]): string {
  if (deliverables.length === 0) {
    return "Use a clear, structured Markdown response.";
  }
  const unique = Array.from(new Set(deliverables));
  return `Provide the output as: ${unique.join(", ")}.`;
}

function renderDefinitions(deliverables: string[]): string {
  if (deliverables.length === 0) {
    return "- None specified.";
  }
  return deliverables
    .map((item) => `- ${item}: deliver in a clean, skimmable format.`)
    .join("\n");
}

function renderQuestions(defaults: string[], enabled: boolean): string | null {
  if (!enabled) {
    return null;
  }
  return ["## Clarifying Questions", renderList(defaults, "No questions yet.")].join("\n");
}

function renderAssumptions(enabled: boolean): string | null {
  if (!enabled) {
    return null;
  }
  return ["## Assumptions", renderList([], "State assumptions if needed.")].join("\n");
}

function renderAcceptance(enabled: boolean): string | null {
  if (!enabled) {
    return null;
  }
  return [
    "## Acceptance Criteria",
    renderList([], "Define acceptance criteria if required.")
  ].join("\n");
}

function renderOutputRules(deliverables: string[]): string {
  const rules = [
    renderDeliverables(deliverables),
    "Use concise bullet points where possible.",
    "Keep sections clearly labeled.",
    "Avoid unnecessary filler."
  ];
  return ["## Output Format Rules", renderList(rules)].join("\n");
}

function renderTwoStepChain(): string {
  return [
    "## Two-Step Chain",
    "1. Plan only: propose the plan without executing.",
    "2. Execute and verify: follow the plan and confirm results against constraints."
  ].join("\n");
}

function renderFocus(variant: PromptVariant): string | null {
  if (variant === "single") {
    return null;
  }
  const focusMap: Record<Exclude<PromptVariant, "single">, string> = {
    discovery: "Surface missing details, unknowns, and constraints.",
    plan: "Provide a clear, ordered plan only.",
    execution: "Execute the plan and verify the outcome."
  };
  const focus = focusMap[variant];
  return ["## Focus", focus].join("\n");
}

function promptHeading(variant: PromptVariant): string {
  if (variant === "single") {
    return "# Refined Prompt";
  }
  const label = variant === "plan" ? "Plan" : variant === "execution" ? "Execution" : "Discovery";
  return `# ${label} Prompt`;
}

function buildEasy(context: RefinementContext, variant: PromptVariant): string {
  const sections: string[] = [
    promptHeading(variant),
    `Mode: ${context.settings.mode}`
  ];

  const focus = renderFocus(variant);
  if (focus) {
    sections.push(focus);
  }

  sections.push(
    "## Goal",
    "Summarize the user intent and deliver a structured response.",
    "## Context",
    renderBlock(context.normalizedInput),
    "## Input",
    renderBlock(context.normalizedInput),
    "## Requested Output Format",
    renderDeliverables(context.deliverables),
    "## Constraints",
    renderList(context.constraints)
  );

  const assumptions = renderAssumptions(context.settings.toggles.assumptions);
  if (assumptions) {
    sections.push(assumptions);
  }

  const questions = renderQuestions([
    "What is the target audience?",
    "What level of detail is expected?"
  ], context.settings.toggles.questions);
  if (questions) {
    sections.push(questions);
  }

  const acceptance = renderAcceptance(context.settings.toggles.acceptance);
  if (acceptance) {
    sections.push(acceptance);
  }

  sections.push(renderOutputRules(context.deliverables), renderGuardrails());

  return sections.join("\n\n");
}

function buildMedium(context: RefinementContext, variant: PromptVariant): string {
  const sections: string[] = [
    promptHeading(variant),
    `Mode: ${context.settings.mode}`
  ];

  const focus = renderFocus(variant);
  if (focus) {
    sections.push(focus);
  }

  sections.push(
    "## Role",
    "You are a structured, detail-oriented assistant.",
    "## Goal",
    "Deliver a complete and well-organized response based on the input.",
    "## Context",
    renderBlock(context.normalizedInput),
    "## Constraints",
    renderList(context.constraints)
  );

  const assumptions = renderAssumptions(context.settings.toggles.assumptions);
  if (assumptions) {
    sections.push(assumptions);
  }

  const questions = renderQuestions([
    "What is the intended audience or user?",
    "Are there any format or length preferences?"
  ], context.settings.toggles.questions);
  if (questions) {
    sections.push(questions);
  }

  const acceptance = renderAcceptance(context.settings.toggles.acceptance);
  if (acceptance) {
    sections.push(acceptance);
  }

  sections.push(renderOutputRules(context.deliverables), renderGuardrails());

  return sections.join("\n\n");
}

function buildHard(context: RefinementContext, variant: PromptVariant): string {
  const sections: string[] = [
    promptHeading(variant),
    `Mode: ${context.settings.mode}`
  ];

  const focus = renderFocus(variant);
  if (focus) {
    sections.push(focus);
  }

  sections.push(
    "## Role",
    "You are an expert, methodical assistant that prioritizes correctness.",
    "## Definitions",
    renderDefinitions(context.deliverables),
    "## Goal",
    "Deliver the requested output with maximum clarity and compliance.",
    "## Non Goals",
    renderList(["Anything not explicitly requested.", "Unverified assumptions."], "None."),
    "## Constraints",
    renderList(context.constraints)
  );

  const assumptions = renderAssumptions(context.settings.toggles.assumptions);
  if (assumptions) {
    sections.push(assumptions);
  }

  const questions = renderQuestions([
    "What is the success criteria for this output?",
    "Are there any required formats or templates?"
  ], context.settings.toggles.questions);
  if (questions) {
    sections.push(questions);
  }

  const acceptance = renderAcceptance(context.settings.toggles.acceptance);
  if (acceptance) {
    sections.push(acceptance);
  }

  sections.push(
    "## Validation Checklist",
    renderList([
      "All constraints satisfied.",
      "Assumptions are explicit.",
      "Open questions are listed if needed.",
      "Output format rules followed."
    ]),
    renderOutputRules(context.deliverables),
    renderTwoStepChain(),
    renderGuardrails()
  );

  return sections.join("\n\n");
}

export function buildSinglePrompt(context: RefinementContext): string {
  switch (context.settings.mode) {
    case "easy":
      return buildEasy(context, "single");
    case "medium":
      return buildMedium(context, "single");
    case "hard":
      return buildHard(context, "single");
  }
}

export function buildPromptPack(context: RefinementContext): string {
  const variants: PromptVariant[] = ["discovery", "plan", "execution"];
  const prompts = variants.map((variant) => {
    switch (context.settings.mode) {
      case "easy":
        return buildEasy(context, variant);
      case "medium":
        return buildMedium(context, variant);
      case "hard":
        return buildHard(context, variant);
    }
  });

  return prompts.join("\n\n---\n\n");
}
