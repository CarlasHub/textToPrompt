export function getInput(root: HTMLElement): HTMLTextAreaElement | null {
  return root.querySelector<HTMLTextAreaElement>("#input-text");
}

export function getModeRadios(root: HTMLElement): NodeListOf<HTMLInputElement> {
  return root.querySelectorAll<HTMLInputElement>("input[name='mode']");
}

export function getToggleInputs(root: HTMLElement): NodeListOf<HTMLInputElement> {
  return root.querySelectorAll<HTMLInputElement>("input[data-toggle]");
}

export function getTabButtons(root: HTMLElement): NodeListOf<HTMLButtonElement> {
  return root.querySelectorAll<HTMLButtonElement>("[role='tab']");
}

export function getGenerateButton(root: HTMLElement): HTMLButtonElement | null {
  return root.querySelector<HTMLButtonElement>("#btn-generate");
}

export function getCopyButton(root: HTMLElement): HTMLButtonElement | null {
  return root.querySelector<HTMLButtonElement>("#btn-copy");
}

export function getDownloadButton(root: HTMLElement): HTMLButtonElement | null {
  return root.querySelector<HTMLButtonElement>("#btn-download");
}

export function getClearButton(root: HTMLElement): HTMLButtonElement | null {
  return root.querySelector<HTMLButtonElement>("#btn-clear");
}

export function getResetButton(root: HTMLElement): HTMLButtonElement | null {
  return root.querySelector<HTMLButtonElement>("#btn-reset");
}
