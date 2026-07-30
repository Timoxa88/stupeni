import { describe, expect, test } from "bun:test";
import { plural } from "./format";

const pos = (n: number) => plural(n, "позиция", "позиции", "позиций");

describe("plural", () => {
  test("им. падеж: позиция/позиции/позиций", () => {
    expect(pos(1)).toBe("позиция");
    expect(pos(2)).toBe("позиции");
    expect(pos(4)).toBe("позиции");
    expect(pos(5)).toBe("позиций");
    expect(pos(11)).toBe("позиций");
    expect(pos(14)).toBe("позиций");
    expect(pos(21)).toBe("позиция");
    expect(pos(22)).toBe("позиции");
    expect(pos(0)).toBe("позиций");
    expect(pos(162)).toBe("позиции");
  });

  test("род. падеж после «от»: производителя/производителей", () => {
    const gen = (n: number) => plural(n, "производителя", "производителей", "производителей");
    expect(gen(1)).toBe("производителя");
    expect(gen(3)).toBe("производителей");
    expect(gen(6)).toBe("производителей");
    expect(gen(21)).toBe("производителя");
  });
});
