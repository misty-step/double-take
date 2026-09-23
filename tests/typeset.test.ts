import { describe, expect, it } from "vitest";
import { curly } from "../lib/typeset";

describe("typographic quotes for display", () => {
  it("sets apostrophes in contractions, possessives, and before digits", () => {
    expect(curly("A villain's gloat")).toBe("A villain\u2019s gloat");
    expect(curly("It's 3 o'clock")).toBe("It\u2019s 3 o\u2019clock");
    expect(curly("back in the '90s")).toBe("back in the \u201990s");
  });

  it("opens and closes quotation marks by position", () => {
    expect(curly('He said "no" to me')).toBe("He said \u201Cno\u201D to me");
    expect(curly("She called it 'home'.")).toBe(
      "She called it \u2018home\u2019.",
    );
  });

  it("leaves text without quotes untouched", () => {
    expect(curly("Please stay on the line.")).toBe("Please stay on the line.");
  });
});
