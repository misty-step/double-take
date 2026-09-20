import { describe, expect, it } from "vitest";
import { showsGameTable } from "../lib/room-view";

describe("room game gating", () => {
  it("shows the table while the platform match is active", () => {
    expect(showsGameTable(true, "writing")).toBe(true);
    expect(showsGameTable(true, "reveal")).toBe(true);
    expect(showsGameTable(true, "finished")).toBe(true);
  });

  it("keeps the standings on screen after the match finishes", () => {
    expect(showsGameTable(false, "finished")).toBe(true);
  });

  it("falls back to the lobby for an abandoned match or no game", () => {
    expect(showsGameTable(false, "writing")).toBe(false);
    expect(showsGameTable(false, "reveal")).toBe(false);
    expect(showsGameTable(false, null)).toBe(false);
    expect(showsGameTable(false, undefined)).toBe(false);
  });
});
