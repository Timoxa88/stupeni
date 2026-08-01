import { describe, expect, test as it } from "bun:test";
import { clampTitle, TITLE_LIMIT } from "./title";

describe("clampTitle", () => {
  it("короткое название получает и «цена, характеристики», и бренд сайта", () => {
    const t = clampTitle("Ступени Paradyz Cloud Brown");
    expect(t).toBe("Ступени Paradyz Cloud Brown — цена, характеристики — Hit Ceramics");
    expect(t.length).toBeLessThanOrEqual(TITLE_LIMIT);
  });

  it("длинное название жертвует хвостами, но не режется многоточием", () => {
    const raw =
      "Клинкерные ступени Stroeher Keraplatte Terra 316 patrizierrot ofenbunt — цена, характеристики";
    const t = clampTitle(raw);
    expect(t.length).toBeLessThanOrEqual(TITLE_LIMIT);
    expect(t).toContain("Stroeher Keraplatte Terra 316 patrizierrot ofenbunt");
    expect(t).not.toContain("…");
  });

  it("не дублирует бренд сайта, если он уже в строке", () => {
    const t = clampTitle("Ступени Paradyz Cloud — цена — Hit Ceramics");
    expect(t.match(/Hit Ceramics/g)).toHaveLength(1);
  });

  it("укладывается в лимит на всех реальных заголовках каталога", () => {
    const samples = [
      "Клинкерная напольная плитка Stroeher Keraplatte Aera 717 anthra — цена, характеристики",
      "Клинкерные ступени Westerwälder Klinker MONTMARTRE Naturabeige — цена, характеристики",
      "Клинкерные ступени Interbau Nature Art Lava schwarz — цена, характеристики",
      "Ступени Paradyz Viano Beige — цена, характеристики",
    ];
    for (const s of samples) {
      expect(clampTitle(s).length).toBeLessThanOrEqual(TITLE_LIMIT);
    }
  });

  it("не дописывает «цена», если она уже есть в заголовке", () => {
    const t = clampTitle("Paradyz Cloud — цвета и цены, крыльцо");
    expect(t).toBe("Paradyz Cloud — цвета и цены, крыльцо — Hit Ceramics");
    expect(t.match(/цен/gi)).toHaveLength(1);
  });

  it("длинный заголовок листинга жертвует брендом сайта, а не смыслом", () => {
    const t = clampTitle("Westerwälder Klinker MONTMARTRE — цвета и цены, уличная лестница");
    expect(t.length).toBeLessThanOrEqual(TITLE_LIMIT);
    expect(t).toContain("уличная лестница");
  });

  it("название длиннее лимита режется по границе слова", () => {
    const t = clampTitle("А".repeat(40) + " " + "Б".repeat(40));
    expect(t.length).toBeLessThanOrEqual(TITLE_LIMIT);
    expect(t.endsWith("…")).toBe(true);
  });
});
