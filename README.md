<p align="center">
  <img src="public/carlas-hub-logo.png" alt="Carla's Hub logo" width="420" />
</p>

# textToPrompt

textToPrompt is a static, browser-only app that refines raw text into structured prompts. It runs entirely in the client, stores only in `localStorage`, and is designed for accessible, keyboard-friendly use.

## Features

- Easy / Medium / Hard modes with visibly different output structures.
- Single Prompt or Prompt Pack output.
- Optional sections: assumptions, questions, acceptance criteria.
- Copy to clipboard and download as `.md`.
- Clear input and reset settings.
- Presets (save/load/delete, import/export JSON).
- History of the last 20 generations.
- Fully static and deployable to GitHub Pages.

## Mode Differences

- **Easy**: Goal, Context, Input, Requested Output Format, Constraints.
- **Medium**: Role, Goal, Context, Constraints, optional assumptions/questions/acceptance.
- **Hard**: Role, Definitions, Goal, Non Goals, Constraints, optional assumptions/questions/acceptance, Validation Checklist, Output Format Rules, Two-Step Chain.

Defaults:
- Easy: assumptions/questions/acceptance off.
- Medium: assumptions/questions on, acceptance off.
- Hard: assumptions/questions/acceptance on.

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

## Tests

- Unit tests:

```bash
npm run test
```

- End-to-end tests:

```bash
npm run test:e2e
```

## Deployment (GitHub Pages)

The project uses a GitHub Actions workflow to build and deploy to GitHub Pages on `main`.

- The Vite base path is set using `VITE_BASE_PATH` in the deploy workflow.
- GitHub Pages URL pattern:

```
https://<username>.github.io/<repo-name>/
```

## Accessibility Notes

- All controls are keyboard operable.
- The output tab switcher supports arrow key navigation.
- Copy and error actions announce messages via a polite `aria-live` region.
- Dialogs restore focus to the trigger button on close.

### Manual Checklist

Screen reader smoke test:
1. Navigate to the input, mode radios, and toggles.
2. Generate output and confirm sections are announced.
3. Trigger copy and verify the live region announcement.

Keyboard-only smoke test:
1. Tab to input, type, change modes, and generate.
2. Use arrow keys in output tabs.
3. Open and close presets/history dialogs and confirm focus returns.

Zoom and reflow test:
1. Zoom to 200%.
2. Confirm layout stacks cleanly with no horizontal scrolling.

## Data Privacy

textToPrompt does not store or send any data remotely. It only uses `localStorage` for settings, presets, and history.

## Implementation Notes (clarifications)

- Reset settings restores default mode/toggles and clears output to avoid mismatched settings.
- Importing presets merges them into the existing list with new IDs.
- History is capped at the last 20 generations.

---

Credit: [CarlasHub](https://github.com/CarlasHub)
