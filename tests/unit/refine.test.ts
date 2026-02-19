import { describe, expect, it } from "vitest";
import { refine } from "../../src/engine/refine";
import { getDefaultSettings } from "../../src/state/defaults";

const sampleInput = "Build a checklist. Must include timelines.";

describe("refine", () => {
  it("includes required sections for easy mode", () => {
    const settings = getDefaultSettings("easy");
    const output = refine(sampleInput, settings).single;
    expect(output).toMatch(/## Goal/);
    expect(output).toMatch(/## Context/);
    expect(output).toMatch(/## Input/);
    expect(output).toMatch(/## Requested Output Format/);
    expect(output).toMatch(/## Constraints/);
  });

  it("includes required sections for medium mode", () => {
    const settings = getDefaultSettings("medium");
    const output = refine(sampleInput, settings).single;
    expect(output).toMatch(/## Role/);
    expect(output).toMatch(/## Goal/);
    expect(output).toMatch(/## Context/);
    expect(output).toMatch(/## Constraints/);
  });

  it("includes required sections for hard mode", () => {
    const settings = getDefaultSettings("hard");
    const output = refine(sampleInput, settings).single;
    expect(output).toMatch(/## Definitions/);
    expect(output).toMatch(/## Non Goals/);
    expect(output).toMatch(/## Validation Checklist/);
    expect(output).toMatch(/## Two-Step Chain/);
    expect(output).toMatch(/Plan only/);
    expect(output).toMatch(/Execute and verify/);
  });

  it("creates a prompt pack with 3 prompts", () => {
    const settings = getDefaultSettings("medium");
    const pack = refine(sampleInput, settings).pack;
    expect(pack).toMatch(/# Discovery Prompt/);
    expect(pack).toMatch(/# Plan Prompt/);
    expect(pack).toMatch(/# Execution Prompt/);
  });

  it("is stable for a fixed input", () => {
    const settings = getDefaultSettings("hard");
    const first = refine(sampleInput, settings).single;
    const second = refine(sampleInput, settings).single;
    expect(first).toBe(second);
  });
});
