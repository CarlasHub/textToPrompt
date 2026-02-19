# textToPrompt Spec

## Refinement Rules

1. Normalize whitespace and line endings.
2. Preserve bullet points and list structure.
3. Extract constraint lines that include keywords like: `must`, `do not`, `avoid`, `include`.
4. Detect deliverable hints (e.g., report, code, email, plan, checklist) from the input text.
5. Generate deterministic, Markdown-formatted prompts with mode-specific structure.
6. Always include guardrails: do not invent facts, ask if unknown, be explicit about assumptions.

## Templates Per Mode

### Easy

- Goal
- Context
- Input
- Requested Output Format
- Constraints
- Optional: Assumptions, Clarifying Questions, Acceptance Criteria
- Output Format Rules
- Guardrails

### Medium

- Role
- Goal
- Context
- Constraints
- Optional: Assumptions, Clarifying Questions, Acceptance Criteria
- Output Format Rules
- Guardrails

### Hard

- Role
- Definitions
- Goal
- Non Goals
- Constraints
- Optional: Assumptions, Clarifying Questions, Acceptance Criteria
- Validation Checklist
- Output Format Rules
- Two-Step Chain:
  1. Plan only
  2. Execute and verify
- Guardrails

## Prompt Pack Structure

Prompt Pack always produces three prompts:

1. Discovery Prompt
2. Plan Prompt
3. Execution Prompt

Each prompt inherits the same mode structure and constraints, with a short Focus section to emphasize the intent of the prompt.

## Storage Schema

### Settings

Key: `textToPrompt.settings`

```json
{
  "mode": "easy",
  "outputTab": "single",
  "toggles": {
    "assumptions": false,
    "questions": false,
    "acceptance": false
  }
}
```

### Presets

Key: `textToPrompt.presets`

```json
[
  {
    "id": "preset-...",
    "name": "My Preset",
    "settings": { "mode": "hard", "outputTab": "single", "toggles": { "assumptions": true, "questions": true, "acceptance": true } },
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
]
```

### History

Key: `textToPrompt.history`

```json
[
  {
    "id": "history-...",
    "timestamp": "2025-01-01T00:00:00.000Z",
    "input": "Raw input...",
    "settings": { "mode": "medium", "outputTab": "single", "toggles": { "assumptions": true, "questions": true, "acceptance": false } },
    "output": "Markdown output...",
    "outputPack": "Prompt pack output..."
  }
]
```

## Future Enhancements

- Custom template editing per mode.
- Export history to Markdown or JSON.
- Additional prompt pack variants (e.g., critique, revise).
- Optional inline section reordering.
