import { normalizeLineEndings } from "../utils/text";

const constraintPatterns = [
  /\bmust\b/i,
  /\bmust not\b/i,
  /\bdo not\b/i,
  /\bdon't\b/i,
  /\bavoid\b/i,
  /\binclude\b/i,
  /\bexclude\b/i
];

const deliverableKeywords = [
  "report",
  "code",
  "email",
  "plan",
  "checklist",
  "proposal",
  "summary",
  "spec",
  "specification",
  "table",
  "list",
  "diagram",
  "presentation",
  "guide",
  "brief",
  "outline"
];

function collapseSpaces(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function isBulletLine(line: string): boolean {
  return /^\s*([-*•]|\d+\.)\s+/.test(line);
}

function normalizeLine(line: string): string {
  if (!line.trim()) {
    return "";
  }

  if (isBulletLine(line)) {
    const match = line.match(/^(\s*[-*•]|\s*\d+\.)\s+(.*)$/);
    if (!match) {
      return line.trimEnd();
    }
    const prefix = match[1];
    const content = collapseSpaces(match[2]);
    return `${prefix} ${content}`;
  }

  return collapseSpaces(line);
}

export function normalizeText(input: string): string {
  const normalized = normalizeLineEndings(input);
  const rawLines = normalized.split("\n");
  const cleanedLines: string[] = [];

  for (const line of rawLines) {
    cleanedLines.push(normalizeLine(line));
  }

  // Trim leading and trailing empty lines
  while (cleanedLines.length && cleanedLines[0] === "") {
    cleanedLines.shift();
  }
  while (cleanedLines.length && cleanedLines[cleanedLines.length - 1] === "") {
    cleanedLines.pop();
  }

  // Collapse multiple empty lines into one
  const collapsed: string[] = [];
  let lastWasEmpty = false;
  for (const line of cleanedLines) {
    if (line === "") {
      if (!lastWasEmpty) {
        collapsed.push("");
      }
      lastWasEmpty = true;
    } else {
      collapsed.push(line);
      lastWasEmpty = false;
    }
  }

  return collapsed.join("\n");
}

export function extractConstraints(lines: string[]): string[] {
  const results: string[] = [];
  const seen = new Set<string>();

  for (const line of lines) {
    if (!line.trim()) {
      continue;
    }
    const matches = constraintPatterns.some((pattern) => pattern.test(line));
    if (matches) {
      const key = line.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        results.push(line.trim());
      }
    }
  }

  return results;
}

export function extractDeliverables(text: string): string[] {
  const lower = text.toLowerCase();
  const results: string[] = [];
  for (const keyword of deliverableKeywords) {
    const pattern = new RegExp(`\\b${keyword}\\b`, "i");
    if (pattern.test(lower)) {
      results.push(keyword);
    }
  }
  return results;
}

export function splitLines(text: string): string[] {
  return text.split("\n");
}
