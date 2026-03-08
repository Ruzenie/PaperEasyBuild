import { describe, expect, it } from "vitest";
import {
  DEFAULT_QUESTIONNAIRE_SUBTITLE_STYLE,
  DEFAULT_QUESTIONNAIRE_TITLE_STYLE,
  normalizeQuestionnaireHeader
} from "../../src/renderer/config/questionnaireHeader";

describe("questionnaire header normalization", () => {
  it("fills defaults when header is missing", () => {
    const normalized = normalizeQuestionnaireHeader(undefined);
    expect(normalized.title).toBe("");
    expect(normalized.subtitle).toBe("");
    expect(normalized.titleStyle).toEqual(DEFAULT_QUESTIONNAIRE_TITLE_STYLE);
    expect(normalized.subtitleStyle).toEqual(DEFAULT_QUESTIONNAIRE_SUBTITLE_STYLE);
  });

  it("normalizes text and clamps style values", () => {
    const normalized = normalizeQuestionnaireHeader({
      title: "   这是  标题   ",
      subtitle: " x ".repeat(400),
      titleStyle: { align: "right", fontSize: 120, color: "", bold: "yes", italic: false },
      subtitleStyle: { align: "left", fontSize: 6, color: "#123456", bold: true, italic: true }
    });

    expect(normalized.title).toBe("这是 标题");
    expect(normalized.subtitle.length).toBe(200);
    expect(normalized.titleStyle.align).toBe(DEFAULT_QUESTIONNAIRE_TITLE_STYLE.align);
    expect(normalized.titleStyle.fontSize).toBe(60);
    expect(normalized.titleStyle.color).toBe(DEFAULT_QUESTIONNAIRE_TITLE_STYLE.color);
    expect(normalized.titleStyle.bold).toBe(DEFAULT_QUESTIONNAIRE_TITLE_STYLE.bold);
    expect(normalized.subtitleStyle.align).toBe("left");
    expect(normalized.subtitleStyle.fontSize).toBe(8);
    expect(normalized.subtitleStyle.color).toBe("#123456");
  });
});
