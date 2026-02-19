import { createStore, type AppState, type Store } from "../state/state";
import { loadInitialState } from "../state/initialize";
import { renderApp } from "./render";
import { bindEvents } from "./events";
import { restoreFocus } from "../a11y/focus";

export function initApp(root: HTMLElement): void {
  const store = createStore(loadInitialState());

  const render = () => {
    const activeId = document.activeElement instanceof HTMLElement ? document.activeElement.id : null;
    renderApp(root, store.getState());
    bindEvents(root, store);
    restoreFocus(root, activeId);
    syncDialogs(root, store.getState(), store);
  };

  render();
  store.subscribe(render);
}

function syncDialogs(root: HTMLElement, state: AppState, store: Store): void {
  const presetDialog = root.querySelector<HTMLDialogElement>(\"#dialog-presets\");
  if (presetDialog) {
    if (state.ui.presetDialogOpen && !presetDialog.open) {
      presetDialog.showModal();
      presetDialog.querySelector<HTMLInputElement>(\"#preset-name\")?.focus();
    }
    if (!state.ui.presetDialogOpen && presetDialog.open) {
      presetDialog.close();
    }
  }

  const historyDialog = root.querySelector<HTMLDialogElement>(\"#dialog-history\");
  if (historyDialog) {
    if (state.ui.historyDialogOpen && !historyDialog.open) {
      historyDialog.showModal();
      historyDialog.querySelector<HTMLButtonElement>(\"[data-action='close-history']\")?.focus();
    }
    if (!state.ui.historyDialogOpen && historyDialog.open) {
      historyDialog.close();
    }
  }

  if (!state.ui.presetDialogOpen && !state.ui.historyDialogOpen && state.ui.returnFocusId) {
    const target = root.querySelector<HTMLElement>(`#${state.ui.returnFocusId}`);
    target?.focus();
    store.update((current) => ({
      ...current,
      ui: { ...current.ui, returnFocusId: null }
    }));
  }
}
