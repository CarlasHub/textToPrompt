import type { Store } from "../state/state";
import { saveSettings } from "../state/settings";

export function handleTabKeydown(event: KeyboardEvent, root: HTMLElement, store: Store): void {
  const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
  if (!keys.includes(event.key)) {
    return;
  }

  const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>("[role='tab']"));
  const current = event.currentTarget as HTMLButtonElement | null;
  const currentIndex = current ? tabs.indexOf(current) : -1;
  if (currentIndex === -1) {
    return;
  }

  let nextIndex = currentIndex;
  if (event.key === "ArrowLeft") {
    nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
  } else if (event.key === "ArrowRight") {
    nextIndex = (currentIndex + 1) % tabs.length;
  } else if (event.key === "Home") {
    nextIndex = 0;
  } else if (event.key === "End") {
    nextIndex = tabs.length - 1;
  }

  const nextTab = tabs[nextIndex];
  if (!nextTab) {
    return;
  }

  event.preventDefault();
  const target = nextTab.dataset.tab === "pack" ? "pack" : "single";
  const nextSettings = {
    ...store.getState().settings,
    outputTab: target
  };
  saveSettings(nextSettings);
  store.update((state) => ({
    ...state,
    settings: nextSettings
  }));
  nextTab.focus();
}
