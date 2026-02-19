export function renderGuardrails(): string {
  return [
    "## Guardrails",
    "- Do not invent facts.",
    "- Ask if unknown.",
    "- Be explicit about assumptions."
  ].join("\n");
}
