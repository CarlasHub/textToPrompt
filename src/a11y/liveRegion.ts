export function announce(root: HTMLElement, message: string, politeness: "polite" | "assertive" = "polite"): void {
  const region = root.querySelector<HTMLElement>("#live-region");
  if (!region) {
    return;
  }
  region.setAttribute("aria-live", politeness);
  region.textContent = "";
  window.setTimeout(() => {
    region.textContent = message;
  }, 10);
}
