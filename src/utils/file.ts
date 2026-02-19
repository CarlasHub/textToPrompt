export function downloadText(text: string, filename: string, mimeType: string): void {
  const blob = new Blob([text], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function downloadMarkdown(text: string, filename: string): void {
  downloadText(text, filename, "text/markdown");
}

export function downloadJson(text: string, filename: string): void {
  downloadText(text, filename, "application/json");
}
