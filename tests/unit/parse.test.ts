import { describe, expect, it } from "vitest";
import { extractConstraints, normalizeText, splitLines } from "../../src/engine/parse";

describe("normalizeText", () => {
  it("handles whitespace and line endings", () => {
    const input = "  Hello   world\r\n\r\n-   first   bullet\r\n   - second   bullet  ";
    const output = normalizeText(input);
    expect(output).toBe("Hello world\n\n- first bullet\n- second bullet");
  });
});

describe("extractConstraints", () => {
  it("finds must, do not, avoid, include lines", () => {
    const input = [
      "Must include tests",
      "Do not use React",
      "Avoid external APIs",
      "Include keyboard support",
      "This line is informational"
    ].join("\n");

    const normalized = normalizeText(input);
    const constraints = extractConstraints(splitLines(normalized));
    expect(constraints).toHaveLength(4);
    expect(constraints.join("\n")).toMatch(/Must include tests/);
    expect(constraints.join("\n")).toMatch(/Do not use React/);
    expect(constraints.join("\n")).toMatch(/Avoid external APIs/);
    expect(constraints.join("\n")).toMatch(/Include keyboard support/);
  });
});
