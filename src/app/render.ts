import type { AppState, Mode } from "../state/state";
import { escapeHtml } from "../utils/text";

function modeLabel(mode: Mode): string {
  switch (mode) {
    case "easy":
      return "Easy";
    case "medium":
      return "Medium";
    case "hard":
      return "Hard";
  }
}

export function renderApp(root: HTMLElement, state: AppState): void {
  const baseUrl = import.meta.env.BASE_URL;
  const inputValue = escapeHtml(state.input);
  const singleOutput = state.output;
  const packOutput = state.outputPack;
  const singleIsEmpty = singleOutput.trim().length === 0;
  const packIsEmpty = packOutput.trim().length === 0;

  const singleDisplay = singleIsEmpty
    ? "Generate to see your Single Prompt output."
    : singleOutput;
  const packDisplay = packIsEmpty
    ? "Generate to see your Prompt Pack output."
    : packOutput;

  const presetsList =
    state.presets.length === 0
      ? `<p class="empty">No presets saved yet.</p>`
      : state.presets
          .map(
            (preset) => `
              <div class="list-item">
                <div>
                  <strong>${escapeHtml(preset.name)}</strong>
                  <span class="meta">${escapeHtml(preset.updatedAt)}</span>
                </div>
                <div class="list-actions">
                  <button class="ghost" data-action="load-preset" data-id="${preset.id}" aria-label="Load preset ${escapeHtml(
              preset.name
            )}">Load</button>
                  <button class="ghost" data-action="delete-preset" data-id="${preset.id}" aria-label="Delete preset ${escapeHtml(
              preset.name
            )}">Delete</button>
                </div>
              </div>
            `
          )
          .join("");

  const historyList =
    state.history.length === 0
      ? `<p class="empty">No history yet.</p>`
      : state.history
          .map((entry) => {
            const preview = entry.input.trim().slice(0, 80);
            return `
              <div class="list-item">
                <div>
                  <strong>${escapeHtml(preview || "(Empty input)")}</strong>
                  <span class="meta">${escapeHtml(entry.timestamp)}</span>
                </div>
                <div class="list-actions">
                  <button class="ghost" data-action="load-history" data-id="${entry.id}" aria-label="Restore history entry">Restore</button>
                </div>
              </div>
            `;
          })
          .join("");

  root.innerHTML = `
    <main class="app">
      <div class="background"></div>
      <div id="live-region" class="sr-only" aria-live="polite" aria-atomic="true"></div>
      <header class="app__header">
        <img class="brand-logo" src="${baseUrl}carlas-hub-logo.png" alt="Carla's Hub logo" />
        <div>
          <p class="kicker">Refine raw text into structured prompts</p>
          <h1>textToPrompt</h1>
          <p class="subtitle">Static, local-first prompt refinement with mode-aware structure.</p>
        </div>
      </header>
      <div class="grid">
        <section class="panel panel--input" aria-labelledby="input-title">
          <div class="panel__header">
            <h2 id="input-title">Input</h2>
            <p class="panel__hint">Paste your raw request and choose the structure you want.</p>
          </div>
          <label class="field" for="input-text">
            <span class="field__label">Raw text</span>
            <textarea id="input-text" rows="9" spellcheck="true">${inputValue}</textarea>
          </label>
          <fieldset class="fieldset">
            <legend>Mode</legend>
            <div class="radio-group">
              <label class="radio">
                <input type="radio" name="mode" value="easy" ${state.settings.mode === "easy" ? "checked" : ""} />
                <span>Easy</span>
              </label>
              <label class="radio">
                <input type="radio" name="mode" value="medium" ${state.settings.mode === "medium" ? "checked" : ""} />
                <span>Medium</span>
              </label>
              <label class="radio">
                <input type="radio" name="mode" value="hard" ${state.settings.mode === "hard" ? "checked" : ""} />
                <span>Hard</span>
              </label>
            </div>
          </fieldset>
          <fieldset class="fieldset">
            <legend>Optional Sections</legend>
            <div class="toggle-group">
              <label class="toggle">
                <input type="checkbox" data-toggle="assumptions" ${state.settings.toggles.assumptions ? "checked" : ""} />
                <span>Include assumptions</span>
              </label>
              <label class="toggle">
                <input type="checkbox" data-toggle="questions" ${state.settings.toggles.questions ? "checked" : ""} />
                <span>Include questions</span>
              </label>
              <label class="toggle">
                <input type="checkbox" data-toggle="acceptance" ${state.settings.toggles.acceptance ? "checked" : ""} />
                <span>Include acceptance criteria</span>
              </label>
            </div>
          </fieldset>
          <div class="button-row">
            <button id="btn-generate" class="primary">Generate</button>
            <button id="btn-clear" class="ghost">Clear input</button>
            <button id="btn-reset" class="ghost">Reset settings</button>
          </div>
          <div class="button-row">
            <button id="btn-open-presets" class="ghost">Presets</button>
            <button id="btn-open-history" class="ghost">History</button>
          </div>
          ${state.error ? `<div class="error" role="alert">${escapeHtml(state.error)}</div>` : ""}
          <div class="mode-badge" aria-hidden="true">Current mode: ${modeLabel(state.settings.mode)}</div>
        </section>
        <section class="panel panel--output" aria-labelledby="output-title">
          <div class="panel__header">
            <h2 id="output-title">Output</h2>
            <p class="panel__hint">Switch between a single prompt and a 3-step prompt pack.</p>
          </div>
          <div class="segmented" role="tablist" aria-label="Output format">
            <button
              id="tab-single"
              role="tab"
              aria-selected="${state.settings.outputTab === "single"}"
              aria-controls="panel-single"
              tabindex="${state.settings.outputTab === "single" ? "0" : "-1"}"
              data-tab="single"
            >
              Single Prompt
            </button>
            <button
              id="tab-pack"
              role="tab"
              aria-selected="${state.settings.outputTab === "pack"}"
              aria-controls="panel-pack"
              tabindex="${state.settings.outputTab === "pack" ? "0" : "-1"}"
              data-tab="pack"
            >
              Prompt Pack
            </button>
          </div>
          <div class="tabpanel" id="panel-single" role="tabpanel" aria-labelledby="tab-single" ${state.settings.outputTab === "single" ? "" : "hidden"}>
            <pre class="output" data-empty="${singleIsEmpty}">${escapeHtml(singleDisplay)}</pre>
          </div>
          <div class="tabpanel" id="panel-pack" role="tabpanel" aria-labelledby="tab-pack" ${state.settings.outputTab === "pack" ? "" : "hidden"}>
            <pre class="output" data-empty="${packIsEmpty}">${escapeHtml(packDisplay)}</pre>
          </div>
          <div class="button-row">
            <button id="btn-copy" class="primary">Copy output</button>
            <button id="btn-download" class="ghost">Download .md</button>
          </div>
        </section>
      </div>

      <dialog id="dialog-presets" aria-labelledby="presets-title">
        <div class="dialog">
          <header class="dialog__header">
            <h3 id="presets-title">Presets</h3>
            <button class="ghost" data-action="close-presets" aria-label="Close presets">Close</button>
          </header>
          <label class="field" for="preset-name">
            <span class="field__label">Preset name</span>
            <input id="preset-name" type="text" autocomplete="off" />
          </label>
          <div class="button-row">
            <button id="btn-save-preset" class="primary">Save preset</button>
            <button id="btn-export-presets" class="ghost">Export presets</button>
            <button id="btn-import-presets" class="ghost">Import presets</button>
            <input id="preset-import" type="file" accept="application/json" class="sr-only" />
          </div>
          <div class="list">
            ${presetsList}
          </div>
        </div>
      </dialog>

      <dialog id="dialog-history" aria-labelledby="history-title">
        <div class="dialog">
          <header class="dialog__header">
            <h3 id="history-title">History</h3>
            <button class="ghost" data-action="close-history" aria-label="Close history">Close</button>
          </header>
          <div class="button-row">
            <button id="btn-clear-history" class="ghost">Clear history</button>
          </div>
          <div class="list">
            ${historyList}
          </div>
        </div>
      </dialog>
    </main>
  `;
}
