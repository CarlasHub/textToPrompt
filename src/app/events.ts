import type { Mode, Store, Toggles } from "../state/state";
import { getModeDefaults, getDefaultSettings } from "../state/defaults";
import { refine } from "../engine/refine";
import { copyToClipboard } from "../utils/clipboard";
import { downloadJson, downloadMarkdown } from "../utils/file";
import { announce } from "../a11y/liveRegion";
import { handleTabKeydown } from "../utils/tabs";
import { saveSettings } from "../state/settings";
import {
  addHistory,
  clearHistory,
  createHistoryEntry
} from "../storage/history";
import {
  deletePreset,
  exportPresets,
  importPresets,
  savePreset
} from "../storage/presets";
import {
  getClearButton,
  getCopyButton,
  getDownloadButton,
  getGenerateButton,
  getInput,
  getModeRadios,
  getResetButton,
  getTabButtons,
  getToggleInputs
} from "./dom";

export function bindEvents(root: HTMLElement, store: Store): void {
  const input = getInput(root);
  if (input) {
    input.addEventListener("input", () => {
      store.update((state) => ({
        ...state,
        input: input.value,
        error: null
      }));
    });
  }

  getModeRadios(root).forEach((radio) => {
    radio.addEventListener("change", () => {
      if (!radio.checked) {
        return;
      }
      const mode = radio.value as Mode;
      const toggles = getModeDefaults(mode);
      const nextSettings = {
        ...store.getState().settings,
        mode,
        toggles
      };
      saveSettings(nextSettings);
      store.update((state) => ({
        ...state,
        settings: nextSettings,
        error: null
      }));
    });
  });

  getToggleInputs(root).forEach((toggle) => {
    toggle.addEventListener("change", () => {
      const key = toggle.dataset.toggle as keyof Toggles | undefined;
      if (!key) {
        return;
      }
      const nextSettings = {
        ...store.getState().settings,
        toggles: {
          ...store.getState().settings.toggles,
          [key]: toggle.checked
        }
      };
      saveSettings(nextSettings);
      store.update((state) => ({
        ...state,
        settings: nextSettings
      }));
    });
  });

  getTabButtons(root).forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab === "pack" ? "pack" : "single";
      const nextSettings = {
        ...store.getState().settings,
        outputTab: target
      };
      saveSettings(nextSettings);
      store.update((state) => ({
        ...state,
        settings: nextSettings
      }));
    });

    tab.addEventListener("keydown", (event) => {
      handleTabKeydown(event, root, store);
    });
  });

  const generateButton = getGenerateButton(root);
  if (generateButton) {
    generateButton.addEventListener("click", () => {
      const state = store.getState();
      if (!state.input.trim()) {
        store.update((current) => ({
          ...current,
          error: "Please enter some text before generating output."
        }));
        announce(root, "Error: input is required.");
        return;
      }

      const results = refine(state.input, state.settings);
      const entry = createHistoryEntry(state.input, state.settings, results.single, results.pack);
      const nextHistory = addHistory(state.history, entry);
      store.update((current) => ({
        ...current,
        output: results.single,
        outputPack: results.pack,
        history: nextHistory,
        error: null
      }));
    });
  }

  const copyButton = getCopyButton(root);
  if (copyButton) {
    copyButton.addEventListener("click", async () => {
      const { output, outputPack, settings } = store.getState();
      const text = settings.outputTab === "pack" ? outputPack : output;
      if (!text.trim()) {
        announce(root, "Nothing to copy yet.");
        return;
      }

      const success = await copyToClipboard(text);
      announce(root, success ? "Copied to clipboard." : "Copy failed.");
    });
  }

  const downloadButton = getDownloadButton(root);
  if (downloadButton) {
    downloadButton.addEventListener("click", () => {
      const { output, outputPack, settings } = store.getState();
      const text = settings.outputTab === "pack" ? outputPack : output;
      if (!text.trim()) {
        announce(root, "Nothing to download yet.");
        return;
      }
      downloadMarkdown(text, "textToPrompt-output.md");
      announce(root, "Download started.");
    });
  }

  const clearButton = getClearButton(root);
  if (clearButton) {
    clearButton.addEventListener("click", () => {
      store.update((state) => ({
        ...state,
        input: "",
        output: "",
        outputPack: "",
        error: null
      }));
      announce(root, "Input cleared.");
    });
  }

  const resetButton = getResetButton(root);
  if (resetButton) {
    resetButton.addEventListener("click", () => {
      const defaults = getDefaultSettings();
      saveSettings(defaults);
      store.update((state) => ({
        ...state,
        settings: defaults,
        output: "",
        outputPack: "",
        error: null
      }));
      announce(root, "Settings reset to defaults.");
    });
  }

  const presetsOpen = root.querySelector<HTMLButtonElement>("#btn-open-presets");
  if (presetsOpen) {
    presetsOpen.addEventListener("click", () => {
      store.update((state) => ({
        ...state,
        ui: {
          ...state.ui,
          presetDialogOpen: true,
          returnFocusId: presetsOpen.id
        }
      }));
    });
  }

  const historyOpen = root.querySelector<HTMLButtonElement>("#btn-open-history");
  if (historyOpen) {
    historyOpen.addEventListener("click", () => {
      store.update((state) => ({
        ...state,
        ui: {
          ...state.ui,
          historyDialogOpen: true,
          returnFocusId: historyOpen.id
        }
      }));
    });
  }

  const presetDialog = root.querySelector<HTMLDialogElement>("#dialog-presets");
  if (presetDialog) {
    presetDialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      store.update((state) => ({
        ...state,
        ui: { ...state.ui, presetDialogOpen: false }
      }));
    });

    presetDialog.addEventListener("close", () => {
      const current = store.getState();
      if (current.ui.presetDialogOpen) {
        store.update((state) => ({
          ...state,
          ui: { ...state.ui, presetDialogOpen: false }
        }));
      }
    });

    presetDialog.addEventListener("click", (event) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLButtonElement>(
        "button[data-action]"
      );
      if (!target) {
        return;
      }
      const action = target.dataset.action;
      const id = target.dataset.id;
      if (action === "close-presets") {
        store.update((state) => ({
          ...state,
          ui: { ...state.ui, presetDialogOpen: false }
        }));
        return;
      }
      if (action === "load-preset" && id) {
        const preset = store.getState().presets.find((item) => item.id === id);
        if (preset) {
          saveSettings(preset.settings);
          store.update((state) => ({
            ...state,
            settings: preset.settings,
            output: "",
            outputPack: "",
            error: null
          }));
          announce(root, "Preset loaded.");
        }
      }
      if (action === "delete-preset" && id) {
        const nextPresets = deletePreset(store.getState().presets, id);
        store.update((state) => ({
          ...state,
          presets: nextPresets
        }));
        announce(root, "Preset deleted.");
      }
    });

    const savePresetButton = presetDialog.querySelector<HTMLButtonElement>("#btn-save-preset");
    const presetNameInput = presetDialog.querySelector<HTMLInputElement>("#preset-name");
    if (savePresetButton && presetNameInput) {
      savePresetButton.addEventListener("click", () => {
        const name = presetNameInput.value.trim();
        if (!name) {
          announce(root, "Preset name is required.");
          presetNameInput.focus();
          return;
        }
        const nextPresets = savePreset(store.getState().presets, name, store.getState().settings);
        store.update((state) => ({
          ...state,
          presets: nextPresets
        }));
        presetNameInput.value = "";
        announce(root, "Preset saved.");
      });
    }

    const exportButton = presetDialog.querySelector<HTMLButtonElement>("#btn-export-presets");
    if (exportButton) {
      exportButton.addEventListener("click", () => {
        const json = exportPresets(store.getState().presets);
        downloadJson(json, "textToPrompt-presets.json");
        announce(root, "Presets exported.");
      });
    }

    const importButton = presetDialog.querySelector<HTMLButtonElement>("#btn-import-presets");
    const importInput = presetDialog.querySelector<HTMLInputElement>("#preset-import");
    if (importButton && importInput) {
      importButton.addEventListener("click", () => {
        importInput.click();
      });

      importInput.addEventListener("change", async () => {
        const file = importInput.files?.[0];
        if (!file) {
          return;
        }
        const text = await file.text();
        const nextPresets = importPresets(text, store.getState().presets);
        store.update((state) => ({
          ...state,
          presets: nextPresets
        }));
        importInput.value = "";
        announce(root, "Presets imported.");
      });
    }
  }

  const historyDialog = root.querySelector<HTMLDialogElement>("#dialog-history");
  if (historyDialog) {
    historyDialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      store.update((state) => ({
        ...state,
        ui: { ...state.ui, historyDialogOpen: false }
      }));
    });

    historyDialog.addEventListener("close", () => {
      const current = store.getState();
      if (current.ui.historyDialogOpen) {
        store.update((state) => ({
          ...state,
          ui: { ...state.ui, historyDialogOpen: false }
        }));
      }
    });

    historyDialog.addEventListener("click", (event) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLButtonElement>(
        "button[data-action]"
      );
      if (!target) {
        return;
      }
      const action = target.dataset.action;
      const id = target.dataset.id;
      if (action === "close-history") {
        store.update((state) => ({
          ...state,
          ui: { ...state.ui, historyDialogOpen: false }
        }));
        return;
      }
      if (action === "load-history" && id) {
        const entry = store.getState().history.find((item) => item.id === id);
        if (entry) {
          saveSettings(entry.settings);
          store.update((state) => ({
            ...state,
            input: entry.input,
            settings: entry.settings,
            output: entry.output,
            outputPack: entry.outputPack,
            error: null
          }));
          announce(root, "History entry restored.");
        }
      }
    });

    const clearHistoryButton = historyDialog.querySelector<HTMLButtonElement>("#btn-clear-history");
    if (clearHistoryButton) {
      clearHistoryButton.addEventListener("click", () => {
        const nextHistory = clearHistory();
        store.update((state) => ({
          ...state,
          history: nextHistory
        }));
        announce(root, "History cleared.");
      });
    }
  }
}
