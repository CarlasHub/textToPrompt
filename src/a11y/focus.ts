function escapeSelector(value: string): string {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
    return CSS.escape(value);
  }
  return value.replace(/[^a-zA-Z0-9_-]/g, "\\$&");
}

export function restoreFocus(root: HTMLElement, focusId: string | null): void {
  if (!focusId) {
    return;
  }
  const selector = `#${escapeSelector(focusId)}`;
  const element = root.querySelector<HTMLElement>(selector);
  if (element) {
    element.focus({ preventScroll: true });
  }
}
